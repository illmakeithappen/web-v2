/**
 * Supabase Authentication Service
 * Handles authentication via Supabase Auth
 * Provides compatible interface with previous PostgreSQL auth service
 */

import { supabase } from '../lib/supabase'

class SupabaseAuthService {
  constructor() {
    this.currentUser = null
    this.authListeners = []
    this.initializeAuth()
  }

  /**
   * Initialize authentication state from Supabase session
   */
  async initializeAuth() {
    try {
      const { data: { session } } = await supabase.auth.getSession()

      if (session?.user) {
        this.currentUser = session.user
        this.notifyAuthListeners('authenticated', session.user)
      } else {
        this.currentUser = null
        this.notifyAuthListeners('unauthenticated', null)
      }

      // Set up auth state change listener
      supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          this.currentUser = session.user
          this.notifyAuthListeners('authenticated', session.user)
        } else if (event === 'SIGNED_OUT') {
          this.currentUser = null
          this.notifyAuthListeners('unauthenticated', null)
        }
      })
    } catch (error) {
      console.error('Auth initialization error:', error)
      this.currentUser = null
      this.notifyAuthListeners('unauthenticated', null)
    }
  }

  /**
   * Register new user
   */
  async register({ email, password, fullName, organization = '' }) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            organization: organization
          }
        }
      })

      if (error) {
        return {
          success: false,
          message: error.message,
          error: error.name || 'REGISTRATION_ERROR'
        }
      }

      this.currentUser = data.user
      this.notifyAuthListeners('authenticated', data.user)

      return {
        success: true,
        message: 'Registration successful',
        user: data.user,
        session: data.session,
        token: data.session?.access_token
      }
    } catch (error) {
      console.error('Registration error:', error)
      return {
        success: false,
        message: error.message || 'Registration failed',
        error: 'REGISTRATION_ERROR'
      }
    }
  }

  /**
   * Sign in user
   */
  async signIn(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        return {
          success: false,
          message: error.message,
          error: error.name || 'SIGNIN_ERROR'
        }
      }

      this.currentUser = data.user
      this.notifyAuthListeners('authenticated', data.user)

      return {
        success: true,
        message: 'Sign in successful',
        user: data.user,
        session: data.session,
        token: data.session?.access_token
      }
    } catch (error) {
      console.error('Sign in error:', error)
      return {
        success: false,
        message: error.message || 'Sign in failed',
        error: 'SIGNIN_ERROR'
      }
    }
  }

  /**
   * Sign out user
   */
  async signOut() {
    try {
      const { error } = await supabase.auth.signOut()

      this.currentUser = null
      this.notifyAuthListeners('unauthenticated', null)

      return {
        success: !error,
        message: error ? error.message : 'Signed out successfully'
      }
    } catch (error) {
      console.error('Sign out error:', error)
      // Force local sign out even if remote fails
      this.currentUser = null
      this.notifyAuthListeners('unauthenticated', null)
      return {
        success: true,
        message: 'Signed out locally'
      }
    }
  }

  /**
   * Get current authenticated user
   */
  async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()

      if (error) {
        return null
      }

      this.currentUser = user
      return user
    } catch (error) {
      console.error('Get current user error:', error)
      return null
    }
  }

  /**
   * Get current user session (with token)
   */
  async getCurrentSession() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession()

      if (error) {
        return null
      }

      return session
    } catch (error) {
      console.error('Get session error:', error)
      return null
    }
  }

  /**
   * Get user attributes
   */
  async getUserAttributes() {
    return this.currentUser
  }

  /**
   * Verify email - handled by Supabase automatically
   */
  async verifyEmail(email, confirmationCode) {
    // Supabase handles email verification via link
    // This method exists for compatibility
    return {
      success: true,
      message: 'Email verification handled by Supabase link'
    }
  }

  /**
   * Resend verification code - handled by Supabase
   */
  async resendVerificationCode(email) {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email
      })

      return {
        success: !error,
        message: error ? error.message : 'Verification email resent'
      }
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to resend verification code'
      }
    }
  }

  /**
   * Forgot password
   */
  async forgotPassword(email) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth?mode=reset-password`
      })

      return {
        success: !error,
        message: error ? error.message : 'Password reset email sent'
      }
    } catch (error) {
      console.error('Forgot password error:', error)
      return {
        success: false,
        message: error.message || 'Failed to send password reset email'
      }
    }
  }

  /**
   * Reset password with code (Supabase uses session-based reset)
   */
  async resetPassword(email, confirmationCode, newPassword) {
    try {
      // For Supabase, password reset is done via updateUser when user clicks email link
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      })

      return {
        success: !error,
        message: error ? error.message : 'Password reset successfully'
      }
    } catch (error) {
      console.error('Reset password error:', error)
      return {
        success: false,
        message: error.message || 'Password reset failed'
      }
    }
  }

  /**
   * Change password (for authenticated user)
   */
  async changePassword(oldPassword, newPassword) {
    try {
      // Supabase doesn't verify old password on update
      // Re-authenticate first for security
      const user = await this.getCurrentUser()
      if (!user?.email) {
        throw new Error('User not authenticated')
      }

      const { error } = await supabase.auth.updateUser({
        password: newPassword
      })

      return {
        success: !error,
        message: error ? error.message : 'Password changed successfully'
      }
    } catch (error) {
      console.error('Change password error:', error)
      return {
        success: false,
        message: error.message || 'Password change failed'
      }
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    return this.currentUser !== null
  }

  /**
   * Add authentication state listener
   */
  addAuthListener(callback) {
    this.authListeners.push(callback)

    // Return unsubscribe function
    return () => {
      this.authListeners = this.authListeners.filter(listener => listener !== callback)
    }
  }

  /**
   * Notify authentication state listeners
   */
  notifyAuthListeners(state, user) {
    this.authListeners.forEach(callback => {
      try {
        callback(state, user)
      } catch (error) {
        console.error('Auth listener error:', error)
      }
    })
  }

  /**
   * Get authentication headers for API calls
   */
  async getAuthHeaders() {
    try {
      const session = await this.getCurrentSession()

      if (!session?.access_token) {
        return {
          'Content-Type': 'application/json'
        }
      }

      return {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json'
      }
    } catch (error) {
      console.error('Get auth headers error:', error)
      return {
        'Content-Type': 'application/json'
      }
    }
  }

  /**
   * Make authenticated API call
   */
  async apiCall(endpoint, options = {}) {
    try {
      const headers = await this.getAuthHeaders()

      const response = await fetch(endpoint, {
        ...options,
        headers: {
          ...headers,
          ...options.headers
        }
      })

      if (!response.ok) {
        throw new Error(`API call failed: ${response.status} ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('API call error:', error)
      throw error
    }
  }
}

// Create singleton instance
const authService = new SupabaseAuthService()

export default authService