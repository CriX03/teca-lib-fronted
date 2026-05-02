/**
 * authService.js - Servicio de autenticación
 * 
 * Este módulo encapsula todas las llamadas a la API relacionadas con la
 * autenticación de usuarios, incluyendo login, registro, obtención de datos
 * del usuario actual y verificación de permisos de administrador.
 * 
 * @author Teca Biblioteca
 * @version 1.0.0
 */

import { apiUsers } from '../api/axios';

/**
 * Objeto con métodos para interactuar con el API de autenticación
 */
export const authService = {
  /**
   * Inicia sesión con credenciales del usuario
   * @param {Object} credentials - Credenciales (email, contrasena)
   * @returns {Promise<Object>} Respuesta del servidor
   */
  login: async (credentials) => {
    return await apiUsers.post('/auth/login', credentials);
  },
  
  /**
   * Registra un nuevo usuario en el sistema
   * @param {Object} userData - Datos del nuevo usuario (nombre, email, contrasena, rol)
   * @returns {Promise<Object>} Respuesta del servidor
   */
  registro: async (userData) => {
    return await apiUsers.post('/auth/registro', userData);
  },
  
  /**
   * Obtiene los datos del usuario actualmente autenticado
   * @returns {Promise<Object>} Datos del usuario
   */
  getCurrentUser: async () => {
    return await apiUsers.get('/auth/me');
  },
  
  /**
   * Verifica si el usuario actual tiene permisos de administrador
   * @returns {Promise<Object>} Resultado de la verificación
   */
  checkAdmin: async () => {
    return await apiUsers.get('/auth/admin/check');
  }
};
