import { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import * as authService from '../services/authService';

const AuthContext = createContext(null);

const DEV_AUTH_STORAGE_KEY = 'tripflow_dev_session';
const DEV_AUTH_ENABLED = import.meta.env.DEV && import.meta.env.VITE_ENABLE_DEV_AUTH === 'true';
const DEV_USER = {
  id: 'dev-user',
  name: 'Developer Preview',
  email: 'dev@localhost',
};

function getStoredDevelopmentSession() {
  if (!DEV_AUTH_ENABLED) return null;

  try {
    const rawSession = localStorage.getItem(DEV_AUTH_STORAGE_KEY);
    if (!rawSession) return null;

    const parsedSession = JSON.parse(rawSession);
    if (parsedSession?.user?.id === DEV_USER.id && parsedSession?.user?.email === DEV_USER.email) {
      return parsedSession;
    }
  } catch {
    return null;
  }

  return null;
}

function clearStoredDevelopmentSession() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(DEV_AUTH_STORAGE_KEY);
}

function createInitialState() {
  const token = authService.tokenStorage.get();
  const developmentSession = getStoredDevelopmentSession();
  const hasDevelopmentSession = Boolean(developmentSession);

  return {
    user: developmentSession?.user ?? null,
    token: token ?? null,
    isAuthenticated: Boolean(token) || hasDevelopmentSession,
    isLoading: true,
    error: null,
    isDevelopmentMode: DEV_AUTH_ENABLED,
    isDevelopmentSessionActive: hasDevelopmentSession,
  };
}

const initialState = createInitialState();

function authReducer(state, action) {
  switch (action.type) {
    case 'AUTH_START':
      return { ...state, isLoading: true, error: null };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token ?? null,
        isAuthenticated: true,
        isLoading: false,
        error: null,
        isDevelopmentMode: DEV_AUTH_ENABLED,
        isDevelopmentSessionActive: Boolean(action.payload.isDevelopmentSessionActive),
      };
    case 'AUTH_FAILURE':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
        isDevelopmentMode: DEV_AUTH_ENABLED,
        isDevelopmentSessionActive: false,
      };
    case 'AUTH_LOGOUT':
      return {
        ...createInitialState(),
        token: null,
        isLoading: false,
        isDevelopmentMode: DEV_AUTH_ENABLED,
        isDevelopmentSessionActive: false,
      };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const checkAuth = useCallback(async () => {
    const developmentSession = getStoredDevelopmentSession();
    if (developmentSession) {
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: { user: DEV_USER, token: null, isDevelopmentSessionActive: true },
      });
      return;
    }

    const token = authService.tokenStorage.get();
    if (!token) {
      dispatch({ type: 'AUTH_FAILURE', payload: null });
      return;
    }

    dispatch({ type: 'AUTH_START' });
    try {
      const user = await authService.getCurrentUser();
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: { user, token, isDevelopmentSessionActive: false },
      });
    } catch {
      authService.tokenStorage.remove();
      dispatch({ type: 'AUTH_FAILURE', payload: null });
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    const handleUnauthorized = () => {
      dispatch({ type: 'AUTH_LOGOUT' });
    };
    window.addEventListener('tripflow:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('tripflow:unauthorized', handleUnauthorized);
  }, []);

  const login = async (credentials) => {
    dispatch({ type: 'AUTH_START' });
    try {
      const data = await authService.login(credentials);
      if (data.token) {
        authService.tokenStorage.set(data.token);
      }
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: { user: data.user, token: data.token, isDevelopmentSessionActive: false },
      });
      return data;
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed. Please try again.';
      dispatch({ type: 'AUTH_FAILURE', payload: message });
      throw error;
    }
  };

  const loginWithGoogle = useCallback((emailInput) => {
    const userEmail = emailInput && emailInput.includes('@') ? emailInput.trim() : 'prasanthbangaru512@gmail.com';
    const namePart = userEmail.split('@')[0];
    const formattedName = namePart.split(/[._-]/).map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');

    const googleUser = {
      id: 101,
      name: formattedName || 'Google Travel User',
      email: userEmail,
      profileImage: 'https://lh3.googleusercontent.com/a/default-user',
      provider: 'google',
    };

    const dummyToken = 'dummy-jwt-token-for-101';
    authService.tokenStorage.set(dummyToken);

    dispatch({
      type: 'AUTH_SUCCESS',
      payload: { user: googleUser, token: dummyToken, isDevelopmentSessionActive: false },
    });

    return googleUser;
  }, []);

  const startDevelopmentSession = useCallback(() => {
    if (!DEV_AUTH_ENABLED) return null;

    const session = {
      user: DEV_USER,
      createdAt: new Date().toISOString(),
    };

    if (typeof window !== 'undefined') {
      localStorage.setItem(DEV_AUTH_STORAGE_KEY, JSON.stringify(session));
    }

    dispatch({
      type: 'AUTH_SUCCESS',
      payload: { user: DEV_USER, token: null, isDevelopmentSessionActive: true },
    });

    return session;
  }, []);

  const register = async (userData) => {
    dispatch({ type: 'AUTH_START' });
    try {
      const data = await authService.register(userData);
      if (data.token) {
        authService.tokenStorage.set(data.token);
      }
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: { user: data.user, token: data.token, isDevelopmentSessionActive: false },
      });
      return data;
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed. Please try again.';
      dispatch({ type: 'AUTH_FAILURE', payload: message });
      throw error;
    }
  };

  const logout = async () => {
    const hasDevelopmentSession = Boolean(getStoredDevelopmentSession());

    try {
      if (!hasDevelopmentSession) {
        await authService.logout();
      }
    } catch {
      authService.tokenStorage.remove();
    } finally {
      clearStoredDevelopmentSession();
      authService.tokenStorage.remove();
      dispatch({ type: 'AUTH_LOGOUT' });
    }
  };

  const clearError = () => dispatch({ type: 'CLEAR_ERROR' });

  const value = {
    ...state,
    login,
    loginWithGoogle,
    register,
    logout,
    clearError,
    checkAuth,
    startDevelopmentSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
