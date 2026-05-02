/**
 * AuthContext.jsx - Contexto de autenticación global
 * 
 * Este módulo proporciona el estado global de autenticación para toda la aplicación.
 * Maneja el inicio de sesión, cierre de sesión, registro de usuarios y verificación
 * del estado de autenticación actual.
 * 
 * Estado proporcionado:
 * - user: Datos del usuario autenticado
 * - token: Token JWT actual
 * - loading: Estado de carga inicial
 * - login: Función para iniciar sesión
 * - logout: Función para cerrar sesión
 * - register: Función para registrar nuevo usuario
 * 
 * @author Teca Biblioteca
 * @version 1.0.0
 */

import { createContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';
import { notify } from '../utils/notify';

/**
 * Context para acceder al estado de autenticación desde cualquier componente
 * @type {React.Context}
 */
export const AuthContext = createContext(undefined);

/**
 * Provider que envuelve la aplicación y provee el estado de autenticación
 * @param {React.ReactNode} children - Componentes hijos que tendrán acceso al contexto
 */
export const AuthProvider = ({ children }) => {
  // Estado local del contexto
  const [user, setUser] = useState(null);           // Usuario autenticado
  const [token, setToken] = useState(localStorage.getItem('token')); // Token JWT
  const [loading, setLoading] = useState(true);     // Estado de carga

  /**
   * Función para cerrar sesión
   * Limpia el token del localStorage y reinicia el estado
   * @type {Function}
   */
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  }, []);

  /**
   * Effect para verificar autenticación al cargar la app
   * Escucha eventos de expiración de sesión y valida el token
   */
  useEffect(() => {
    // Manejador para evento de sesión expirada
    const handleUnauthorized = (event) => {
      if (event.detail?.expires) {
        notify.warning('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
      }
      logout();
    };

    // Registrar listener para eventos de expiración de sesión
    window.addEventListener('auth:unauthorized', handleUnauthorized);
    
    /**
     * Verifica si el usuario tiene una sesión activa válida
     */
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

    // Limpiar listener al desmontar el componente
    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
    };
  }, [token, logout]);

  /**
   * Función para iniciar sesión con credenciales
   * @param {Object} credentials - Objeto con email y contrasena
   * @returns {Promise<Object>} Resultado de la operación
   */
  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials);
      if (response.success && response.data?.access_token) {
        const newToken = response.data.access_token;
        localStorage.setItem('token', newToken);
        setToken(newToken);
        // Obtener datos del usuario después del login
        const userResponse = await authService.getCurrentUser();
        if (userResponse.success) {
          setUser(userResponse.data);
        }
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

  /**
   * Función para registrar un nuevo usuario
   * @param {Object} userData - Datos del nuevo usuario
   * @returns {Promise<Object>} Resultado de la operación
   */
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

  // Proveer el contexto a los componentes hijos
  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};