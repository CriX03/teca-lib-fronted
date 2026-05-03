/**
 * ReportesDashboard.jsx - Dashboard de reportes y estadísticas
 * 
 * Este componente muestra un panel de control con métricas y estadísticas
 * de la biblioteca. Solo es accesible para usuarios con rol de administrador.
 * 
 * Reportes incluidos:
 * - Libros más prestados: Top 10 libros con más préstamos
 * - Préstamos por usuario: Usuarios con más préstamos activos
 * - Préstamos con retraso: Lista de préstamos vencidos sin devolver
 * 
 * @author Teca Biblioteca
 * @version 1.0.0
 */

import { useState, useEffect } from 'react';
import { reportesService } from '../../services/reportesService';
import { BookOpen, Users, AlertTriangle, BarChart3, RefreshCw, CheckCircle } from 'lucide-react';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { ErrorPage } from '../../components/ui/ErrorMessage';
import { EmptyState } from '../../components/ui/EmptyState';
import { notify } from '../../utils/notify';

/**
 * Componente del dashboard de reportes
 * @returns {JSX.Element} Dashboard de reportes
 */
export const ReportesDashboard = () => {
  // Estado de los datos
  const [librosMasPrestados, setLibrosMasPrestados] = useState([]);
  const [prestamosPorUsuario, setPrestamosPorUsuario] = useState([]);
  const [retrasos, setRetrasos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const limit = 10; // Límite de resultados por reporte

  /**
   * Carga todos los reportes desde el servidor
   */
  const fetchReportes = async () => {
    setLoading(true);
    setError('');
    try {
      // Cargar los tres reportes en paralelo
      const [resLibros, resUsuarios, resRetrasos] = await Promise.all([
        reportesService.getLibrosMasPrestados(limit),
        reportesService.getPrestamosPorUsuario(limit),
        reportesService.getRetrasos(limit)
      ]);

      if (resLibros.success) setLibrosMasPrestados(resLibros.data?.items || resLibros.data || []);
      if (resUsuarios.success) setPrestamosPorUsuario(resUsuarios.data?.items || resUsuarios.data || []);
      if (resRetrasos.success) setRetrasos(resRetrasos.data?.items || resRetrasos.data || []);
    } catch (err) {
      setError('Error al cargar los reportes. Por favor intente más tarde.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Cargar reportes al montar el componente
  useEffect(() => {
    fetchReportes();
  }, []);

  // Mostrar spinner de carga
  if (loading) {
    return <LoadingSpinner variant="page" text="Cargando reportes..." />;
  }

  // Mostrar página de error
  if (error) {
    return <ErrorPage title="Error en Reportes" message={error} onRetry={fetchReportes} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] flex items-center gap-2">
            <BarChart3 className="text-primary-600" />
            Dashboard de Reportes
          </h1>
          <p className="text-sm text-[var(--text-muted)] mt-0.5">Vista general de métricas de la biblioteca</p>
        </div>
        <button onClick={() => { notify.info('Actualizando reportes...'); fetchReportes(); }} className="btn btn-secondary text-xs">
          <RefreshCw size={14} />
          Actualizar
        </button>
      </div>

      {/* Tarjetas de resumen */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card p-4 flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400">
            <BookOpen size={22} />
          </div>
          <div>
            <p className="text-2xl font-bold text-[var(--text-primary)]">{librosMasPrestados.length}</p>
            <p className="text-xs text-[var(--text-muted)]">Libros con préstamos</p>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <Users size={22} />
          </div>
          <div>
            <p className="text-2xl font-bold text-[var(--text-primary)]">{prestamosPorUsuario.length}</p>
            <p className="text-xs text-[var(--text-muted)]">Usuarios activos</p>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-4">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${retrasos.length > 0 ? 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400' : 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'}`}>
            {retrasos.length > 0 ? <AlertTriangle size={22} /> : <CheckCircle size={22} />}
          </div>
          <div>
            <p className="text-2xl font-bold text-[var(--text-primary)]">{retrasos.length}</p>
            <p className="text-xs text-[var(--text-muted)]">Préstamos con retraso</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Libros más prestados */}
        <div className="card">
          <div className="card-header">
            <div className="flex items-center gap-2">
              <BookOpen className="text-primary-600" size={18} />
              <h2 className="text-sm font-semibold text-[var(--text-primary)]">Libros Más Prestados</h2>
            </div>
          </div>
          <div className="p-4">
            {librosMasPrestados.length === 0 ? (
              <EmptyState
                title="Sin datos aún"
                description="El sistema sincroniza datos cada 5 minutos. Si acabas de iniciar, espera unos minutos e intenta refrescar."
                iconType="books"
              />
            ) : (
              <ul className="space-y-3">
                {librosMasPrestados.map((item, index) => (
                  <li key={item.libro_id || index} className="flex items-center gap-3 p-2 rounded-lg hover:bg-[var(--bg-base)]/50 transition-colors">
                    <span className={`flex items-center justify-center w-7 h-7 rounded-lg text-xs font-bold ${
                      index === 0 ? 'bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-400' :
                      index === 1 ? 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300' :
                      index === 2 ? 'bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-400' :
                      'bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                    }`}>
                      {index + 1}
                    </span>
                    <span className="text-sm font-medium text-[var(--text-primary)] truncate flex-1" title={item.titulo}>
                      {item.titulo}
                    </span>
                    <span className="text-xs font-bold text-[var(--text-primary)] bg-[var(--bg-base)] dark:bg-gray-700 px-2.5 py-1 rounded-lg">
                      {item.total_prestamos}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Préstamos por usuario */}
        <div className="card">
          <div className="card-header">
            <div className="flex items-center gap-2">
              <Users className="text-emerald-600" size={18} />
              <h2 className="text-sm font-semibold text-[var(--text-primary)]">Préstamos por Usuario</h2>
            </div>
          </div>
          <div className="p-4">
            {prestamosPorUsuario.length === 0 ? (
              <EmptyState
                title="Sin datos aún"
                description="El sistema sincroniza datos cada 5 minutos. Intenta refrescar en unos minutos."
                iconType="users"
              />
            ) : (
              <ul className="space-y-4">
                {prestamosPorUsuario.map((item, index) => {
                  const maxValue = prestamosPorUsuario[0]?.total_prestamos || 1;
                  const percentage = Math.min(100, (item.total_prestamos / maxValue) * 100);
                  
                  return (
                    <li key={item.usuario_id || index} className="space-y-1.5">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-[var(--text-primary)] truncate pr-2" title={item.nombre_usuario || item.email}>
                          {item.nombre_usuario || item.email || `Usuario #${item.usuario_id}`}
                        </span>
                        <span className="text-xs font-bold text-[var(--text-primary)] whitespace-nowrap">
                          {item.total_prestamos}
                        </span>
                      </div>
                      <div className="w-full bg-[var(--bg-base)] dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-emerald-500 h-2 rounded-full transition-all duration-700 ease-out"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>

        {/* Retrasos */}
        <div className="card">
          <div className="card-header bg-red-50/50">
            <div className="flex items-center gap-2">
              <AlertTriangle className="text-red-500" size={18} />
              <h2 className="text-sm font-semibold text-[var(--text-primary)]">Préstamos con Retraso</h2>
            </div>
            {retrasos.length > 0 && (
              <span className="badge badge-danger text-[10px]">{retrasos.length}</span>
            )}
          </div>
          <div className="p-4">
{retrasos.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mb-3">
                  <CheckCircle size={28} />
                </div>
                <p className="text-sm font-semibold text-[var(--text-primary)]">¡Todo al día!</p>
                <p className="text-xs text-[var(--text-muted)] mt-1">No hay préstamos con retraso</p>
              </div>
            ) : (
              <ul className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                {retrasos.map((item, index) => {
                  const diasRetraso = item.dias_retraso || Math.ceil((new Date() - new Date(item.fecha_devolucion_esperada)) / (1000 * 60 * 60 * 24));
                  return (
                    <li key={item.prestamo_id || index} className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-xl">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-sm font-semibold text-[var(--text-primary)] truncate pr-2" title={item.titulo_libro}>
                          {item.titulo_libro || `Libro #${item.libro_id}`}
                        </span>
                        <span className="badge badge-danger text-[10px] whitespace-nowrap">
                          {diasRetraso} días
                        </span>
                      </div>
                      <div className="text-xs text-[var(--text-secondary)] dark:text-gray-400 space-y-0.5">
                        <p className="truncate">
                          <span className="text-[var(--text-muted)]">Usuario:</span>{' '}
                          {item.nombre_usuario || item.usuario_email || `ID: ${item.usuario_id}`}
                        </p>
                        <p>
                          <span className="text-[var(--text-muted)]">Vencimiento:</span>{' '}
                          {new Date(item.fecha_devolucion_esperada).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
