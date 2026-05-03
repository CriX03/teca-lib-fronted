/**
 * MisPrestamos.jsx - Página de préstamos del usuario
 * 
 * Este componente muestra los préstamos del usuario autenticado, separando
 * los préstamos activos del historial de devoluciones. Permite visualizar
 * el estado de cada préstamo, las fechas de préstamo y límite, y para
 * usuarios administradores, también permite devolver los libros.
 * 
 * Características:
 * - Lista de préstamos activos con estado de vencimiento
 * - Historial de libros devueltos
 * - Carga de títulos de libros en tiempo real
 * - Botón de devolución para admins
 * 
 * @author Teca Biblioteca
 * @version 1.0.0
 */

import { useState, useEffect, useContext } from 'react';
import { BookOpen, Calendar, CheckCircle, AlertTriangle } from 'lucide-react';
import { prestamosService } from '../../services/prestamosService';
import { catalogoService } from '../../services/catalogoService';
import { TableSkeleton, EmptyState, ErrorMessage } from '../../components/ui';
import { useConfirm } from '../../components/ui/ConfirmDialog';
import { notify } from '../../utils/notify';
import { AuthContext } from '../../context/AuthContext';

/**
 * Componente de préstamos del usuario
 * @returns {JSX.Element} Página de préstamos
 */
