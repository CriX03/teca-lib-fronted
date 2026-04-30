import toast from 'react-hot-toast';

/**
 * Utilidad centralizada de notificaciones toast.
 * Usa react-hot-toast bajo el capó con estilos personalizados.
 */
export const notify = {
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
