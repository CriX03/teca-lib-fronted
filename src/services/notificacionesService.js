/**
 * notificacionesService.js - Servicio de notificaciones
 * 
 * Este módulo gestiona todas las operaciones relacionadas con el servicio
 * de notificaciones de Teca Biblioteca. Permite enviar notificaciones
 * por email a los usuarios mediante el microservicio de notificaciones.
 * También maneja el almacenamiento local de notificaciones para mostrar
 * en el panel de notificaciones in-app.
 * 
 * Funcionalidades:
 * - Confirmación de préstamo por email
 * - Confirmación de devolución por email
 * - Programación de recordatorios 48h antes del vencimiento
 * - Notificaciones de alerta por mora
 * - Historial local de notificaciones
 * 
 * @author Teca Biblioteca
 * @version 1.0.0
 */

import { apiNotifications } from '../api/axios';

const NOTIFICATIONS_STORAGE_KEY = 'teca_notifications';

/**
 * Obtiene las notificaciones del almacenamiento local
 * @returns {Object[]} Array de notificaciones
 */
const getStoredNotifications = () => {
  try {
    const stored = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

/**
 * Guarda las notificaciones en el almacenamiento local
 * @param {Object[]} notifications - Array de notificaciones
 */
const saveNotifications = (notifications) => {
  try {
    localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(notifications));
  } catch (error) {
    console.error('Error al guardar notificaciones:', error);
  }
};

/**
 * Agrega una notificación al historial local
 * @param {Object} notificacion - Datos de la notificación
 */
const addToHistory = (notificacion) => {
  const notifications = getStoredNotifications();
  const newNotificacion = {
    id: Date.now().toString(),
    ...notificacion,
    leida: false,
    createdAt: new Date().toISOString(),
  };
  notifications.unshift(newNotificacion);
  saveNotifications(notifications.slice(0, 50));
};

/**
 * Marca una notificación como leída
 * @param {string} id - ID de la notificación
 */
const markAsRead = (id) => {
  const notifications = getStoredNotifications();
  const updated = notifications.map(n => 
    n.id === id ? { ...n, leida: true } : n
  );
  saveNotifications(updated);
};

/**
 * Marca todas las notificaciones como leídas
 */
const markAllAsRead = () => {
  const notifications = getStoredNotifications();
  const updated = notifications.map(n => ({ ...n, leida: true }));
  saveNotifications(updated);
};

/**
 * Limpia todas las notificaciones
 */
const clearAllNotifications = () => {
  saveNotifications([]);
};

/**
 * Valida que los datos requeridos estén presentes
 * @param {Object} data - Datos a validar
 * @param {string[]} requiredFields - Campos requeridos
 * @throws {Error} Si algún campo requerido falta
 */
const validateRequiredFields = (data, requiredFields) => {
  for (const field of requiredFields) {
    if (data[field] === undefined || data[field] === null || data[field] === '') {
      throw new Error(`El campo '${field}' es requerido`);
    }
  }
};

/**
 * Valida el tipo de notificación
 * @param {string} tipo - Tipo de notificación
 * @throws {Error} Si el tipo no es válido
 */
const validateTipo = (tipo) => {
  const tiposValidos = ['recordatorio', 'aviso', 'alerta'];
  if (!tiposValidos.includes(tipo)) {
    throw new Error(`Tipo de notificación inválido. Debe ser: ${tiposValidos.join(', ')}`);
  }
};

/**
 * Objeto con métodos para gestionar notificaciones
 */
export const notificacionesService = {
  /**
   * Crea una notificación personalizada
   * @param {Object} data - Datos de la notificación
   * @param {number} data.usuario_id - ID del usuario destinatario
   * @param {number} data.prestamo_id - ID del préstamo relacionado
   * @param {string} data.mensaje - Contenido del mensaje
   * @param {string} data.tipo - Tipo: recordatorio | aviso | alerta
   * @param {string} [data.destinatario_email] - Email del destinatario
   * @param {string} [data.asunto] - Asunto del email
   * @param {string} [data.fecha_programada] - Fecha para programar envío
   * @param {number} [data.max_reintentos] - Máximo de reintentos
   * @returns {Promise<Object>} Notificación creada
   */
  createNotificacion: async (data) => {
    validateRequiredFields(data, ['usuario_id', 'prestamo_id', 'mensaje', 'tipo']);
    validateTipo(data.tipo);
    
    return await apiNotifications.post('/notificaciones', data);
  },

  /**
   * Crea un recordatorio automático 48h antes del vencimiento
   * @param {Object} data - Datos del recordatorio
   * @param {number} data.usuario_id - ID del usuario destinatario
   * @param {number} data.prestamo_id - ID del préstamo relacionado
   * @param {string} data.destinatario_email - Email del destinatario
   * @param {string} data.fecha_limite - Fecha límite de devolución
   * @param {string} data.libro_titulo - Título del libro
   * @returns {Promise<Object>} Recordatorio creado
   */
  createRecordatorio48h: async (data) => {
    validateRequiredFields(data, ['usuario_id', 'prestamo_id', 'destinatario_email', 'fecha_limite', 'libro_titulo']);
    
    return await apiNotifications.post('/notificaciones/recordatorios/48h', data);
  },

  /**
   * Obtiene una notificación por su ID
   * @param {number|string} id - ID de la notificación
   * @returns {Promise<Object>} Datos de la notificación
   */
  getNotificacion: async (id) => {
    if (!id) {
      throw new Error('El ID de la notificación es requerido');
    }
    
    return await apiNotifications.get(`/notificaciones/${id}`);
  },

  /**
   * Procesa la cola de notificaciones manualmente
   * @returns {Promise<Object>} Resultado del procesamiento
   */
  processQueue: async () => {
    return await apiNotifications.post('/notificaciones/process-queue');
  },

  /**
   * Envía notificación de confirmación de préstamo
   * @param {Object} prestamoData - Datos del préstamo creado
   * @param {Object} usuarioData - Datos del usuario
   * @returns {Promise<Object>} Notificación creada
   */
enviarConfirmacionPrestamo: async (prestamoData, usuarioData) => {
    addToHistory({ tipo: 'aviso', titulo: 'Préstamo confirmado', mensaje: 'Tu préstamo ha sido registrado correctamente.', leida: false });

    if (!prestamoData || !usuarioData) {
      console.warn('Faltan datos para enviar confirmación de préstamo');
      return null;
    }

    const prestamo_id = prestamoData.prestamo_id;
    const { id: usuario_id, email } = usuarioData;
    const nombre = usuarioData?.nombre || 'Usuario';

    if (!prestamo_id || !usuario_id || !email) {
      return null;
    }

    const mensajeEmail = `Hola ${nombre}, has solicitado el libro. Tu préstamo ha sido registrado correctamente. Recuerda devolverlo antes de la fecha límite informada.`;
    
    const data = {
      usuario_id,
      prestamo_id,
      mensaje: mensajeEmail,
      tipo: 'aviso',
      destinatario_email: email,
      asunto: 'Confirmación de Préstamo - Teca Biblioteca',
    };

    return await apiNotifications.post('/notificaciones', data);
  },

  /**
   * Envía notificación de confirmación de devolución
   * @param {Object} prestamoData - Datos del préstamo devuelto
   * @param {Object} usuarioData - Datos del usuario
   * @returns {Promise<Object>} Notificación creada
   */
  enviarConfirmacionDevolucion: async (prestamoData, usuarioData) => {
    addToHistory({ tipo: 'aviso', titulo: 'Devolución confirmada', mensaje: 'La devolución ha sido registrada correctamente.', leida: false });

    if (!prestamoData || !usuarioData) {
      console.warn('Faltan datos para enviar confirmación de devolución');
      return null;
    }

    const prestamo_id = prestamoData.prestamo_id;
    const { id: usuario_id, email } = usuarioData;
    const nombre = usuarioData?.nombre || 'Usuario';

    if (!prestamo_id || !usuario_id || !email) {
      return null;
    }

    const mensajeEmail = `Hola ${nombre}, hemos recibido la devolución. Gracias por usar Teca Biblioteca.`;
    
    const data = {
      usuario_id,
      prestamo_id,
      mensaje: mensajeEmail,
      tipo: 'aviso',
      destinatario_email: email,
      asunto: 'Confirmación de Devolución - Teca Biblioteca',
    };

    return await apiNotifications.post('/notificaciones', data);
  },

  /**
   * Envía recordatorio 48h antes del vencimiento
   * @param {Object} prestamoData - Datos del préstamo
   * @param {Object} usuarioData - Datos del usuario
   * @param {string} fechaLimite - Fecha límite de devolución
   * @returns {Promise<Object>} Recordatorio creado
   */
  enviarRecordatorioVencimiento: async (prestamoData, usuarioData, fechaLimite) => {
    const { prestamo_id, libro } = prestamoData;
    const { id: usuario_id, email, nombre } = usuarioData;

    if (!prestamo_id || !usuario_id || !email || !fechaLimite) {
      console.warn('Faltan datos para enviar recordatorio');
      return null;
    }

    const data = {
      usuario_id,
      prestamo_id,
      destinatario_email: email,
      fecha_limite: fechaLimite,
      libro_titulo: libro?.titulo || 'desconocido',
    };

    try {
      return await notificacionesService.createRecordatorio48h(data);
    } catch (error) {
      console.error('Error al enviar recordatorio:', error);
      return null;
    }
  },

  /**
   * Envía notificación de alerta por mora (retraso en devolución)
   * @param {Object} prestamoData - Datos del préstamo vencido
   * @param {Object} usuarioData - Datos del usuario
   * @returns {Promise<Object>} Notificación creada
   */
  enviarAlertaMora: async (prestamoData, usuarioData) => {
    const { prestamo_id, libro, fecha_vencimiento } = prestamoData;
    const { id: usuario_id, email, nombre } = usuarioData;

    if (!prestamo_id || !usuario_id || !email) {
      console.warn('Faltas datos para enviar alerta de mora');
      return null;
    }

    const mensaje = `Hola ${nombre}, el libro "${libro?.titulo || 'desconocido'}" vencerá el ${fecha_vencimiento || ' pronto'}. Por favor, devuélvelo lo antes posible para evitar multas.`;
    
    const data = {
      usuario_id,
      prestamo_id,
      mensaje,
      tipo: 'alerta',
      destinatario_email: email,
      asunto: 'Alerta: Libro por vencer - Teca Biblioteca',
    };

    try {
      return await notificacionesService.createNotificacion(data);
    } catch (error) {
      console.error('Error al enviar alerta de mora:', error);
      return null;
    }
  },

  /**
   * Obtiene el historial de notificaciones locales
   * @returns {Object[]} Array de notificaciones
   */
  getHistorial: () => {
    return getStoredNotifications();
  },

  /**
   * Obtiene el conteo de notificaciones no leídas
   * @returns {number} Número de notificaciones sin leer
   */
  getUnreadCount: () => {
    const notifications = getStoredNotifications();
    return notifications.filter(n => !n.leida).length;
  },

  /**
   * Marca una notificación como leída
   * @param {string} id - ID de la notificación
   */
  marcarLeida: (id) => {
    markAsRead(id);
  },

  /**
   * Marca todas las notificaciones como leídas
   */
  marcarTodasLeidas: () => {
    markAllAsRead();
  },

  /**
   * Limpia todas las notificaciones
   */
  limpiarHistorial: () => {
    clearAllNotifications();
  },

  /**
   * Guarda una notificación en el historial local
   * Usado internamente al enviar confirmaciones
   * @param {Object} data - Datos de la notificación
   */
  guardarNotificacionLocal: (data) => {
    addToHistory(data);
  },
};