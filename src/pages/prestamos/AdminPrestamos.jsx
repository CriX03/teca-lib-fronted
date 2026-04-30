import { useState, useEffect } from 'react';
import { BookOpen, Calendar, CheckCircle, Search, ChevronLeft, ChevronRight, Users, AlertTriangle } from 'lucide-react';
import { prestamosService } from '../../services/prestamosService';
import { TableSkeleton, EmptyState, ErrorMessage } from '../../components/ui';
import { useConfirm } from '../../components/ui/ConfirmDialog';
import { notify } from '../../utils/notify';

export const AdminPrestamos = () => {
  const [prestamos, setPrestamos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [devolviendo, setDevolviendo] = useState(null);
  const confirm = useConfirm();

  // Pagination
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Filters
  const [estadoFilter, setEstadoFilter] = useState('todos');
  const [tituloFilter, setTituloFilter] = useState('');
  const [searchInput, setSearchInput] = useState('');

  const fetchPrestamos = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = { page, limit, estado: estadoFilter };
      if (searchInput.trim()) params.libro_titulo = searchInput.trim();

      const response = await prestamosService.getAllPrestamos(params);
      if (response.data?.success) {
        const data = response.data.data;
        setPrestamos(data.items || []);
        setTotalItems(data.pagination?.total_items || 0);
        setTotalPages(data.pagination?.total_pages || 0);
      } else {
        setError('Error al cargar los préstamos');
      }
    } catch (err) {
      setError('Error al cargar los préstamos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrestamos();
  }, [page, limit, estadoFilter]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchPrestamos();
  };

  const handleDevolucion = async (prestamo) => {
    const confirmed = await confirm({
      title: 'Confirmar devolución (Admin)',
      message: `Estás devolviendo "${prestamo.libro_titulo}" del usuario ${prestamo.usuario_nombre}. Se actualizará la disponibilidad del libro.`,
      confirmText: 'Devolver',
      type: 'info',
    });

    if (!confirmed) return;

    try {
      setDevolviendo(prestamo.id);
      await prestamosService.returnPrestamoAdmin(prestamo.id);
      notify.success('Libro devuelto exitosamente');
      await fetchPrestamos();
    } catch (err) {
      if (err.response?.data?.error?.code === 'LOAN_ALREADY_RETURNED') {
        notify.error('El préstamo ya fue devuelto');
      } else {
        notify.error(err.response?.data?.error?.message || 'Error al devolver el libro');
      }
    } finally {
      setDevolviendo(null);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'N/A';
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const isOverdue = (fechaLimite) => {
    if (!fechaLimite) return false;
    return new Date(fechaLimite) < new Date();
  };

  const clearFilters = () => {
    setEstadoFilter('todos');
    setSearchInput('');
    setTituloFilter('');
    setPage(1);
    fetchPrestamos();
  };

  const hasActiveFilters = estadoFilter !== 'todos' || searchInput !== '';
  const activos = prestamos.filter(p => p.estado === 'activo');
  const devueltos = prestamos.filter(p => p.estado === 'devuelto');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="text-primary-600" />
            Todos los Préstamos
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {totalItems > 0 && `${totalItems} préstamo(s) en total`}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          {/* Estado filter */}
          <div className="flex-1">
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Estado</label>
            <select
              value={estadoFilter}
              onChange={(e) => { setEstadoFilter(e.target.value); setPage(1); }}
              className="select w-full"
            >
              <option value="todos">Todos</option>
              <option value="activo">Activos</option>
              <option value="devuelto">Devueltos</option>
            </select>
          </div>

          {/* Search by title */}
          <div className="flex-1">
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Buscar por libro</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Título del libro..."
                className="input flex-1"
              />
              <button type="submit" className="btn btn-primary px-3" title="Buscar">
                <Search size={16} />
              </button>
            </div>
          </div>

          {/* Items per page */}
          <div className="w-32">
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Por página</label>
            <select
              value={limit}
              onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }}
              className="select w-full"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>

          {/* Clear filters */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="btn btn-ghost self-end px-3 py-2 text-sm text-gray-500 hover:text-gray-700"
            >
              Limpiar filtros
            </button>
          )}
        </form>
      </div>

      {/* Stats */}
      {!loading && prestamos.length > 0 && (
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                <BookOpen size={16} className="text-amber-600" />
              </div>
              <div>
                <p className="text-xs text-amber-700 font-medium">Activos en esta página</p>
                <p className="text-lg font-bold text-amber-800">{activos.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                <CheckCircle size={16} className="text-emerald-600" />
              </div>
              <div>
                <p className="text-xs text-emerald-700 font-medium">Devueltos en esta página</p>
                <p className="text-lg font-bold text-emerald-800">{devueltos.length}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error */}
      {error && <ErrorMessage message={error} onRetry={fetchPrestamos} />}

      {/* Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50/80 text-xs uppercase text-gray-500 border-b border-gray-100">
              <tr>
                <th className="px-6 py-3.5 font-semibold">Libro</th>
                <th className="px-6 py-3.5 font-semibold">Usuario</th>
                <th className="px-6 py-3.5 font-semibold hidden lg:table-cell">F. Préstamo</th>
                <th className="px-6 py-3.5 font-semibold hidden lg:table-cell">F. Límite</th>
                <th className="px-6 py-3.5 font-semibold">Estado</th>
                <th className="px-6 py-3.5 font-semibold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan="6" className="p-0">
                    <TableSkeleton rows={5} cols={6} />
                  </td>
                </tr>
              ) : prestamos.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-0">
                    <EmptyState
                      title="No se encontraron préstamos"
                      description="No hay préstamos que coincidan con los filtros aplicados."
                      iconType="loans"
                      action={
                        hasActiveFilters ? (
                          <button onClick={clearFilters} className="btn btn-primary">
                            Limpiar filtros
                          </button>
                        ) : null
                      }
                    />
                  </td>
                </tr>
              ) : (
                prestamos.map((prestamo) => {
                  const overdue = prestamo.estado === 'activo' && isOverdue(prestamo.fecha_limite);

                  return (
                    <tr key={prestamo.id} className="table-row-hover">
                      <td className="px-6 py-4">
                        <div>
                          <span className="font-medium text-gray-900">{prestamo.libro_titulo}</span>
                          <div className="text-xs text-gray-400 mt-0.5">
                            {prestamo.libro_categoria}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-gray-700">
                          <Users size={14} className="text-gray-400" />
                          <span className="font-medium">{prestamo.usuario_nombre}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 hidden lg:table-cell">
                        <div className="flex items-center gap-1.5 text-gray-500">
                          <Calendar size={14} className="text-gray-400" />
                          {formatDate(prestamo.fecha_prestamo)}
                        </div>
                      </td>
                      <td className="px-6 py-4 hidden lg:table-cell">
                        <div className={`flex items-center gap-1.5 ${overdue ? 'text-red-600 font-medium' : 'text-gray-500'}`}>
                          {overdue ? (
                            <AlertTriangle size={14} />
                          ) : (
                            <Calendar size={14} className="text-gray-400" />
                          )}
                          {formatDate(prestamo.fecha_limite)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {prestamo.estado === 'devuelto' ? (
                          <span className="badge badge-success">Devuelto</span>
                        ) : overdue ? (
                          <span className="badge badge-danger">Vencido</span>
                        ) : (
                          <span className="badge badge-warning">Activo</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {prestamo.estado === 'activo' && (
                          <button
                            onClick={() => handleDevolucion(prestamo)}
                            disabled={devolviendo === prestamo.id}
                            className="btn btn-primary text-xs py-1.5 px-3"
                          >
                            <CheckCircle size={14} />
                            {devolviendo === prestamo.id ? 'Procesando...' : 'Devolver'}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
            <p className="text-sm text-gray-500">
              Mostrando {prestamos.length} de {totalItems} préstamos
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="btn-ghost p-2 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed"
                title="Página anterior"
              >
                <ChevronLeft size={18} />
              </button>
              <span className="text-sm font-medium text-gray-700 px-3">
                {page} / {totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="btn-ghost p-2 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed"
                title="Página siguiente"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};