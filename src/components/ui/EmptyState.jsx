import { FolderOpen, BookOpen, Bookmark, Users, Search } from 'lucide-react';

const icons = {
  default: FolderOpen,
  books: BookOpen,
  loans: Bookmark,
  users: Users,
  search: Search,
};

/**
 * Componente reutilizable para estados vacíos.
 * @param {string} title - Título principal
 * @param {string} description - Descripción secundaria
 * @param {'default' | 'books' | 'loans' | 'users' | 'search'} iconType - Tipo de ícono predefinido
 * @param {React.ReactNode} action - Botón o acción opcional
 */
export const EmptyState = ({ 
  title = 'No hay datos disponibles', 
  description = 'No se encontraron registros para mostrar.',
  iconType = 'default',
  icon: CustomIcon,
  action 
}) => {
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
