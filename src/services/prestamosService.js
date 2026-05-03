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
import { notificacionesService } from './notificacionesService';

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
    const response = await apiLoans.post('/prestamos', data);
    
    // Guardar notificación local aunque el backend no responda correctamente
    notificacionesService.guardarNotificacionLocal({
      tipo: 'aviso',
      titulo: 'Préstamo confirmado',
      mensaje: 'Tu préstamo ha sido registrado correctamente.',
      leida: false,
    });
    
    // Enviar notificación de confirmación al backend sin bloquear la respuesta
    if (response?.prestamo?.prestamo_id && response?.usuario) {
      notificacionesService.enviarConfirmacionPrestamo(response.prestamo, response.usuario)
        .catch(err => console.warn('Notificación de confirmación no enviada:', err));
      
      // Programar recordatorio 48h si hay fecha límite
      const fechaVencimiento = response.prestamo?.fecha_vencimiento;
      if (fechaVencimiento) {
        notificacionesService.enviarRecordatorioVencimiento(response.prestamo, response.usuario, fechaVencimiento)
          .catch(err => console.warn('Recordatorio no programado:', err));
      }
    }
    
    return response;
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
    const response = await apiLoans.post(`/prestamos/${id}/devolucion`);
    
    // Guardar notificación local aunque el backend no responda correctamente
    notificacionesService.guardarNotificacionLocal({
      tipo: 'aviso',
      titulo: 'Devolución confirmada',
      mensaje: 'La devolución ha sido registrada correctamente.',
      leida: false,
    });
    
    // Enviar notificación de confirmación sin bloquear la respuesta
    if (response?.prestamo?.prestamo_id && response?.usuario) {
      notificacionesService.enviarConfirmacionDevolucion(response.prestamo, response.usuario)
        .catch(err => console.warn('Notificación de devolución no enviada:', err));
    }
    
    return response;
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
    const response = await apiLoans.post('/prestamos/admin/devolver', {
      prestamo_id: prestamoId,
      forzar,
    });
    
    // Guardar notificación local aunque el backend no responda correctamente
    notificacionesService.guardarNotificacionLocal({
      tipo: 'aviso',
      titulo: 'Devolución confirmada',
      mensaje: 'La devolución ha sido registrada correctamente.',
      leida: false,
    });
    
    // Enviar notificación de confirmación sin bloquear la respuesta
    if (response?.prestamo?.prestamo_id && response?.usuario) {
      notificacionesService.enviarConfirmacionDevolucion(response.prestamo, response.usuario)
        .catch(err => console.warn('Notificación de devolución no enviada:', err));
    }
    
    return response;
  },
};
