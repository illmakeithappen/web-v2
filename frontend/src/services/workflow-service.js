/**
 * Workflow Generator Service
 * Handles conversational workflow generation with Claude via Anthropic API
 *
 * Two-phase workflow generation:
 * - Phase 1: Conversational outline (discover, answer, generate, refine)
 * - Phase 2: Structured expansion (finalize)
 */

class WorkflowService {
  constructor() {
    this.apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
    this.baseUrl = `${this.apiUrl}/api/v1/workflow`;
    // Convert HTTP URL to WebSocket URL
    this.wsUrl = this.apiUrl.replace(/^http/, 'ws');
    this.wsBaseUrl = `${this.wsUrl}/api/v1/workflow/ws`;
  }

  /**
   * Parse Server-Sent Events stream
   * @param {Response} response - Fetch API response object
   * @param {Function} onEvent - Callback for each event
   * @returns {Promise<void>}
   */
  async parseSSE(response, onEvent) {
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    try {
      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');

        // Keep the last incomplete line in the buffer
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);

            if (data.trim()) {
              try {
                const event = JSON.parse(data);

                // Process event before checking for done
                if (event.type !== 'done') {
                  onEvent(event);
                }

                // Stop if done (after processing)
                if (event.type === 'done') {
                  return;
                }
              } catch (e) {
                console.error('Failed to parse SSE data:', data, e);
              }
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  }

  /**
   * Phase 1a: Discover - Analyze task and ask clarifying questions
   * @param {Object} params
   * @param {string} params.workflowType - 'navigate', 'educate', or 'deploy'
   * @param {string} params.taskDescription - What you want to accomplish
   * @param {string} params.context - Optional context/constraints
   * @param {string} params.sessionId - Session identifier (default: 'default')
   * @param {Function} onEvent - Callback for each event
   * @returns {Promise<void>}
   */
  async discover({ workflowType, taskDescription, context, sessionId = 'default' }, onEvent) {
    const response = await fetch(`${this.baseUrl}/discover?session_id=${sessionId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        workflow_type: workflowType,
        task_description: taskDescription,
        context: context || '',
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to start discovery');
    }

    await this.parseSSE(response, onEvent);
  }

  /**
   * Phase 1b: Answer discovery questions and generate initial outline
   * @param {Object} params
   * @param {string} params.answers - Answers to discovery questions
   * @param {string} params.sessionId - Session identifier
   * @param {Function} onEvent - Callback for each event
   * @returns {Promise<void>}
   */
  async generateOutline({ answers, sessionId = 'default' }, onEvent) {
    const response = await fetch(`${this.baseUrl}/generate-outline?session_id=${sessionId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        answers: answers,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to generate outline');
    }

    await this.parseSSE(response, onEvent);
  }

  /**
   * Phase 1c: Refine the outline based on user feedback
   * @param {Object} params
   * @param {string} params.message - Refinement feedback
   * @param {string} params.sessionId - Session identifier
   * @param {Function} onEvent - Callback for each event
   * @returns {Promise<void>}
   */
  async refine({ message, sessionId = 'default' }, onEvent) {
    const response = await fetch(`${this.baseUrl}/refine?session_id=${sessionId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: message,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to refine workflow');
    }

    await this.parseSSE(response, onEvent);
  }

  /**
   * Phase 2: Finalize - Extract structure and expand to detailed workflow
   * @param {Object} params
   * @param {string} params.sessionId - Session identifier
   * @param {Function} onEvent - Callback for each event
   * @returns {Promise<void>}
   */
  async finalize({ sessionId = 'default' }, onEvent) {
    const response = await fetch(`${this.baseUrl}/finalize?session_id=${sessionId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to finalize workflow');
    }

    await this.parseSSE(response, onEvent);
  }

  /**
   * Get session status
   * @param {string} sessionId - Session identifier
   * @returns {Promise<Object>} Session status
   */
  async getSessionStatus(sessionId = 'default') {
    const response = await fetch(`${this.baseUrl}/session/${sessionId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to get session status');
    }

    return await response.json();
  }

  /**
   * Delete a workflow generation session
   * @param {string} sessionId - Session identifier
   * @returns {Promise<Object>} Deletion confirmation
   */
  async deleteSession(sessionId = 'default') {
    const response = await fetch(`${this.baseUrl}/session/${sessionId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to delete session');
    }

    return await response.json();
  }

  // ========================================================================
  // WebSocket Methods (Real-time streaming with lower latency)
  // ========================================================================

  /**
   * Create a WebSocket connection and handle events
   * @private
   */
  _createWebSocket(endpoint, onEvent, onError) {
    const ws = new WebSocket(`${this.wsBaseUrl}/${endpoint}`);
    let hasError = false;

    const promise = new Promise((resolve, reject) => {
      ws.onopen = () => {
        console.log(`WebSocket connected: ${endpoint}`);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          if (data.type === 'done') {
            ws.close();
            resolve();
          } else if (data.type === 'error') {
            hasError = true;
            const error = new Error(data.error || 'WebSocket error');
            if (onError) onError(error);
            reject(error);
            ws.close();
          } else {
            onEvent(data);
          }
        } catch (e) {
          console.error('Failed to parse WebSocket message:', event.data, e);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        hasError = true;
        const err = new Error('WebSocket connection error');
        if (onError) onError(err);
        reject(err);
      };

      ws.onclose = () => {
        console.log(`WebSocket closed: ${endpoint}`);
        if (!hasError) {
          resolve();
        }
      };
    });

    // Helper to send data when connection is open
    promise.sendData = (data) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(data));
      } else {
        ws.addEventListener('open', () => {
          ws.send(JSON.stringify(data));
        }, { once: true });
      }
    };

    promise.ws = ws;
    return promise;
  }

  /**
   * WebSocket version of discover - Real-time streaming
   * @param {Object} params
   * @param {Function} onEvent - Callback for each event
   * @returns {Promise<void>}
   */
  async discoverWebSocket({ workflowType, taskDescription, context, sessionId = 'default' }, onEvent) {
    const promise = this._createWebSocket(
      `discover/${sessionId}`,
      onEvent,
      (error) => onEvent({ type: 'error', error: error.message })
    );

    // Send initial request after connection opens
    promise.sendData({
      workflow_type: workflowType,
      task_description: taskDescription,
      context: context || '',
    });

    return promise;
  }

  /**
   * WebSocket version of generateOutline - Real-time streaming
   * @param {Object} params
   * @param {Function} onEvent - Callback for each event
   * @returns {Promise<void>}
   */
  async generateOutlineWebSocket({ answers, sessionId = 'default' }, onEvent) {
    const promise = this._createWebSocket(
      `generate-outline/${sessionId}`,
      onEvent,
      (error) => onEvent({ type: 'error', error: error.message })
    );

    promise.sendData({ answers });

    return promise;
  }

  /**
   * WebSocket version of refine - Real-time streaming
   * @param {Object} params
   * @param {Function} onEvent - Callback for each event
   * @returns {Promise<void>}
   */
  async refineWebSocket({ message, sessionId = 'default' }, onEvent) {
    const promise = this._createWebSocket(
      `refine/${sessionId}`,
      onEvent,
      (error) => onEvent({ type: 'error', error: error.message })
    );

    promise.sendData({ message });

    return promise;
  }

  /**
   * WebSocket version of finalize - Real-time streaming
   * @param {Object} params
   * @param {Function} onEvent - Callback for each event
   * @returns {Promise<void>}
   */
  async finalizeWebSocket({ sessionId = 'default' }, onEvent) {
    const promise = this._createWebSocket(
      `finalize/${sessionId}`,
      onEvent,
      (error) => onEvent({ type: 'error', error: error.message })
    );

    // No initial data needed for finalize
    return promise;
  }

  // ========================================================================
  // Save Workflow
  // ========================================================================

  /**
   * Save workflow to vault-website/workflows directory
   * @param {Object} params
   * @param {string} params.title - Workflow title
   * @param {string} params.workflowType - Type of workflow ('navigate', 'educate', 'deploy')
   * @param {string} params.markdown - Complete workflow markdown
   * @param {string} params.context - Optional context
   * @returns {Promise<Object>} Save result with filename and path
   */
  async saveWorkflow({
    title,
    workflowType,
    markdown,
    context = '',
    description = '',
    stepNames = [],
    estimatedTime = '',
    difficulty = 'intermediate'
  }) {
    const response = await fetch(`${this.baseUrl}/save`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: title,
        workflow_type: workflowType,
        markdown: markdown,
        context: context,
        description: description,
        step_names: stepNames,
        estimated_time: estimatedTime,
        difficulty: difficulty,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to save workflow');
    }

    return await response.json();
  }

  /**
   * Delete a workflow
   * @param {string} workflowId - The workflow ID to delete
   * @returns {Promise<Object>} Delete result
   */
  async deleteWorkflow(workflowId) {
    const response = await fetch(`${this.baseUrl}/${workflowId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to delete workflow');
    }

    return await response.json();
  }

  /**
   * Update a workflow step
   * @param {Object} params
   * @param {string} params.workflowId - The workflow ID
   * @param {number} params.stepNumber - The step number to update (1-indexed)
   * @param {Object} params.stepData - The updated step data
   * @returns {Promise<Object>} Update result
   */
  async updateWorkflowStep({ workflowId, stepNumber, stepData }) {
    const response = await fetch(`${this.baseUrl}/${workflowId}/step/${stepNumber}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(stepData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to update workflow step');
    }

    return await response.json();
  }
}

// Export singleton instance
export default new WorkflowService();