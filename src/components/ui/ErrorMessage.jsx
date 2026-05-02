/**
 * ErrorMessage.jsx - Componentes para mostrar errores
 * 
 * Este módulo proporciona componentes para mostrar diferentes tipos de errores
 * en la aplicación, desde errores inline hasta pantallas completas de error.
 * Cada tipo de error tiene su propia configuración visual.
 * 
 * @author Teca Biblioteca
 * @version 1.0.0
 */

import { AlertCircle, RefreshCw, WifiOff, ShieldX, ServerCrash } from 'lucide-react';

/**
 * Configuración de estilos para cada tipo de error
 * Define el icono, colores de fondo, borde, texto y botón
 */
const errorConfig = {
  default: {
    icon: AlertCircle,
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    iconColor: 'text-red-400',
    textColor: 'text-red-700',
    btnColor: 'text-red-700 hover:text-red-600',
  },
  warning: {
    icon: AlertCircle,
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    iconColor: 'text-amber-400',
    textColor: 'text-amber-700',
    btnColor: 'text-amber-700 hover:text-amber-600',
  },
  network: {
    icon: WifiOff,
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200',
    iconColor: 'text-gray-400',
    textColor: 'text-gray-700',
    btnColor: 'text-gray-700 hover:text-gray-600',
  },
  forbidden: {
    icon: ShieldX,
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    iconColor: 'text-orange-400',
    textColor: 'text-orange-700',
    btnColor: 'text-orange-700 hover:text-orange-600',
  },
  server: {
    icon: ServerCrash,
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    iconColor: 'text-red-400',
    textColor: 'text-red-700',
    btnColor: 'text-red-700 hover:text-red-600',
  },
};

/**
 * Componente para mostrar mensajes de error inline
 * Se usa dentro de formularios, tablas u otras áreas pequeñas
 * 
 * @param {string} message - Mensaje de error a mostrar
 * @param {'default' | 'warning' | 'network' | 'forbidden' | 'server'} type - Tipo de error
 * @param {Function} onRetry - Función para reintentar la operación
 * @returns {JSX.Element} Componente de mensaje de error
 */
export const ErrorMessage = ({ message, type = 'default', onRetry }) => {
  const config = errorConfig[type] || errorConfig.default;
  const Icon = config.icon;

  return (
    <div className={`rounded-lg ${config.bgColor} p-4 border ${config.borderColor} my-4`}>
      <div className="flex items-start gap-3">
        <Icon className={`h-5 w-5 mt-0.5 flex-shrink-0 ${config.iconColor}`} />
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-medium ${config.textColor}`}>
            {message || 'Ha ocurrido un error inesperado. Por favor, intenta de nuevo.'}
          </p>
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className={`inline-flex items-center gap-1.5 text-sm font-medium ${config.btnColor} whitespace-nowrap transition-colors focus:outline-none`}
          >
            <RefreshCw size={14} />
            Reintentar
          </button>
        )}
      </div>
    </div>
  );
};

/**
 * Componente para mostrar pantalla completa de error
 * Se usa cuando hay errores fatales que impiden cargar la página
 * 
 * @param {string} title - Título del error
 * @param {string} message - Mensaje descriptivo del error
 * @param {Function} onRetry - Función para reintentar
 * @returns {JSX.Element} Página de error completa
 */
export const ErrorPage = ({ title = 'Error', message, onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-red-100 flex items-center justify-center mb-5">
        <ServerCrash className="w-8 h-8 text-red-500" />
      </div>
      <h2 className="text-lg font-semibold text-gray-900 mb-2">{title}</h2>
      <p className="text-sm text-gray-500 max-w-sm mb-6 leading-relaxed">
        {message || 'Ocurrió un error al cargar esta página. Por favor, intenta de nuevo.'}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors shadow-sm"
        >
          <RefreshCw size={16} />
          Reintentar
        </button>
      )}
    </div>
  );
};
