/**
 * reportesService.js - Servicio de reportes y estadísticas
 * 
 * Este módulo proporciona métodos para obtener diferentes métricas y estadísticas
 * de la biblioteca, incluyendo libros más prestados, préstamos por usuario y
 * préstamos con retraso.
 * 
 * @author Teca Biblioteca
 * @version 1.0.0
 */

import { apiReports } from '../api/axios';

/**
 * Objeto con métodos para obtener reportes de la biblioteca
 */
export const reportesService = {
  /**
   * Obtiene los libros más prestados de la biblioteca
   * @param {number} limit - Cantidad máxima de resultados (por defecto 10)
   * @returns {Promise<Object>} Lista de libros más prestados
   */
  getLibrosMasPrestados: async (limit = 10) => {
    return await apiReports.get('/reportes/libros-mas-prestados', { params: { limit } });
  },
  
  /**
   * Obtiene estadísticas de préstamos agrupadas por usuario
   * @param {number} limit - Cantidad máxima de resultados (por defecto 10)
   * @returns {Promise<Object>} Lista de usuarios con más préstamos
   */
  getPrestamosPorUsuario: async (limit = 10) => {
    return await apiReports.get('/reportes/prestamos-por-usuario', { params: { limit } });
  },
  
  /**
   * Obtiene la lista de préstamos que están en retraso
   * @param {number} limit - Cantidad máxima de resultados (por defecto 10)
   * @returns {Promise<Object>} Lista de préstamos con retraso
   */
  getRetrasos: async (limit = 10) => {
    return await apiReports.get('/reportes/retrasos', { params: { limit } });
  }
};
