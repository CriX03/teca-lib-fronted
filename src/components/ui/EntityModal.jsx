/**
 * EntityModal.jsx - Modal genérico para crear/editar entidades
 * 
 * Este componente es un modal reutilizable que permite crear o editar
 * entidades del catálogo como autores, editoriales o categorías. Maneja
 * la validación de entrada y muestra errores de forma consistente.
 * 
 * @author Teca Biblioteca
 * @version 1.0.0
 */

import { useState, useEffect } from 'react';
import { X, Tag, Users, Building2 } from 'lucide-react';

/**
 * Configuración de iconos y etiquetas por tipo de entidad
 */
const iconMap = {
  categoria: { icon: Tag, label: 'Categoría', color: 'bg-purple-100', iconColor: 'text-purple-600' },
  autor: { icon: Users, label: 'Autor', color: 'bg-blue-100', iconColor: 'text-blue-600' },
  editorial: { icon: Building2, label: 'Editorial', color: 'bg-emerald-100', iconColor: 'text-emerald-600' },
};

/**
 * Modal genérico para crear o editar entidades del catálogo
 * 
 * @param {boolean} isOpen - Indica si el modal está abierto
 * @param {Function} onClose - Función para cerrar el modal
 * @param {Function} onSubmit - Función para manejar el envío del formulario
 * @param {Object} initialData - Datos iniciales para edición
 * @param {string} entityType - Tipo de entidad ('categoria', 'autor', 'editorial')
 * @param {boolean} loading - Indica si hay una operación en curso
 * @returns {JSX.Element|null} Modal o null si está cerrado
 */
export const EntityModal = ({ isOpen, onClose, onSubmit, initialData, entityType, loading }) => {
  const [nombre, setNombre] = useState('');
  const [error, setError] = useState('');
  
  // Obtener configuración según el tipo de entidad
  const config = iconMap[entityType] || iconMap.categoria;
  const isEditing = !!initialData?.id;
  const title = isEditing ? `Editar ${config.label}` : `Crear ${config.label}`;
  const IconComp = config.icon;

  // Reiniciar formulario cuando se abre el modal
  useEffect(() => {
    if (isOpen) {
      setNombre(initialData?.nombre || '');
      setError('');
    }
  }, [isOpen, initialData]);

  /**
   * Maneja el envío del formulario
   * Valida el nombre antes de enviar
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = nombre.trim();
    
    // Validación: nombre requerido
    if (!trimmed) {
      setError('El nombre es requerido');
      return;
    }
    // Validación: mínimo 2 caracteres
    if (trimmed.length < 2) {
      setError('El nombre debe tener al menos 2 caracteres');
      return;
    }
    // Si no hay cambios, cerrar sin enviar
    if (trimmed === initialData?.nombre) {
      onClose();
      return;
    }
    
    setError('');
    try {
      await onSubmit(trimmed);
      onClose();
    } catch (err) {
      setError(err.response?.data?.error?.message || err.message || `Error al ${isEditing ? 'actualizar' : 'crear'} ${config.label.toLowerCase()}`);
    }
  };

  // Maneja cambios en el input y limpia errores previos
  const handleChange = (e) => {
    setNombre(e.target.value);
    if (error) setError('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop - Fondo oscuro */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-scale-in">
        <div className="flex justify-between items-center p-5 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded-xl ${config.color} flex items-center justify-center`}>
              <IconComp size={18} className={config.iconColor} />
            </div>
            <h2 className="text-base font-semibold text-gray-900">{title}</h2>
          </div>
          <button onClick={onClose} className="btn-ghost p-2 rounded-lg text-gray-400 hover:text-gray-600" disabled={loading}>
            <X size={18} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-5 space-y-5">
          {error && (
            <div className="flex items-start gap-3 rounded-lg bg-red-50 p-3.5 border border-red-100 animate-slide-down">
              <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-red-600 text-xs font-bold">!</span>
              </div>
              <p className="text-sm text-red-700 font-medium">{error}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Nombre de {config.label.toLowerCase()}
            </label>
            <input
              type="text"
              value={nombre}
              onChange={handleChange}
              placeholder={`Ingresa el nombre de ${config.label.toLowerCase()}`}
              className="input"
              autoFocus
              disabled={loading}
            />
          </div>

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary flex-1"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary flex-1"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Procesando...
                </span>
              ) : isEditing ? 'Guardar Cambios' : `Crear ${config.label}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};