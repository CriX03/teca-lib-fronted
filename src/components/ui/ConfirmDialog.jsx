/**
 * ConfirmDialog.jsx - Componente de diálogo de confirmación
 * 
 * Este módulo proporciona un sistema de diálogos de confirmación centrado.
 * El ConfirmProvider envuelve la aplicación y el hook useConfirm permite
 * mostrar diálogos desde cualquier componente.
 * 
 * Características:
 * - Soporta múltiples tipos: danger, warning, info
 * - Retorna una promesa que resuelve en true/false según la acción del usuario
 * - Animaciones suaves de apertura y cierre
 * 
 * @author Teca Biblioteca
 * @version 1.0.0
 */

import { useState, useCallback, createContext, useContext } from 'react';
import { AlertTriangle, Info, Trash2, X } from 'lucide-react';

/**
 * Contexto para compartir la función confirm
 */
const ConfirmContext = createContext(null);

/**
 * Configuración de iconos por tipo de diálogo
 */
const iconMap = {
  danger: { icon: Trash2, bg: 'bg-red-100', color: 'text-red-600' },
  warning: { icon: AlertTriangle, bg: 'bg-amber-100', color: 'text-amber-600' },
  info: { icon: Info, bg: 'bg-blue-100', color: 'text-blue-600' },
};

/**
 * Configuración de botones por tipo de diálogo
 */
const btnMap = {
  danger: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
  warning: 'bg-amber-600 hover:bg-amber-700 focus:ring-amber-500',
  info: 'bg-primary-600 hover:bg-primary-700 focus:ring-primary-500',
};

/**
 * Provider que debe envolver la aplicación para habilitar los diálogos
 * @param {React.ReactNode} children - Componentes hijos
 * @returns {JSX.Element} Provider con diálogo
 */
export const ConfirmProvider = ({ children }) => {
  const [dialog, setDialog] = useState(null);

  /**
   * Función para mostrar un diálogo de confirmación
   * @param {Object} options - Opciones del diálogo
   * @returns {Promise<boolean>} true si confirmó, false si canceló
   */
  const confirm = useCallback(({ title, message, confirmText = 'Confirmar', type = 'danger' }) => {
    return new Promise((resolve) => {
      setDialog({ title, message, confirmText, type, resolve });
    });
  }, []);

  /**
   * Maneja el cierre del diálogo y resuelve la promesa
   * @param {boolean} result - Resultado de la confirmación
   */
  const handleClose = (result) => {
    dialog?.resolve(result);
    setDialog(null);
  };

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      {dialog && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          {/* Backdrop - Fondo oscuro semitransparente */}
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => handleClose(false)}
          />
          {/* Dialog - Ventana de confirmación */}
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className={`flex-shrink-0 w-10 h-10 rounded-xl ${iconMap[dialog.type].bg} flex items-center justify-center`}>
                  {(() => {
                    const IconComp = iconMap[dialog.type].icon;
                    return <IconComp size={20} className={iconMap[dialog.type].color} />;
                  })()}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold text-gray-900">{dialog.title}</h3>
                  <p className="mt-1 text-sm text-gray-500 leading-relaxed">{dialog.message}</p>
                </div>
                <button 
                  onClick={() => handleClose(false)} 
                  className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
            <div className="flex gap-3 px-6 pb-6">
              <button
                onClick={() => handleClose(false)}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleClose(true)}
                className={`flex-1 px-4 py-2.5 text-sm font-medium text-white rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${btnMap[dialog.type]}`}
              >
                {dialog.confirmText}
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
};

/**
 * Hook para usar el diálogo de confirmación
 * 
 * Uso típico:
 * const confirm = useConfirm();
 * const handleDelete = async () => {
 *   const confirmed = await confirm({
 *     title: '¿Eliminar?',
 *     message: 'Esta acción no se puede deshacer.',
 *     confirmText: 'Eliminar',
 *     type: 'danger'
 *   });
 *   if (confirmed) { ... }
 * };
 * 
 * @returns {Function} Función para mostrar diálogos de confirmación
 * @throws {Error} Si se usa fuera de un ConfirmProvider
 */
export const useConfirm = () => {
  const context = useContext(ConfirmContext);
  if (!context) throw new Error('useConfirm must be used within ConfirmProvider');
  return context;
};
