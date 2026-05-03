/**
 * EmptyState.jsx - Componente para estados vacíos
 * 
 * Este componente se muestra cuando no hay datos para mostrar en una tabla,
 * lista o sección. Proporciona retroalimentación visual consistente con un
 * icono, título y descripción que pueden personalizarse según el contexto.
 * Soporta modo dark mode.
 * 
 * @author Teca Biblioteca
 * @version 1.0.0
 */

import { FolderOpen, BookOpen, Bookmark, Users, Search } from 'lucide-react';

const icons = {
  default: FolderOpen,
  books: BookOpen,
  loans: Bookmark,
  users: Users,
  search: Search,
};

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
      <div className="w-20 h-20 rounded-2xl bg-[var(--primary-light)] border-2 border-dashed border-[var(--border-color)] flex items-center justify-center mb-5">
        <Icon className="w-9 h-9 text-[var(--text-muted)]" strokeWidth={1.5} />
      </div>
      <h3 className="text-base font-semibold text-[var(--text-primary)] mb-1">{title}</h3>
      <p className="text-sm text-[var(--text-muted)] max-w-xs mb-6 leading-relaxed">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
};