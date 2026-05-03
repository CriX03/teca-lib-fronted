/**
 * Catalogo.jsx - Página del catálogo de libros
 * 
 * Este componente muestra la lista completa de libros del catálogo con
 * funcionalidades de búsqueda, filtrado, paginación y acciones según el rol
 * del usuario. Los administradores pueden crear, editar y eliminar libros,
 * mientras que los usuarios regulares pueden ver detalles y solicitar préstamos.
 * 
 * Funcionalidades:
 * - Listado paginado de libros
 * - Búsqueda por título con debounce
 * - Filtro por disponibilidad
 * - Modal de detalles del libro
 * - Modal de solicitud de préstamo
 * - Acciones de CRUD (solo admin)
 * 
 * @author Teca Biblioteca
 * @version 1.0.0
 */

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Search, Edit, Trash2, BookOpen, ChevronLeft, ChevronRight, Info } from 'lucide-react';
import { catalogoService } from '../../services/catalogoService';
import { useDebounce } from '../../hooks/useDebounce';
import { useAuth } from '../../hooks/useAuth';
import { PrestamoModal } from '../../components/prestamos/PrestamoModal';
import { LibroDetalleModal } from '../../components/ui/LibroDetalleModal';
import { LibroEditModal } from '../../components/ui/LibroEditModal';
import { TableSkeleton, EmptyState, ErrorMessage } from '../../components/ui';
import { useConfirm } from '../../components/ui/ConfirmDialog';
import { notify } from '../../utils/notify';

/**
 * Componente principal del catálogo de libros
 * @returns {JSX.Element} Página del catálogo
 */
