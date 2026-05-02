/**
 * axios.js - Configuración de cliente HTTP con Axios
 * 
 * Este módulo crea instancias de Axios configuradas para comunicarse con los
 * diferentes microservicios del backend de Teca Biblioteca. Cada instancia
 * está associada a un servicio específico del backend.
 * 
 * Características:
 * - Interceptores de request para agregar token JWT automáticamente
 * - Interceptores de response para manejo centralizado de errores
 * - Normalización de errores para un manejo consistente
 * 
 * @author Teca Biblioteca
 * @version 1.0.0
 */

import axios from 'axios';

/**
 * Crea una instancia de Axios configurada con interceptores
 * @param {string} baseURL - URL base del servicio backend
 * @returns {axios.AxiosInstance} Instancia de Axios configurada
 */
const createInstance = (baseURL) => {
  const instance = axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  /**
   * Interceptor de request - Se ejecuta antes de cada petición HTTP
   * Agrega automáticamente el token JWT del usuario autenticado
   */
  instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  /**
   * Interceptor de response - Se ejecuta después de cada respuesta del servidor
   * Maneja errores de autenticación y normaliza mensajes de error
   */
  instance.interceptors.response.use(
    (response) => response.data,
    (error) => {
      // Manejo de error 401 - Token expirado o inválido
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        // Emitir evento para que AuthContext cierre sesión
        window.dispatchEvent(new CustomEvent('auth:unauthorized', { detail: { expires: true } }));
      }
      
      // Normalización del error para manejo consistente
      const normalizedError = error.response?.data?.error || {
        code: error.code || 'UNKNOWN_ERROR',
        message: error.response?.data?.message || error.message || 'Ocurrió un error inesperado'
      };
      
      return Promise.reject(normalizedError);
    }
  );

  return instance;
};

// Exportación de instancias por servicio del backend
// Cada una apunta a un microservicio específico
export const apiUsers = createInstance(import.meta.env.VITE_API_USERS_URL);     // Servicio de autenticación y usuarios
export const apiCatalog = createInstance(import.meta.env.VITE_API_CATALOG_URL); // Servicio de catálogo de libros
export const apiLoans = createInstance(import.meta.env.VITE_API_LOANS_URL);     // Servicio de préstamos
export const apiReports = createInstance(import.meta.env.VITE_API_REPORTS_URL); // Servicio de reportes
