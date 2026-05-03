/**
 * LibroEditModal.jsx - Modal para editar libros
 * 
 * Este componente es un modal para editar la información de un libro
 * existente en el catálogo. Muestra los datos precargados del libro
 * y permite modificar solo los campos deseados.
 * 
 * @author Teca Biblioteca
 * @version 1.0.0
 */

import { useState, useEffect } from 'react';
import { X, BookOpen } from 'lucide-react';
import { catalogoService } from '../../services/catalogoService';
import { notify } from '../../utils/notify';

/**
 * Modal para editar un libro existente
 * 
 * @param {boolean} isOpen - Indica si el modal está abierto
 * @param {Function} onClose - Función para cerrar el modal
 * @param {Object} libro - Datos del libro a editar (precargados)
 * @param {Function} onSuccess - Callback cuando se actualiza exitosamente
 * @returns {JSX.Element|null} Modal o null si está cerrado
 */
export const LibroEditModal = ({ isOpen, onClose, libro, onSuccess }) => {
  const [formData, setFormData] = useState({
    titulo: '',
    isbn: '',
    descripcion: '',
    fecha_publicacion: '',
    autor_id: '',
    editorial_id: '',
    categoria_id: '',
    disponible: true
  });

  const [autores, setAutores] = useState([]);
  const [editoriales, setEditoriales] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Cargar opciones y prepoblar datos cuando se abre el modal
  useEffect(() => {
    if (isOpen && libro) {
      setFormData({
        titulo: libro.titulo || '',
        isbn: libro.isbn || '',
        descripcion: libro.descripcion || '',
        fecha_publicacion: libro.fecha_publicacion ? libro.fecha_publicacion.split('T')[0] : '',
        autor_id: libro.autor_id || '',
        editorial_id: libro.editorial_id || '',
        categoria_id: libro.categoria_id || '',
        disponible: libro.disponible !== false
      });

      // Cargar opciones si no estão cargadas
      const fetchOptions = async () => {
        if (autores.length === 0) {
          try {
            const [autoresRes, edRes, catRes] = await Promise.all([
              catalogoService.getAutores(),
              catalogoService.getEditoriales(),
              catalogoService.getCategorias()
            ]);
            
            setAutores(autoresRes.data?.items || autoresRes.data?.data || autoresRes.data || []);
            setEditoriales(edRes.data?.items || edRes.data?.data || edRes.data || []);
            setCategorias(catRes.data?.items || catRes.data?.data || catRes.data || []);
          } catch (err) {
            console.error('Error cargando opciones', err);
          }
        }
      };
      fetchOptions();
    }
  }, [isOpen, libro]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validación básica
    if (!formData.titulo.trim()) {
      setError('El título es requerido');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const dataToSend = {
        ...formData,
        autor_id: formData.autor_id ? Number(formData.autor_id) : null,
        editorial_id: formData.editorial_id ? Number(formData.editorial_id) : null,
        categoria_id: formData.categoria_id ? Number(formData.categoria_id) : null,
      };

      await catalogoService.updateLibro(libro.id, dataToSend);
      notify.success('Libro actualizado exitosamente');
      onSuccess?.();
      onClose();
    } catch (err) {
      const message = err.message || err.response?.data?.message || 'Error al actualizar el libro';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden animate-scale-in">
        <div className="flex justify-between items-center p-5 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center">
              <BookOpen size={18} className="text-blue-600" />
            </div>
            <h2 className="text-base font-semibold text-gray-900">Editar Libro</h2>
          </div>
          <button onClick={onClose} className="btn-ghost p-2 rounded-lg text-gray-400 hover:text-gray-600" disabled={loading}>
            <X size={18} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto max-h-[calc(90vh-140px)]">
          {error && (
            <div className="flex items-start gap-3 rounded-lg bg-red-50 p-3.5 border border-red-100 animate-slide-down">
              <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-red-600 text-xs font-bold">!</span>
              </div>
              <p className="text-sm text-red-700 font-medium">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Título */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-sm font-medium text-gray-700">Título *</label>
              <input
                type="text"
                name="titulo"
                required
                value={formData.titulo}
                onChange={handleChange}
                className="input"
                placeholder="Ej: Don Quijote de la Mancha"
              />
            </div>

            {/* ISBN */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">ISBN</label>
              <input
                type="text"
                name="isbn"
                value={formData.isbn}
                onChange={handleChange}
                className="input"
                placeholder="Ej: 978-3-16-148410-0"
              />
            </div>

            {/* Fecha de publicación */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Fecha Publicación</label>
              <input
                type="date"
                name="fecha_publicacion"
                value={formData.fecha_publicacion}
                onChange={handleChange}
                className="input"
              />
            </div>

            {/* Descripción */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-sm font-medium text-gray-700">Descripción</label>
              <textarea
                name="descripcion"
                rows="2"
                value={formData.descripcion}
                onChange={handleChange}
                className="input resize-none"
                placeholder="Breve descripción del libro..."
              />
            </div>

            {/* Autor */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Autor</label>
              <select
                name="autor_id"
                value={formData.autor_id}
                onChange={handleChange}
                className="select"
              >
                <option value="">Selecciona un autor</option>
                {autores.map(a => (
                  <option key={a.id} value={a.id}>{a.nombre}</option>
                ))}
              </select>
            </div>

            {/* Editorial */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Editorial</label>
              <select
                name="editorial_id"
                value={formData.editorial_id}
                onChange={handleChange}
                className="select"
              >
                <option value="">Selecciona una editorial</option>
                {editoriales.map(e => (
                  <option key={e.id} value={e.id}>{e.nombre}</option>
                ))}
              </select>
            </div>

            {/* Categoría */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Categoría</label>
              <select
                name="categoria_id"
                value={formData.categoria_id}
                onChange={handleChange}
                className="select"
              >
                <option value="">Selecciona una categoría</option>
                {categorias.map(c => (
                  <option key={c.id} value={c.id}>{c.nombre}</option>
                ))}
              </select>
            </div>

            {/* Disponibilidad */}
            <div className="flex items-center gap-3 pt-2">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="disponible"
                  checked={formData.disponible}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
              <span className="text-sm font-medium text-gray-700">
                Disponible para préstamo
              </span>
            </div>
          </div>

          <div className="flex gap-3 pt-2 border-t border-gray-100">
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
                  Guardando...
                </span>
              ) : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};