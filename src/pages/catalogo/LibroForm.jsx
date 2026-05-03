/**
 * LibroForm.jsx - Formulario para crear/editar libros
 * 
 * Este componente presenta un formulario completo para registrar o modificar
 * libros en el catálogo. Solo los usuarios con rol de administrador pueden acceder.
 * 
 * El formulario incluye campos para:
 * - Título (requerido)
 * - ISBN
 * - Descripción
 * - Fecha de publicación
 * - Autor (selección)
 * - Editorial (selección)
 * - Categoría (selección)
 * - Disponibilidad para préstamo
 * 
 * @author Teca Biblioteca
 * @version 1.0.0
 */

import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save, Lock } from 'lucide-react';
import { catalogoService } from '../../services/catalogoService';
import { useAuth } from '../../hooks/useAuth';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { ErrorMessage } from '../../components/ui/ErrorMessage';
import { notify } from '../../utils/notify';

/**
 * Componente de formulario para crear o editar un libro
 * @returns {JSX.Element} Formulario de libro
 */
export const LibroForm = () => {
  const { id } = useParams();                   // ID del libro (si es edición)
  const navigate = useNavigate();              // Navegación
  const isEditing = Boolean(id);               // Modo edición vs creación
  const { user } = useAuth();
  const isAdmin = user?.rol === 'admin';

  // Estado del formulario
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

  // Listas de opciones para selects
  const [autores, setAutores] = useState([]);
  const [editoriales, setEditoriales] = useState([]);
  const [categorias, setCategorias] = useState([]);

  // Estados de carga y error
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(isEditing);
  const [error, setError] = useState(null);

  /**
   * Effect para cargar las relaciones y datos del libro (si es edición)
   */
  useEffect(() => {
    // Cargar autores, editoriales y categorías
    const fetchRelations = async () => {
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
        console.error('Error cargando relaciones', err);
      }
    };

    fetchRelations();

    // Si es modo edición, cargar datos del libro
    if (isEditing) {
      const fetchLibro = async () => {
        try {
          setPageLoading(true);
          const res = await catalogoService.getLibros({ id });
          const data = res.data?.data?.items || res.data?.data?.libros || res.data?.libros || res.data?.data || res.data || [];
          const libro = Array.isArray(data) ? data.find(l => l.id === Number(id) || l.id === id) : data;
          
          if (libro) {
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
          }
        } catch (err) {
          setError('Error al cargar los datos del libro');
        } finally {
          setPageLoading(false);
        }
      };
      fetchLibro();
    }
  }, [id, isEditing]);

  /**
   * Maneja cambios en los campos del formulario
   */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  /**
   * Maneja el envío del formulario
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Convertir IDs a números
      const dataToSend = {
        ...formData,
        autor_id: formData.autor_id ? Number(formData.autor_id) : null,
        editorial_id: formData.editorial_id ? Number(formData.editorial_id) : null,
        categoria_id: formData.categoria_id ? Number(formData.categoria_id) : null,
      };

      if (isEditing) {
        await catalogoService.updateLibro(id, dataToSend);
        notify.success('Libro actualizado exitosamente');
      } else {
        await catalogoService.createLibro(dataToSend);
        notify.success('Libro creado exitosamente');
        
        const libroTemporal = {
          id: Date.now(),
          titulo: formData.titulo,
          fecha_publicacion: formData.fecha_publicacion || null
        };
        const fechasTemporal = JSON.parse(localStorage.getItem('fechas_publicacion') || '{}');
        fechasTemporal[formData.titulo] = formData.fecha_publicacion;
        localStorage.setItem('fechas_publicacion', JSON.stringify(fechasTemporal));
      }
      navigate('/catalogo');
    } catch (err) {
      const message = err.message || err.response?.data?.message || 'Error al guardar el libro';
      setError(message);
      notify.error(message);
    } finally {
      setLoading(false);
    }
  };

  // Mostrar spinner mientras carga
  if (pageLoading) {
    return <LoadingSpinner variant="page" text="Cargando datos del libro..." />;
  }

  // Verificar permisos de administrador
  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
          <Lock size={32} className="text-red-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Acceso Denegado</h1>
        <p className="text-gray-600 max-w-md mb-6">
          No tienes permisos para acceder a esta sección. Solo los administradores pueden gestionar libros.
        </p>
        <button onClick={() => navigate('/catalogo')} className="btn btn-primary">
          Volver al Catálogo
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          to="/catalogo"
          className="btn-ghost p-2 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEditing ? 'Editar Libro' : 'Nuevo Libro'}
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {isEditing ? 'Modifica los datos del libro' : 'Completa el formulario para registrar un libro'}
          </p>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          {error && <ErrorMessage message={error} />}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Título */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Título *</label>
                <input
                  type="text"
                  name="titulo"
                  required
                  placeholder="Ej: Don Quijote de la Mancha"
                  value={formData.titulo}
                  onChange={handleChange}
                  className="input"
                />
              </div>

              {/* ISBN */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">ISBN</label>
                <input
                  type="text"
                  name="isbn"
                  placeholder="Ej: 978-3-16-148410-0"
                  value={formData.isbn}
                  onChange={handleChange}
                  className="input"
                />
              </div>

              {/* Descripción */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-sm font-medium text-gray-700">Descripción</label>
                <textarea
                  name="descripcion"
                  rows="3"
                  placeholder="Breve descripción del libro..."
                  value={formData.descripcion}
                  onChange={handleChange}
                  className="input resize-none"
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
              
              {/* Disponibilidad */}
              <div className="md:col-span-2 flex items-center gap-3 pt-2">
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

            {/* Botones de acción */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => navigate('/catalogo')}
                className="btn btn-secondary"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Guardando...
                  </span>
                ) : (
                  <>
                    <Save size={16} />
                    Guardar
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
