/**
 * LoadingSpinner.jsx - Componentes de indicadores de carga
 * 
 * Este módulo proporciona diferentes componentes para mostrar estados de carga
 * en la aplicación. Incluye el spinner principal y skeleton loaders para
 * tablas y cards. Soporta modo dark mode.
 * 
 * @author Teca Biblioteca
 * @version 1.0.0
 */

import { Loader2 } from 'lucide-react';

export const LoadingSpinner = ({ 
  size = 'md', 
  text = 'Cargando...', 
  variant = 'default',
  className = '' 
}) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  };

  const spinner = (
    <Loader2 className={`${sizes[size]} text-primary-500 animate-spin`} />
  );

  if (variant === 'inline') {
    return (
      <span className={`inline-flex items-center gap-2 ${className}`}>
        {spinner}
        {text && <span className="text-sm text-[var(--text-muted)]">{text}</span>}
      </span>
    );
  }

  if (variant === 'overlay') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--bg-base)]/80 backdrop-blur-sm">
        <div className="flex flex-col items-center gap-3 p-6 rounded-2xl glass-card">
          {spinner}
          {text && <p className="text-sm font-semibold text-[var(--text-secondary)]">{text}</p>}
        </div>
      </div>
    );
  }

  if (variant === 'page') {
    return (
      <div className="flex h-[60vh] w-full items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full border-4 border-[var(--border-color)]"></div>
            <Loader2 className="w-16 h-16 text-primary-500 animate-spin absolute inset-0" />
          </div>
          {text && <p className="text-sm font-semibold text-[var(--text-muted)]">{text}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center justify-center p-8 gap-3 ${className}`}>
      {spinner}
      {text && <p className="text-sm font-semibold text-[var(--text-muted)]">{text}</p>}
    </div>
  );
};

export const TableSkeleton = ({ rows = 5, cols = 4 }) => {
  return (
    <div className="animate-pulse">
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <div key={rowIdx} className="flex items-center gap-4 px-6 py-4 border-b border-[var(--border-color)] last:border-0">
          {Array.from({ length: cols }).map((_, colIdx) => (
            <div
              key={colIdx}
              className="h-4 bg-[var(--border-color)] rounded-md flex-1"
              style={{ maxWidth: colIdx === 0 ? '40%' : '20%' }}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export const CardSkeleton = ({ count = 3 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="glass-card rounded-xl p-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-[var(--border-color)]" />
            <div className="flex-1 space-y-2">
              <div className="h-3 bg-[var(--border-color)] rounded w-3/4" />
              <div className="h-5 bg-[var(--border-color)] rounded w-1/2" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};