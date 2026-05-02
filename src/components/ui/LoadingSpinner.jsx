/**
 * LoadingSpinner.jsx - Componentes de indicadores de carga
 * 
 * Este módulo proporciona diferentes componentes para mostrar estados de carga
 * en la aplicación. Incluye el spinner principal y skeleton loaders para
 * tablas y cards.
 * 
 * @author Teca Biblioteca
 * @version 1.0.0
 */

import { Loader2 } from 'lucide-react';

/**
 * Spinner de carga reutilizable con múltiples variantes visuales
 * @param {'sm' | 'md' | 'lg' | 'xl'} size - Tamaño del spinner
 * @param {string} text - Texto descriptivo que acompaña al spinner
 * @param {'default' | 'overlay' | 'inline' | 'page'} variant - Variante visual del componente
 * @param {string} className - Clases CSS adicionales
 * @returns {JSX.Element} Componente de spinner
 */
export const LoadingSpinner = ({ 
  size = 'md', 
  text = 'Cargando...', 
  variant = 'default',
  className = '' 
}) => {
  // Mapeo de tamaños
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  };

  // Elemento spinner base
  const spinner = (
    <Loader2 className={`${sizes[size]} text-primary-600 animate-spin`} />
  );

  // Variante inline: para usar dentro de texto o botones
  if (variant === 'inline') {
    return (
      <span className={`inline-flex items-center gap-2 ${className}`}>
        {spinner}
        {text && <span className="text-sm text-gray-500">{text}</span>}
      </span>
    );
  }

  // Variante overlay: pantalla completa con fondo difuminado
  if (variant === 'overlay') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
        <div className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-white shadow-lg border border-gray-100">
          {spinner}
          {text && <p className="text-sm font-medium text-gray-600">{text}</p>}
        </div>
      </div>
    );
  }

  // Variante page: pantalla completa centrada verticalmente
  if (variant === 'page') {
    return (
      <div className="flex h-[60vh] w-full items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full border-4 border-gray-100"></div>
            <Loader2 className="w-16 h-16 text-primary-600 animate-spin absolute inset-0" />
          </div>
          {text && <p className="text-sm font-medium text-gray-500">{text}</p>}
        </div>
      </div>
    );
  }

  // Variante default: centering básico
  return (
    <div className={`flex flex-col items-center justify-center p-8 gap-3 ${className}`}>
      {spinner}
      {text && <p className="text-sm font-medium text-gray-500">{text}</p>}
    </div>
  );
};

/**
 * Skeleton loader para tablas
 * Muestra filas simuladas con efecto de pulso mientras cargan datos
 * @param {number} rows - Número de filas skeleton a mostrar
 * @param {number} cols - Número de columnas skeleton
 * @returns {JSX.Element} Esqueleto de tabla
 */
export const TableSkeleton = ({ rows = 5, cols = 4 }) => {
  return (
    <div className="animate-pulse">
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <div key={rowIdx} className="flex items-center gap-4 px-6 py-4 border-b border-gray-100 last:border-0">
          {Array.from({ length: cols }).map((_, colIdx) => (
            <div
              key={colIdx}
              className="h-4 bg-gray-200 rounded-md flex-1"
              style={{ maxWidth: colIdx === 0 ? '40%' : '20%' }}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

/**
 * Skeleton loader para cards
 * Muestra tarjetas simuladas con efecto de pulso mientras cargan datos
 * @param {number} count - Número de cards skeleton a mostrar
 * @returns {JSX.Element} Esqueleto de tarjetas
 */
export const CardSkeleton = ({ count = 3 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-xl bg-white border border-gray-100 p-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-gray-200" />
            <div className="flex-1 space-y-2">
              <div className="h-3 bg-gray-200 rounded w-3/4" />
              <div className="h-5 bg-gray-200 rounded w-1/2" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
