/**
 * prestamosService.js - Servicio de préstamos
 * 
 * Este módulo gestiona todas las operaciones relacionadas con los préstamos
 * de libros. Permite crear préstamos, consultarlos, devolver libros y realizar
 * operaciones administrativas de gestión de préstamos.
 * 
 * @author Teca Biblioteca
 * @version 1.0.0
 */

import { apiLoans } from '../api/axios';

/**
 * Objeto con métodos para gestionar préstamos de libros
 */
export const prestamosService = {
  /**
   * Crea un nuevo préstamo de libro
   * @param {Object} data - Datos del préstamo (libro_id, dias_prestamo)
   * @returns {Promise<Object>} Préstamo creado
   */
  createPrestamo: async (data) => {
    return await apiLoans.post('/prestamos', data);
  },
  
  /**
   * Obtiene los préstamos del usuario autenticado
   * @returns {Promise<Object>} Lista de préstamos del usuario
   */
  getMisPrestamos: async () => {
    return await apiLoans.get('/prestamos/mis-prestamos');
  },
  
  /**
   * Registra la devolución de un libro prestado
   * @param {number|string} id - ID del préstamo
   * @returns {Promise<Object>} Resultado de la devolución
   */
  returnPrestamo: async (id) => {
    return await apiLoans.post(`/prestamos/${id}/devolucion`);
  },

  /**
   * Obtiene todos los préstamos del sistema (solo admin)
   * @param {Object} params - Parámetros de paginación y filtros
   * @returns {Promise<Object>} Lista de todos los préstamos
   */
  getAllPrestamos: async (params = {}) => {
    return await apiLoans.get('/prestamos/admin/todos', { params });
  },

  /**
   * Registra la devolución de un libro como administrador
   * @param {number|string} prestamoId - ID del préstamo
   * @param {boolean} forzar - Indica si se fuerza la devolución aunque haya multas
   * @returns {Promise<Object>} Resultado de la devolución
   */
  returnPrestamoAdmin: async (prestamoId, forzar = false) => {
    return await apiLoans.post('/prestamos/admin/devolver', {
      prestamo_id: prestamoId,
      forzar,
    });
  },
};
