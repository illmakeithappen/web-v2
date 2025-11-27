/**
 * PostgreSQL Authentication Service
 * Handles authentication via FastAPI backend with PostgreSQL
 */

class PostgresAuthService {
  constructor() {
    this.currentUser = null;
    this.authListeners = [];
    this.apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';

    // Initialize auth state from localStorage
    this.initializeAuth();
  }

  /**
   * Initialize authentication state from stored token
   */
  async initializeAuth() {
    try {
      const token = localStorage.getItem('authToken');
      const user = localStorage.getItem('user');

      if (token && user) {
        this.currentUser = JSON.parse(user);
        this.notifyAuthListeners('authenticated', this.currentUser);
      } else {
        this.currentUser = null;
        this.notifyAuthListeners('unauthenticated', null);
      }
    } catch (error) {
      console.error('❌ Auth initialization error:', error);
      this.currentUser = null;
      this.notifyAuthListeners('unauthenticated', null);
    }
  }

  /**
   * Register new user
   */
  async register({ email, password, fullName, organization = '' }) {
    try {
      const response = await fetch(`${this.apiUrl}/api/v1/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          full_name: fullName,
          organization
        })
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.detail || 'Registration failed',
          error: 'REGISTRATION_ERROR'
        };
      }

      // Store token and user data (auto sign-in after registration)
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      this.currentUser = data.user;
      this.notifyAuthListeners('authenticated', this.currentUser);

      return {
        success: true,
        message: 'Registration successful',
        user: data.user,
        token: data.token
      };

    } catch (error) {
      console.error('❌ Registration error:', error);
      return {
        success: false,
        message: 'Registration failed',
        error: 'REGISTRATION_ERROR'
      };
    }
  }

  /**
   * Sign in user
   */
  async signIn(email, password) {
    try {
      const response = await fetch(`${this.apiUrl}/api/v1/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.detail || 'Sign in failed',
          error: 'SIGNIN_ERROR'
        };
      }

      // Store token and user data
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      this.currentUser = data.user;
      this.notifyAuthListeners('authenticated', this.currentUser);

      return {
        success: true,
        message: 'Sign in successful',
        user: data.user,
        token: data.token
      };

    } catch (error) {
      console.error('❌ Sign in error:', error);
      return {
        success: false,
        message: 'Sign in failed',
        error: 'SIGNIN_ERROR'
      };
    }
  }

  /**
   * Sign out user
   */
  async signOut() {
    try {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');

      this.currentUser = null;
      this.notifyAuthListeners('unauthenticated', null);

      return {
        success: true,
        message: 'Signed out successfully'
      };

    } catch (error) {
      console.error('❌ Sign out error:', error);
      return {
        success: false,
        message: 'Sign out failed',
        error: 'SIGNOUT_ERROR'
      };
    }
  }

  /**
   * Get current authenticated user
   */
  async getCurrentUser() {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) return null;

      return this.currentUser;

    } catch (error) {
      return null;
    }
  }

  /**
   * Get current user session (with token)
   */
  async getCurrentSession() {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) return null;

      return {
        accessToken: token,
        user: this.currentUser
      };

    } catch (error) {
      return null;
    }
  }

  /**
   * Get user attributes
   */
  async getUserAttributes() {
    return this.currentUser;
  }

  /**
   * Verify email - stub for compatibility
   */
  async verifyEmail(email, confirmationCode) {
    return {
      success: true,
      message: 'Email verification not required for PostgreSQL auth'
    };
  }

  /**
   * Resend verification code - stub for compatibility
   */
  async resendVerificationCode(email) {
    return {
      success: true,
      message: 'Email verification not required for PostgreSQL auth'
    };
  }

  /**
   * Forgot password
   */
  async forgotPassword(email) {
    try {
      const response = await fetch(`${this.apiUrl}/api/v1/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.detail || 'Failed to send password reset code'
        };
      }

      return {
        success: true,
        message: 'Password reset code sent to your email'
      };

    } catch (error) {
      return {
        success: false,
        message: 'Failed to send password reset code'
      };
    }
  }

  /**
   * Reset password with code
   */
  async resetPassword(email, confirmationCode, newPassword) {
    try {
      const response = await fetch(`${this.apiUrl}/api/v1/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          code: confirmationCode,
          new_password: newPassword
        })
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.detail || 'Password reset failed'
        };
      }

      return {
        success: true,
        message: 'Password reset successfully'
      };

    } catch (error) {
      return {
        success: false,
        message: 'Password reset failed'
      };
    }
  }

  /**
   * Change password (for authenticated user)
   */
  async changePassword(oldPassword, newPassword) {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('User not authenticated');
      }

      const response = await fetch(`${this.apiUrl}/api/v1/auth/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          old_password: oldPassword,
          new_password: newPassword
        })
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.detail || 'Password change failed'
        };
      }

      return {
        success: true,
        message: 'Password changed successfully'
      };

    } catch (error) {
      return {
        success: false,
        message: 'Password change failed'
      };
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    return this.currentUser !== null;
  }

  /**
   * Add authentication state listener
   */
  addAuthListener(callback) {
    this.authListeners.push(callback);

    // Return unsubscribe function
    return () => {
      this.authListeners = this.authListeners.filter(listener => listener !== callback);
    };
  }

  /**
   * Notify authentication state listeners
   */
  notifyAuthListeners(state, user) {
    this.authListeners.forEach(callback => {
      try {
        callback(state, user);
      } catch (error) {
        console.error('❌ Auth listener error:', error);
      }
    });
  }

  /**
   * Get authentication headers for API calls
   */
  async getAuthHeaders() {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) return {};

      return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

    } catch (error) {
      console.error('❌ Get auth headers error:', error);
      return {};
    }
  }

  /**
   * Make authenticated API call
   */
  async apiCall(endpoint, options = {}) {
    try {
      const headers = await this.getAuthHeaders();

      const response = await fetch(`${this.apiUrl}${endpoint}`, {
        ...options,
        headers: {
          ...headers,
          ...options.headers
        }
      });

      if (!response.ok) {
        throw new Error(`API call failed: ${response.status} ${response.statusText}`);
      }

      return await response.json();

    } catch (error) {
      console.error('❌ API call error:', error);
      throw error;
    }
  }
}

// Create singleton instance
const authService = new PostgresAuthService();

export default authService;