export const Catalogo = () => {
  const [libros, setLibros] = useState([]);        // Lista de libros
  const [loading, setLoading] = useState(true);  // Estado de carga
  const [error, setError] = useState(null);       // Mensaje de error
  
  // Filtros y paginación
  const [searchTerm, setSearchTerm] = useState('');           // Término de búsqueda
  const debouncedSearch = useDebounce(searchTerm, 500);       // Búsqueda con debounce
  const [disponible, setDisponible] = useState('');           // Filtro de disponibilidad
  const [page, setPage] = useState(1);                        // Página actual
  const [totalPages, setTotalPages] = useState(1);             // Total de páginas
  
  // Estado del modal de préstamo
  const [isPrestamoModalOpen, setIsPrestamoModalOpen] = useState(false);
  const [libroSeleccionado, setLibroSeleccionado] = useState(null);
  
  // Estado del modal de detalles
  const [isDetalleModalOpen, setIsDetalleModalOpen] = useState(false);
  const [libroDetalle, setLibroDetalle] = useState(null);
  const [loadingDetalle, setLoadingDetalle] = useState(false);
  
  // Estado del modal de edición
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [libroEditando, setLibroEditando] = useState(null);
  
  const { user } = useAuth();
  const isAdmin = user?.rol === 'admin';
  const navigate = useNavigate();
  const confirm = useConfirm();

  /**
   * Obtiene la lista de libros desde el servidor
   */
  const fetchLibros = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = {
        page,
        per_page: 10,
        ...(debouncedSearch && { titulo: debouncedSearch }),
        ...(disponible && { disponible: disponible === 'true' })
      };
      
      const response = await catalogoService.getLibros(params);
      
      if (response.data && response.data.success !== false) {
        const data = response.data.data || response.data;
        setLibros(data.libros || data.items || data || []);
        const paginationData = data.pagination || data;
        if (paginationData.total_pages) setTotalPages(paginationData.total_pages);
        else if (paginationData.total) setTotalPages(Math.ceil(paginationData.total / 10));
      }
    } catch (err) {
      setError('Error al cargar el catálogo. Verifica tu conexión.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Recargar libros cuando cambian filtros o página
  useEffect(() => {
    fetchLibros();
  }, [debouncedSearch, disponible, page]);

  /**
   * Maneja la eliminación de un libro
   * @param {Object} libro - Libro a eliminar
   */
  const handleDelete = async (libro) => {
    const confirmed = await confirm({
      title: '¿Eliminar libro?',
      message: `Estás a punto de eliminar "${libro.titulo}". Esta acción no se puede deshacer.`,
      confirmText: 'Eliminar',
      type: 'danger',
    });

    if (confirmed) {
      try {
        await catalogoService.deleteLibro(libro.id);
        notify.success('Libro eliminado exitosamente');
        fetchLibros();
      } catch (err) {
        notify.error('Error al eliminar el libro');
      }
    }
  };

  /**
   * Maneja la visualización de detalles de un libro
   * @param {Object} libro - Libro a ver
   */
  const handleVerDetalle = async (libro) => {
    setLibroDetalle(libro);
    setIsDetalleModalOpen(true);
    setLoadingDetalle(true);
    
    try {
      const response = await catalogoService.getLibroById(libro.id);
      const libroData = response.data?.data || response.data;
      
      setLibroDetalle(prev => ({
        ...prev,
        ...libroData,
        fecha_publicacion: libro.fecha_publicacion || libroData?.fecha_publicacion || null,
        autor_nombre: libroData.autor || 'No especificado',
        editorial_nombre: libroData.editorial || 'No especificado',
        categoria_nombre: libroData.categoria || 'No especificado'
      }));
    } catch (err) {
      console.error('Error al cargar detalles del libro:', err);
      notify.error('Error al cargar los detalles del libro');
      setIsDetalleModalOpen(false);
    } finally {
      setLoadingDetalle(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-[var(--text-primary)] flex items-center gap-2">
          <BookOpen className="text-primary-500" />
          Catálogo de Libros
        </h1>
        
          <div className="flex flex-wrap items-center gap-2">
            {isAdmin && (
              <>
                <Link to="/catalogo/autores" className="btn btn-secondary text-xs sm:text-sm">
                  Autores
                </Link>
                <Link to="/catalogo/editoriales" className="btn btn-secondary text-xs sm:text-sm">
                  Editoriales
                </Link>
                <Link to="/catalogo/categorias" className="btn btn-secondary text-xs sm:text-sm">
                  Categorías
                </Link>
                <Link to="/catalogo/nuevo" className="btn btn-primary text-xs sm:text-sm">
                  <Plus size={16} />
                  <span className="hidden sm:inline">Crear Libro</span>
                </Link>
              </>
            )}
          </div>
      </div>

      {/* Filtros */}
      <div className="glass-card rounded-xl p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={18} />
          <input
            type="text"
            placeholder="Buscar por título..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            className="input pl-10"
          />
        </div>
        
        <select
          value={disponible}
          onChange={(e) => {
            setDisponible(e.target.value);
            setPage(1);
          }}
          className="select sm:w-48"
        >
          <option value="">Todos los estados</option>
          <option value="true">Disponibles</option>
          <option value="false">Prestados</option>
        </select>
      </div>

      {/* Contenido */}
      <div className="glass-card rounded-xl overflow-hidden">
        {error && (
          <ErrorMessage message={error} onRetry={fetchLibros} />
        )}
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[var(--bg-base)]/50 text-xs uppercase text-[var(--text-muted)] border-b border-[var(--border-color)]">
              <tr>
                <th className="px-6 py-3.5 font-semibold">Título</th>
                <th className="px-6 py-3.5 font-semibold hidden sm:table-cell">ISBN</th>
                <th className="px-6 py-3.5 font-semibold">Estado</th>
                <th className="px-6 py-3.5 font-semibold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)]">
              {loading ? (
                <tr>
                  <td colSpan="4" className="p-0">
                    <TableSkeleton rows={5} cols={4} />
                  </td>
                </tr>
              ) : libros.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-0">
                    <EmptyState
                      title={searchTerm ? 'Sin resultados' : 'Catálogo vacío'}
                      description={
                        searchTerm 
                          ? `No se encontraron libros que coincidan con "${searchTerm}"`
                          : 'Aún no hay libros registrados. Comienza creando uno.'
                      }
                      iconType={searchTerm ? 'search' : 'books'}
                      action={!searchTerm && isAdmin && (
                        <Link to="/catalogo/nuevo" className="btn btn-primary">
                          <Plus size={16} /> Crear primer libro
                        </Link>
                      )}
                    />
                  </td>
                </tr>
              ) : (
                libros.map((libro) => (
                  <tr key={libro.id} className="table-row-hover">
                    <td className="px-6 py-4">
                      <span className="font-semibold text-[var(--text-primary)]">{libro.titulo}</span>
                    </td>
                    <td className="px-6 py-4 text-[var(--text-muted)] hidden sm:table-cell">
                      <code className="text-xs bg-[var(--primary-light)] px-2 py-0.5 rounded">{libro.isbn || '—'}</code>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`badge ${libro.disponible !== false && libro.disponibilidad !== false ? 'badge-success' : 'badge-warning'}`}>
                        {libro.disponible !== false && libro.disponibilidad !== false ? 'Disponible' : 'Prestado'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleVerDetalle(libro)}
                          className="btn-ghost p-2.5 rounded-xl"
                          title="Ver detalles"
                        >
                          <Info size={16} className="text-[var(--text-muted)]" />
                        </button>
                        {libro.disponible !== false && libro.disponibilidad !== false && (
                          <button
                            onClick={() => {
                              setLibroSeleccionado(libro);
                              setIsPrestamoModalOpen(true);
                            }}
                            className="btn-ghost p-2.5 rounded-xl"
                            title="Solicitar préstamo"
                          >
                            <BookOpen size={16} className="text-emerald-500" />
                          </button>
                        )}
                        {isAdmin && (
                          <>
                            <button
                              onClick={() => {
                                setLibroEditando(libro);
                                setIsEditModalOpen(true);
                              }}
                              className="btn-ghost p-2.5 rounded-xl"
                              title="Editar"
                            >
                              <Edit size={16} className="text-blue-500" />
                            </button>
                            <button
                              onClick={() => handleDelete(libro)}
                              className="btn-ghost p-2.5 rounded-xl"
                              title="Eliminar"
                            >
                              <Trash2 size={16} className="text-red-500" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        {!loading && totalPages > 1 && (
          <div className="px-6 py-4 border-t border-[var(--border-color)] flex items-center justify-between bg-[var(--bg-base)]/50">
            <button
              disabled={page === 1}
              onClick={() => setPage(p => Math.max(1, p - 1))}
              className="btn btn-secondary text-xs"
            >
              <ChevronLeft size={16} />
              Anterior
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) pageNum = i + 1;
                else if (page <= 3) pageNum = i + 1;
                else if (page >= totalPages - 2) pageNum = totalPages - 4 + i;
                else pageNum = page - 2 + i;

                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`w-9 h-9 rounded-lg text-sm font-semibold transition-all ${
                      pageNum === page
                        ? 'bg-primary-500 text-white'
                        : 'text-[var(--text-secondary)] hover:bg-[var(--primary-light)]'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            <button
              disabled={page === totalPages}
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              className="btn btn-secondary text-xs"
            >
              Siguiente
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Modal de préstamo */}
      <PrestamoModal
        isOpen={isPrestamoModalOpen}
        onClose={() => {
          setIsPrestamoModalOpen(false);
          setLibroSeleccionado(null);
        }}
        libro={libroSeleccionado}
        onSuccess={() => {
          notify.success('¡Préstamo realizado exitosamente!');
          fetchLibros();
        }}
      />

      {/* Modal de detalles */}
      <LibroDetalleModal
        isOpen={isDetalleModalOpen}
        onClose={() => {
          setIsDetalleModalOpen(false);
          setLibroDetalle(null);
        }}
        libro={libroDetalle}
        loading={loadingDetalle}
      />

      {/* Modal de edición */}
      <LibroEditModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setLibroEditando(null);
        }}
        libro={libroEditando}
        onSuccess={() => {
          fetchLibros();
        }}
      />
    </div>
  );
};
