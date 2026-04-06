import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { authAPI, usersAPI } from '../services/api';
import socketService from '../services/socket';

const AuthContext = createContext();

// Auth reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_START':
    case 'REGISTER_START':
      return { ...state, loading: true, error: null };
    case 'LOGIN_SUCCESS':
    case 'REGISTER_SUCCESS':
      return { 
        ...state, 
        loading: false, 
        user: action.payload.user, 
        token: action.payload.token,
        isAuthenticated: true,
        error: null 
      };
    case 'LOGIN_ERROR':
    case 'REGISTER_ERROR':
      return { ...state, loading: false, error: action.payload, isAuthenticated: false };
    case 'LOGOUT':
      return { 
        ...state, 
        user: null, 
        token: null, 
        isAuthenticated: false, 
        loading: false,
        error: null 
      };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    case 'UPDATE_USER':
      return { ...state, user: action.payload };
    default:
      return state;
  }
};

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check for existing auth on mount
  useEffect(() => {
    const checkAuth = async () => {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      try {
        const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
        const storedUser = localStorage.getItem('auth_user') || sessionStorage.getItem('auth_user');
        
        if (token && storedUser) {
          try {
            // Parse stored user to validate it
            const parsedUser = JSON.parse(storedUser);
            
            // Verify token is still valid by fetching current user
            const response = await authAPI.getCurrentUser();
            dispatch({
              type: 'LOGIN_SUCCESS',
              payload: { user: response.user, token }
            });
            
            // Connect to Socket.IO
            socketService.connect(token);
          } catch (error) {
            console.log('Token validation failed:', error.message);
            
            // If it's a network error, don't clear auth immediately
            if (error.message.includes('fetch') || error.message.includes('network')) {
              console.log('Network error during auth check, keeping stored auth');
              try {
                const parsedUser = JSON.parse(storedUser);
                dispatch({
                  type: 'LOGIN_SUCCESS',
                  payload: { user: parsedUser, token }
                });
                // Try to connect to Socket.IO anyway
                socketService.connect(token);
              } catch (parseError) {
                console.log('Failed to parse stored user, clearing auth');
                clearAuthData();
              }
            } else {
              // Token is invalid, try to refresh
              try {
                const refreshResponse = await authAPI.refreshToken();
                dispatch({
                  type: 'LOGIN_SUCCESS',
                  payload: { user: refreshResponse.user, token: refreshResponse.token }
                });
                
                // Connect to Socket.IO
                socketService.connect(refreshResponse.token);
              } catch (refreshError) {
                console.log('Token refresh failed:', refreshError.message);
                clearAuthData();
              }
            }
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        clearAuthData();
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    const clearAuthData = () => {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      localStorage.removeItem('refresh_token');
      sessionStorage.removeItem('auth_token');
      sessionStorage.removeItem('auth_user');
      sessionStorage.removeItem('refresh_token');
      dispatch({ type: 'LOGOUT' });
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (credentials, rememberMe = false) => {
    dispatch({ type: 'LOGIN_START' });
    
    try {
      const response = await authAPI.login({ ...credentials, rememberMe });
      
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { user: response.user, token: response.token }
      });
      
      // Connect to Socket.IO
      socketService.connect(response.token);
      
      toast.success('Welcome back!');
      return { success: true };
      
    } catch (error) {
      const errorMessage = error.message || 'Login failed';
      dispatch({ type: 'LOGIN_ERROR', payload: errorMessage });
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Register function
  const register = async (userData) => {
    dispatch({ type: 'REGISTER_START' });
    
    try {
      const response = await authAPI.register(userData);
      
      dispatch({
        type: 'REGISTER_SUCCESS',
        payload: { user: response.user, token: response.token }
      });
      
      // Connect to Socket.IO
      socketService.connect(response.token);
      
      toast.success('Registration successful! Welcome to Stratify!');
      return { success: true };
      
    } catch (error) {
      const errorMessage = error.message || 'Registration failed';
      dispatch({ type: 'REGISTER_ERROR', payload: errorMessage });
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Social login function
  const socialLogin = async (provider) => {
    dispatch({ type: 'LOGIN_START' });
    
    try {
      // TODO: Implement OAuth integration
      toast.info(`${provider} login will be available soon!`);
      dispatch({ type: 'LOGIN_ERROR', payload: 'Social login not yet implemented' });
      return { success: false, error: 'Social login not yet implemented' };
      
    } catch (error) {
      const errorMessage = error.message || 'Social login failed';
      dispatch({ type: 'LOGIN_ERROR', payload: errorMessage });
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await authAPI.logout();
      socketService.disconnect();
      dispatch({ type: 'LOGOUT' });
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      // Still logout locally even if API call fails
      socketService.disconnect();
      dispatch({ type: 'LOGOUT' });
      toast.success('Logged out successfully');
    }
  };

  // Forgot password function
  const forgotPassword = async (email) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      await authAPI.forgotPassword(email);
      toast.success('Password reset email sent! Check your inbox.');
      return { success: true };
    } catch (error) {
      const errorMessage = error.message || 'Failed to send reset email';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Reset password function
  const resetPassword = async (token, password, confirmPassword) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      const response = await authAPI.resetPassword(token, password, confirmPassword);
      
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { user: response.user, token: response.token }
      });
      
      toast.success('Password reset successful!');
      return { success: true };
    } catch (error) {
      const errorMessage = error.message || 'Password reset failed';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Change password function
  const changePassword = async (currentPassword, newPassword, confirmNewPassword) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      const response = await authAPI.changePassword(currentPassword, newPassword, confirmNewPassword);
      
      // Update token if new one is provided
      if (response.token) {
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: { user: response.user, token: response.token }
        });
      }
      
      toast.success('Password changed successfully!');
      return { success: true };
    } catch (error) {
      const errorMessage = error.message || 'Password change failed';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Update user profile
  const updateProfile = async (userData) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      const response = await usersAPI.updateUser(state.user.id, userData);
      
      dispatch({ type: 'UPDATE_USER', payload: response.user });
      
      // Update stored user data
      const isLocalStorage = localStorage.getItem('auth_user');
      if (isLocalStorage) {
        localStorage.setItem('auth_user', JSON.stringify(response.user));
      } else {
        sessionStorage.setItem('auth_user', JSON.stringify(response.user));
      }
      
      toast.success('Profile updated successfully!');
      return { success: true };
    } catch (error) {
      const errorMessage = error.message || 'Profile update failed';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Clear error function
  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value = {
    ...state,
    login,
    register,
    socialLogin,
    logout,
    forgotPassword,
    resetPassword,
    changePassword,
    updateProfile,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};