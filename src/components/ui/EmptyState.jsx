/**
 * EmptyState.jsx - Componente para estados vacíos
 * 
 * Este componente se muestra cuando no hay datos para mostrar en una tabla,
 * lista o sección. Proporciona retroalimentación visual consistente con un
 * icono, título y descripción que pueden personalizarse según el contexto.
 * 
 * @author Teca Biblioteca
 * @version 1.0.0
 */

import { FolderOpen, BookOpen, Bookmark, Users, Search } from 'lucide-react';

/**
 * Mapeo de iconos predefinidos según el tipo de contenido
 */
const icons = {
  default: FolderOpen,
  books: BookOpen,
  loans: Bookmark,
  users: Users,
  search: Search,
};

/**
 * Componente reutilizable para mostrar cuando no hay datos disponibles
 * 
 * @param {string} title - Título principal del estado vacío
 * @param {string} description - Descripción secundaria
 * @param {'default' | 'books' | 'loans' | 'users' | 'search'} iconType - Tipo de ícono predefinido
 * @param {React.ComponentType} icon - Icono personalizado (sobrescribe iconType)
 * @param {React.ReactNode} action - Botón o acción opcional
 * @returns {JSX.Element} Componente de estado vacío
 */
export const EmptyState = ({ 
  title = 'No hay datos disponibles', 
  description = 'No se encontraron registros para mostrar.',
  iconType = 'default',
  icon: CustomIcon,
  action 
}) => {
  // Seleccionar icono: personalizado, o según tipo, o default
  const Icon = CustomIcon || icons[iconType] || icons.default;

  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="w-20 h-20 rounded-2xl bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center mb-5">
        <Icon className="w-9 h-9 text-gray-300" strokeWidth={1.5} />
      </div>
      <h3 className="text-base font-semibold text-gray-800 mb-1">{title}</h3>
      <p className="text-sm text-gray-500 max-w-xs mb-6 leading-relaxed">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
};
