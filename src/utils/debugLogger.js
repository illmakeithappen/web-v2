/**
 * Debug Logger Utility
 * Comprehensive logging and diagnostics for course generation
 */

class DebugLogger {
  constructor(context = 'App') {
    this.context = context;
    this.timings = {};
    this.enabled = true; // Always enabled for debugging
  }

  /**
   * Log with emoji prefix for easy filtering
   */
  log(emoji, message, data = null) {
    if (!this.enabled) return;

    const timestamp = new Date().toISOString().split('T')[1];
    const prefix = `[${timestamp}] ${emoji} [${this.context}]`;

    if (data) {
      console.log(`${prefix} ${message}`, data);
    } else {
      console.log(`${prefix} ${message}`);
    }
  }

  /**
   * Start timing an operation
   */
  startTiming(operation) {
    this.timings[operation] = {
      start: performance.now(),
      end: null,
      duration: null
    };
    this.log('⏱️', `Started: ${operation}`);
  }

  /**
   * End timing an operation
   */
  endTiming(operation) {
    if (!this.timings[operation]) {
      this.log('⚠️', `No timing found for: ${operation}`);
      return null;
    }

    this.timings[operation].end = performance.now();
    this.timings[operation].duration =
      this.timings[operation].end - this.timings[operation].start;

    const duration = Math.round(this.timings[operation].duration);
    this.log('✅', `Completed: ${operation} (${duration}ms)`);

    return duration;
  }

  /**
   * Get timing info
   */
  getTiming(operation) {
    return this.timings[operation];
  }

  /**
   * Log network request details
   */
  logRequest(method, url, data = null) {
    this.log('📡', `${method} ${url}`, data);
  }

  /**
   * Log network response details
   */
  logResponse(url, response, duration) {
    const size = this.estimateSize(response);
    this.log('📥', `Response from ${url}`, {
      status: response.status,
      statusText: response.statusText,
      duration: `${duration}ms`,
      size: this.formatBytes(size),
      dataKeys: response.data ? Object.keys(response.data) : []
    });
  }

  /**
   * Validate response structure
   */
  validateResponse(response, requiredFields = []) {
    const validation = {
      valid: true,
      errors: [],
      warnings: []
    };

    // Check if response exists
    if (!response) {
      validation.valid = false;
      validation.errors.push('Response is null or undefined');
      return validation;
    }

    // Check if response has data
    if (!response.data) {
      validation.valid = false;
      validation.errors.push('Response has no data property');
      return validation;
    }

    // Check required fields
    requiredFields.forEach(field => {
      if (!(field in response.data)) {
        validation.valid = false;
        validation.errors.push(`Missing required field: ${field}`);
      } else if (response.data[field] === null || response.data[field] === undefined) {
        validation.warnings.push(`Field ${field} is null or undefined`);
      }
    });

    // Log validation results
    if (!validation.valid) {
      this.log('❌', 'Response validation failed', validation);
    } else if (validation.warnings.length > 0) {
      this.log('⚠️', 'Response validation warnings', validation);
    } else {
      this.log('✅', 'Response validation passed');
    }

    return validation;
  }

  /**
   * Estimate object size in bytes
   */
  estimateSize(obj) {
    try {
      const json = JSON.stringify(obj);
      return new Blob([json]).size;
    } catch (e) {
      this.log('⚠️', 'Failed to estimate size', e);
      return 0;
    }
  }

  /**
   * Format bytes to human-readable string
   */
  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }

  /**
   * Log state update
   */
  logStateUpdate(stateName, oldValue, newValue) {
    this.log('🔄', `State Update: ${stateName}`, {
      from: oldValue,
      to: newValue,
      changed: oldValue !== newValue
    });
  }

  /**
   * Log error with full context
   */
  logError(error, context = {}) {
    this.log('💥', 'ERROR OCCURRED', {
      message: error.message,
      name: error.name,
      stack: error.stack,
      context
    });
  }

  /**
   * Create summary of all timings
   */
  getTimingSummary() {
    const summary = {};
    Object.keys(this.timings).forEach(key => {
      if (this.timings[key].duration !== null) {
        summary[key] = `${Math.round(this.timings[key].duration)}ms`;
      }
    });
    return summary;
  }

  /**
   * Log JSON parsing attempt
   */
  logJsonParsing(data) {
    this.startTiming('JSON_PARSE');
    try {
      const parsed = typeof data === 'string' ? JSON.parse(data) : data;
      this.endTiming('JSON_PARSE');
      this.log('✅', 'JSON parsing successful', {
        type: typeof data,
        size: this.formatBytes(this.estimateSize(parsed))
      });
      return { success: true, data: parsed };
    } catch (error) {
      this.endTiming('JSON_PARSE');
      this.logError(error, { dataPreview: String(data).substring(0, 100) });
      return { success: false, error };
    }
  }

  /**
   * Monitor axios request/response
   */
  createAxiosInterceptor() {
    return {
      request: (config) => {
        const reqId = `REQ_${Date.now()}`;
        config.metadata = { reqId, startTime: performance.now() };
        this.logRequest(config.method.toUpperCase(), config.url, config.data);
        return config;
      },

      response: (response) => {
        const duration = response.config.metadata
          ? Math.round(performance.now() - response.config.metadata.startTime)
          : 0;

        this.logResponse(response.config.url, response, duration);
        return response;
      },

      error: (error) => {
        if (error.config?.metadata) {
          const duration = Math.round(performance.now() - error.config.metadata.startTime);
          this.log('❌', `Request failed after ${duration}ms`, {
            url: error.config.url,
            message: error.message,
            code: error.code,
            status: error.response?.status
          });
        } else {
          this.logError(error);
        }
        return Promise.reject(error);
      }
    };
  }
}

// Create singleton instance
const debugLogger = new DebugLogger('CourseGenerator');

export default debugLogger;
