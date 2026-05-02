/**
 * notify.js - Utilidad de notificaciones toast
 * 
 * Este módulo proporciona una interfaz unificada para mostrar notificaciones
 * emergentes (toast) en la aplicación. Utiliza la librería react-hot-toast
 * con estilos personalizados que siguen la identidad visual de Teca Biblioteca.
 * 
 * Tipos de notificaciones disponibles:
 * - success: Para operaciones exitosas (color verde)
 * - error: Para errores y fallos (color rojo)
 * - info: Para información general (color azul)
 * - warning: Para advertencias y alertas (color amarillo)
 * - promise: Para operaciones asíncronas con estados de carga
 * 
 * @author Teca Biblioteca
 * @version 1.0.0
 */

import toast from 'react-hot-toast';

/**
 * Objeto con métodos para mostrar diferentes tipos de notificaciones
 */
export const notify = {
  /**
   * Muestra una notificación de éxito
   * @param {string} message - Mensaje a mostrar
   */
  success: (message) =>
    toast.success(message, {
      style: {
        background: '#f0fdf4',
        color: '#166534',
        border: '1px solid #bbf7d0',
        fontSize: '14px',
        fontWeight: '500',
        borderRadius: '10px',
        padding: '12px 16px',
      },
      iconTheme: {
        primary: '#22c55e',
        secondary: '#f0fdf4',
      },
    }),

  /**
   * Muestra una notificación de error
   * @param {string} message - Mensaje de error a mostrar
   */
  error: (message) =>
    toast.error(message, {
      style: {
        background: '#fef2f2',
        color: '#991b1b',
        border: '1px solid #fecaca',
        fontSize: '14px',
        fontWeight: '500',
        borderRadius: '10px',
        padding: '12px 16px',
      },
      iconTheme: {
        primary: '#ef4444',
        secondary: '#fef2f2',
      },
      duration: 5000,
    }),

  /**
   * Muestra una notificación informativa
   * @param {string} message - Información a mostrar
   */
  info: (message) =>
    toast(message, {
      icon: 'ℹ️',
      style: {
        background: '#eff6ff',
        color: '#1e40af',
        border: '1px solid #bfdbfe',
        fontSize: '14px',
        fontWeight: '500',
        borderRadius: '10px',
        padding: '12px 16px',
      },
    }),

  /**
   * Muestra una advertencia
   * @param {string} message - Mensaje de advertencia
   */
  warning: (message) =>
    toast(message, {
      icon: '⚠️',
      style: {
        background: '#fffbeb',
        color: '#92400e',
        border: '1px solid #fde68a',
        fontSize: '14px',
        fontWeight: '500',
        borderRadius: '10px',
        padding: '12px 16px',
      },
      duration: 5000,
    }),

  /**
   * Muestra una notificación basada en el estado de una promesa
   * @param {Promise} promise - Promesa a monitorear
   * @param {Object} options - Textos para cada estado
   * @returns {Promise} La promesa original
   */
  promise: (promise, { loading = 'Procesando...', success = '¡Listo!', error = 'Error' }) =>
    toast.promise(
      promise,
      { loading, success, error },
      {
        style: {
          fontSize: '14px',
          fontWeight: '500',
          borderRadius: '10px',
          padding: '12px 16px',
        },
      }
    ),
};
