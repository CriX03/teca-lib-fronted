/**
 * PrestamoModal.jsx - Modal para solicitar préstamos de libros
 * 
 * Este componente presenta un formulario modal que permite al usuario
 * seleccionar la duración del préstamo y confirmar la solicitud.
 * Calcula automáticamente la fecha de devolución basada en los días seleccionados.
 * 
 * @author Teca Biblioteca
 * @version 1.0.0
 */

import { useState } from 'react';
import { X, BookOpen, Clock } from 'lucide-react';
import { prestamosService } from '../../services/prestamosService';

/**
 * Modal para crear un nuevo préstamo de libro
 * 
 * @param {boolean} isOpen - Indica si el modal está abierto
 * @param {Function} onClose - Función para cerrar el modal
 * @param {Object} libro - Objeto del libro a prestar
 * @param {Function} onSuccess - Callback cuando el préstamo se crea exitosamente
 * @returns {JSX.Element|null} Modal de préstamo o null si está cerrado
 */
export const PrestamoModal = ({ isOpen, onClose, libro, onSuccess }) => {
  const [dias, setDias] = useState(7);          // Días de préstamo seleccionados
  const [loading, setLoading] = useState(false); // Estado de carga
  const [error, setError] = useState(null);     // Mensaje de error

  if (!isOpen || !libro) return null;

  /**
   * Maneja el envío del formulario de préstamo
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await prestamosService.createPrestamo({
        libro_id: libro.id,
        dias_prestamo: Number(dias)
      });
      onSuccess();
      onClose();
    } catch (err) {
      // Manejo de errores específicos del negocio
      if (err.response?.data?.error?.code === 'BOOK_NOT_AVAILABLE' || err.code === 'BOOK_NOT_AVAILABLE') {
        setError('El libro no está disponible para préstamo.');
      } else if (err.response?.data?.error?.code === 'BOOK_ALREADY_LOANED' || err.code === 'BOOK_ALREADY_LOANED') {
        setError('Ya tienes este libro prestado.');
      } else {
        setError(err.response?.data?.error?.message || err.message || 'Error al solicitar el préstamo');
      }
    } finally {
      setLoading(false);
    }
  };

  // Calcular fecha de devolución
  const returnDate = new Date();
  returnDate.setDate(returnDate.getDate() + Number(dias));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop - Fondo oscuro semitransparente */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary-100 flex items-center justify-center">
              <BookOpen size={18} className="text-primary-600" />
            </div>
            <h2 className="text-base font-semibold text-gray-900">Solicitar Préstamo</h2>
          </div>
          <button onClick={onClose} className="btn-ghost p-2 rounded-lg text-gray-400 hover:text-gray-600">
            <X size={18} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-5 space-y-5">
          {/* Mensaje de error */}
          {error && (
            <div className="flex items-start gap-3 rounded-lg bg-red-50 p-3.5 border border-red-100 animate-slide-down">
              <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-red-600 text-xs font-bold">!</span>
              </div>
              <p className="text-sm text-red-700 font-medium">{error}</p>
            </div>
          )}

          {/* Información del libro seleccionado */}
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
            <p className="text-xs text-gray-500 mb-1">Libro seleccionado</p>
            <p className="font-semibold text-gray-900">{libro.titulo}</p>
            {libro.isbn && (
              <p className="text-xs text-gray-500 mt-1">
                ISBN: <code className="bg-gray-200 px-1.5 py-0.5 rounded">{libro.isbn}</code>
              </p>
            )}
          </div>

          {/* Selector de días de préstamo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Días de préstamo
            </label>
            <select
              value={dias}
              onChange={(e) => setDias(e.target.value)}
              className="select"
              disabled={loading}
            >
              <option value={7}>7 días</option>
              <option value={14}>14 días</option>
              <option value={21}>21 días</option>
              <option value={30}>30 días</option>
            </select>
          </div>

          {/* Vista previa de fecha de devolución */}
          <div className="flex items-center gap-2.5 text-sm text-gray-500 bg-blue-50/50 p-3 rounded-lg border border-blue-100">
            <Clock size={16} className="text-blue-500 flex-shrink-0" />
            <span>
              Fecha estimada de devolución:{' '}
              <strong className="text-gray-700">
                {returnDate.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
              </strong>
            </span>
          </div>

          {/* Botones de acción */}
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
              ) : (
                'Confirmar Préstamo'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
