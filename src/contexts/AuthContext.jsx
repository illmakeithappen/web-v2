/**
 * Authentication Context for Supabase Auth
 * Provides authentication state and methods throughout the React app
 */

import React, { createContext, useContext, useEffect, useReducer } from 'react';
import authService from '../services/auth-service';

// Initial authentication state
const initialState = {
  isAuthenticated: false,
  user: null,
  loading: true,
  error: null,
  session: null
};

// Authentication actions
const AUTH_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_USER: 'SET_USER',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SIGN_OUT: 'SIGN_OUT'
};

// Authentication reducer
function authReducer(state, action) {
  switch (action.type) {
    case AUTH_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
        error: null
      };

    case AUTH_ACTIONS.SET_USER:
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        session: action.payload.session,
        loading: false,
        error: null
      };

    case AUTH_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false
      };

    case AUTH_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };

    case AUTH_ACTIONS.SIGN_OUT:
      return {
        ...initialState,
        loading: false
      };

    default:
      return state;
  }
}

// Create context
const AuthContext = createContext();

// Custom hook to use authentication context
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Authentication provider component
export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Initialize authentication state
  useEffect(() => {
    initializeAuth();
  }, []);

  // Set up auth listener
  useEffect(() => {
    const unsubscribe = authService.addAuthListener((authState, user) => {
      if (authState === 'authenticated') {
        handleAuthSuccess(user);
      } else if (authState === 'unauthenticated') {
        handleSignOut();
      }
    });

    return unsubscribe;
  }, []);

  /**
   * Initialize authentication state
   */
  const initializeAuth = async () => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      
      const user = await authService.getCurrentUser();
      if (user) {
        const session = await authService.getCurrentSession();
        dispatch({
          type: AUTH_ACTIONS.SET_USER,
          payload: { user, session }
        });
      } else {
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
      }
    } catch (error) {
      console.error('❌ Auth initialization error:', error);
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
    }
  };

  /**
   * Handle successful authentication
   */
  const handleAuthSuccess = async (user) => {
    try {
      const session = await authService.getCurrentSession();
      dispatch({
        type: AUTH_ACTIONS.SET_USER,
        payload: { user, session }
      });
    } catch (error) {
      console.error('❌ Auth success handler error:', error);
      dispatch({
        type: AUTH_ACTIONS.SET_ERROR,
        payload: 'Failed to get user session'
      });
    }
  };

  /**
   * Handle sign out
   */
  const handleSignOut = () => {
    dispatch({ type: AUTH_ACTIONS.SIGN_OUT });
  };

  /**
   * Register new user
   */
  const register = async (userData) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });

      const result = await authService.register(userData);
      
      if (!result.success) {
        dispatch({
          type: AUTH_ACTIONS.SET_ERROR,
          payload: result.message
        });
      }

      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
      return result;

    } catch (error) {
      dispatch({
        type: AUTH_ACTIONS.SET_ERROR,
        payload: 'Registration failed'
      });
      return { success: false, message: 'Registration failed' };
    }
  };

  /**
   * Verify email with confirmation code
   */
  const verifyEmail = async (email, confirmationCode) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });

      const result = await authService.verifyEmail(email, confirmationCode);
      
      if (!result.success) {
        dispatch({
          type: AUTH_ACTIONS.SET_ERROR,
          payload: result.message
        });
      }

      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
      return result;

    } catch (error) {
      dispatch({
        type: AUTH_ACTIONS.SET_ERROR,
        payload: 'Email verification failed'
      });
      return { success: false, message: 'Email verification failed' };
    }
  };

  /**
   * Resend verification code
   */
  const resendVerificationCode = async (email) => {
    try {
      const result = await authService.resendVerificationCode(email);
      return result;
    } catch (error) {
      return { success: false, message: 'Failed to resend verification code' };
    }
  };

  /**
   * Sign in user
   */
  const signIn = async (email, password) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });

      const result = await authService.signIn(email, password);
      
      if (result.success) {
        // Auth listener will handle setting user state
      } else {
        dispatch({
          type: AUTH_ACTIONS.SET_ERROR,
          payload: result.message
        });
      }

      if (!result.success) {
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
      }

      return result;

    } catch (error) {
      dispatch({
        type: AUTH_ACTIONS.SET_ERROR,
        payload: 'Sign in failed'
      });
      return { success: false, message: 'Sign in failed' };
    }
  };

  /**
   * Sign out user
   */
  const signOut = async () => {
    try {
      const result = await authService.signOut();
      // Auth listener will handle clearing user state
      return result;
    } catch (error) {
      console.error('❌ Sign out error:', error);
      // Force sign out locally even if remote sign out fails
      handleSignOut();
      return { success: true, message: 'Signed out locally' };
    }
  };

  /**
   * Forgot password
   */
  const forgotPassword = async (email) => {
    try {
      return await authService.forgotPassword(email);
    } catch (error) {
      return { success: false, message: 'Failed to send password reset code' };
    }
  };

  /**
   * Reset password
   */
  const resetPassword = async (email, confirmationCode, newPassword) => {
    try {
      return await authService.resetPassword(email, confirmationCode, newPassword);
    } catch (error) {
      return { success: false, message: 'Password reset failed' };
    }
  };

  /**
   * Change password
   */
  const changePassword = async (oldPassword, newPassword) => {
    try {
      return await authService.changePassword(oldPassword, newPassword);
    } catch (error) {
      return { success: false, message: 'Password change failed' };
    }
  };

  /**
   * Get user attributes
   */
  const getUserAttributes = async () => {
    try {
      return await authService.getUserAttributes();
    } catch (error) {
      console.error('❌ Get user attributes error:', error);
      return null;
    }
  };

  /**
   * Make authenticated API call
   */
  const apiCall = async (endpoint, options = {}) => {
    try {
      return await authService.apiCall(endpoint, options);
    } catch (error) {
      // If unauthorized, sign out user
      if (error.message.includes('401')) {
        await signOut();
      }
      throw error;
    }
  };

  /**
   * Clear error state
   */
  const clearError = () => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  };

  // Context value
  const value = {
    // State
    ...state,
    
    // Methods
    register,
    verifyEmail,
    resendVerificationCode,
    signIn,
    signOut,
    forgotPassword,
    resetPassword,
    changePassword,
    getUserAttributes,
    apiCall,
    clearError,
    
    // Utilities
    refreshAuth: initializeAuth
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Export context for advanced usage
export { AuthContext };