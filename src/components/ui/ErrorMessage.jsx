/**
 * ErrorMessage.jsx - Componentes para mostrar errores
 * 
 * Este módulo proporciona componentes para mostrar diferentes tipos de errores
 * en la aplicación. Soporta modo dark mode.
 * 
 * @author Teca Biblioteca
 * @version 1.0.0
 */

import { AlertCircle, RefreshCw, WifiOff, ShieldX, ServerCrash } from 'lucide-react';

const errorConfig = {
  default: {
    icon: AlertCircle,
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/20',
    iconColor: 'text-red-500',
    textColor: 'text-red-400',
    btnColor: 'text-red-400 hover:text-red-300',
  },
  warning: {
    icon: AlertCircle,
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/20',
    iconColor: 'text-amber-500',
    textColor: 'text-amber-400',
    btnColor: 'text-amber-400 hover:text-amber-300',
  },
  network: {
    icon: WifiOff,
    bgColor: 'bg-slate-500/10',
    borderColor: 'border-slate-500/20',
    iconColor: 'text-slate-400',
    textColor: 'text-slate-300',
    btnColor: 'text-slate-300 hover:text-slate-200',
  },
  forbidden: {
    icon: ShieldX,
    bgColor: 'bg-orange-500/10',
    borderColor: 'border-orange-500/20',
    iconColor: 'text-orange-500',
    textColor: 'text-orange-400',
    btnColor: 'text-orange-400 hover:text-orange-300',
  },
  server: {
    icon: ServerCrash,
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/20',
    iconColor: 'text-red-500',
    textColor: 'text-red-400',
    btnColor: 'text-red-400 hover:text-red-300',
  },
};

export const ErrorMessage = ({ message, type = 'default', onRetry }) => {
  const config = errorConfig[type] || errorConfig.default;
  const Icon = config.icon;

  return (
    <div className={`rounded-xl ${config.bgColor} p-4 border ${config.borderColor} my-4`}>
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

export const ErrorPage = ({ title = 'Error', message, onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center mb-5">
        <ServerCrash className="w-8 h-8 text-red-500" />
      </div>
      <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-2">{title}</h2>
      <p className="text-sm text-[var(--text-muted)] max-w-sm mb-6 leading-relaxed">
        {message || 'Ocurrió un error al cargar esta página. Por favor, intenta de nuevo.'}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-500 text-white text-sm font-medium rounded-xl hover:bg-primary-400 transition-colors shadow-lg shadow-primary-500/25"
        >
          <RefreshCw size={16} />
          Reintentar
        </button>
      )}
    </div>
  );
};