export const MisPrestamos = () => {
  const { user } = useContext(AuthContext);
  const [prestamos, setPrestamos] = useState([]);        // Lista de préstamos
  const [loading, setLoading] = useState(true);          // Estado de carga
  const [error, setError] = useState(null);             // Mensaje de error
  const [devolviendo, setDevolviendo] = useState(null); // ID del préstamo en proceso
  const confirm = useConfirm();

  const isAdmin = user?.rol === 'admin';

  /**
   * Carga los préstamos del usuario
   */
  const fetchPrestamos = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await prestamosService.getMisPrestamos();
      
      if (response.data && response.data.success !== false) {
        const data = response.data.data || response.data;
        const prestamos = data.items || data.prestamos || data || [];

        // Cargar títulos de los libros
        const libroIds = [...new Set(prestamos.map(p => p.libro_id).filter(Boolean))];
        const libroTitles = {};
        
        await Promise.all(
          libroIds.map(async (id) => {
            try {
              const res = await catalogoService.getLibroById(id);
              const libroData = res.data?.data || res.data;
              libroTitles[id] = libroData?.titulo || `Libro #${id}`;
            } catch {
              libroTitles[id] = `Libro #${id}`;
            }
          })
        );

        // Enriquecer préstamos con títulos
        const prestamosEnriquecidos = prestamos.map(p => ({
          ...p,
          titulo: libroTitles[p.libro_id] || `Libro #${p.libro_id}`,
        }));

        setPrestamos(prestamosEnriquecidos);
      }
    } catch (err) {
      setError('Error al cargar tus préstamos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Cargar préstamos al montar el componente
  useEffect(() => {
    fetchPrestamos();
  }, []);

  /**
   * Maneja la devolución de un libro
   * @param {Object} prestamo - Préstamo a devolver
   */
  const handleDevolucion = async (prestamo) => {
    const titulo = prestamo.titulo || `Libro #${prestamo.libro_id}`;
    const confirmed = await confirm({
      title: '¿Confirmar devolución?',
      message: `Estás devolviendo "${titulo}". Se actualizará la disponibilidad del libro.`,
      confirmText: 'Devolver',
      type: 'info',
    });

    if (!confirmed) return;
    
    try {
      setDevolviendo(prestamo.id);
      await prestamosService.returnPrestamo(prestamo.id);
      notify.success('¡Libro devuelto exitosamente!');
      await fetchPrestamos();
    } catch (err) {
      notify.error('Error al devolver el libro');
    } finally {
      setDevolviendo(null);
    }
  };

  /**
   * Formatea una fecha para mostrar en español
   * @param {string} dateString - Fecha en formato ISO
   * @returns {string} Fecha formateada
   */
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'N/A';
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  /**
   * Verifica si un préstamo está vencido
   * @param {string} fechaLimite - Fecha límite del préstamo
   * @returns {boolean} true si está vencido
   */
  const isOverdue = (fechaLimite) => {
    if (!fechaLimite) return false;
    return new Date(fechaLimite) < new Date();
  };

  // Separar préstamos activos y devueltos
  const activos = prestamos.filter(p => p.estado === 'activo' || p.estado === 'active');
  const devueltos = prestamos.filter(p => p.estado !== 'activo' && p.estado !== 'active');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] flex items-center gap-2">
            <BookOpen className="text-primary-500" />
            Mis Préstamos
          </h1>
          <p className="text-sm text-[var(--text-muted)] mt-0.5">
            {!loading && `${activos.length} activo(s) · ${devueltos.length} devuelto(s)`}
          </p>
        </div>
      </div>

      {error && <ErrorMessage message={error} onRetry={fetchPrestamos} />}

      {/* Préstamos Activos */}
      <div className="glass-card rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-[var(--border-color)] flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          <h2 className="text-sm font-semibold text-[var(--text-primary)]">Préstamos Activos</h2>
          {!loading && <span className="text-xs text-[var(--text-muted)] bg-[var(--primary-light)] px-2 py-0.5 rounded-full">{activos.length}</span>}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[var(--bg-base)]/50 text-xs uppercase text-[var(--text-muted)] border-b border-[var(--border-color)]">
              <tr>
                <th className="px-6 py-3.5 font-semibold">Libro</th>
                <th className="px-6 py-3.5 font-semibold hidden sm:table-cell">F. Préstamo</th>
                <th className="px-6 py-3.5 font-semibold hidden sm:table-cell">F. Límite</th>
                <th className="px-6 py-3.5 font-semibold">Estado</th>
                {isAdmin && <th className="px-6 py-3.5 font-semibold text-right">Acciones</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)]">
              {loading ? (
                <tr>
                  <td colSpan={isAdmin ? 5 : 4} className="p-0">
                    <TableSkeleton rows={3} cols={isAdmin ? 5 : 4} />
                  </td>
                </tr>
              ) : activos.length === 0 ? (
                <tr>
                  <td colSpan={isAdmin ? 5 : 4} className="p-0">
                    <EmptyState
                      title="Sin préstamos activos"
                      description="No tienes ningún libro prestado actualmente."
                      iconType="loans"
                    />
                  </td>
                </tr>
              ) : (
                activos.map((prestamo) => {
                  const titulo = prestamo.titulo || `Libro #${prestamo.libro_id}`;
                  const overdue = isOverdue(prestamo.fecha_limite);

                  return (
                    <tr key={prestamo.id} className="table-row-hover">
                      <td className="px-6 py-4">
                        <span className="font-semibold text-[var(--text-primary)]">{titulo}</span>
                      </td>
                      <td className="px-6 py-4 hidden sm:table-cell">
                        <div className="flex items-center gap-1.5 text-[var(--text-muted)]">
                          <Calendar size={14} />
                          {formatDate(prestamo.fecha_prestamo)}
                        </div>
                      </td>
                      <td className="px-6 py-4 hidden sm:table-cell">
                        <div className={`flex items-center gap-1.5 ${overdue ? 'text-red-500' : 'text-[var(--text-muted)]'}`}>
                          {overdue ? <AlertTriangle size={14} /> : <Calendar size={14} />}
                          {formatDate(prestamo.fecha_limite)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`badge ${overdue ? 'badge-danger' : 'badge-warning'}`}>
                          {overdue ? 'Vencido' : 'Activo'}
                        </span>
                      </td>
                      {isAdmin && (
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => handleDevolucion(prestamo)}
                            disabled={devolviendo === prestamo.id}
                            className="btn btn-primary text-xs py-2 px-4"
                          >
                            {devolviendo === prestamo.id ? 'Procesando...' : 'Devolver'}
                          </button>
                        </td>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Historial de devueltos */}
      {!loading && devueltos.length > 0 && (
        <div className="glass-card rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-[var(--border-color)] flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <h2 className="text-sm font-semibold text-[var(--text-primary)]">Historial de Devoluciones</h2>
            <span className="text-xs text-[var(--text-muted)] bg-[var(--primary-light)] px-2 py-0.5 rounded-full">{devueltos.length}</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[var(--bg-base)]/50 text-xs uppercase text-[var(--text-muted)] border-b border-[var(--border-color)]">
                <tr>
                  <th className="px-6 py-3.5 font-semibold">Libro</th>
                  <th className="px-6 py-3.5 font-semibold hidden sm:table-cell">F. Préstamo</th>
                  <th className="px-6 py-3.5 font-semibold hidden sm:table-cell">F. Devolución</th>
                  <th className="px-6 py-3.5 font-semibold">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-color)]">
                {devueltos.map((prestamo) => {
                  const titulo = prestamo.titulo || `Libro #${prestamo.libro_id}`;
                  return (
                    <tr key={prestamo.id} className="table-row-hover">
                      <td className="px-6 py-4">
                        <span className="font-semibold text-[var(--text-primary)]">{titulo}</span>
                      </td>
                      <td className="px-6 py-4 hidden sm:table-cell text-[var(--text-muted)]">
                        {formatDate(prestamo.fecha_prestamo)}
                      </td>
                      <td className="px-6 py-4 hidden sm:table-cell text-[var(--text-muted)]">
                        {formatDate(prestamo.fecha_devolucion || prestamo.fecha_limite)}
                      </td>
                      <td className="px-6 py-4">
                        <span className="badge badge-success">Devuelto</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
