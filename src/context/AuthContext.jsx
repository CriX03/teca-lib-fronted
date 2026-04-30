import { createContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';
import { notify } from '../utils/notify';

export const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  }, []);

  useEffect(() => {
    const handleUnauthorized = (event) => {
      if (event.detail?.expires) {
        notify.warning('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
      }
      logout();
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    
    const checkAuth = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await authService.getCurrentUser();
        if (response.success) {
          setUser(response.data);
        } else {
          logout();
        }
      } catch (error) {
        console.error('Error verifying auth', error);
        logout();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
    };
  }, [token, logout]);

  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials);
      if (response.success && response.data?.access_token) {
        const newToken = response.data.access_token;
        localStorage.setItem('token', newToken);
        setToken(newToken);
        return { success: true };
      }
      return response;
    } catch (error) {
      return { 
        success: false, 
        error: error || { message: 'Error de conexión' } 
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await authService.registro(userData);
      return response;
    } catch (error) {
      return { 
        success: false, 
        error: error || { message: 'Error de conexión' } 
      };
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};