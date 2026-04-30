import { useState, useEffect } from 'react';
import { reportesService } from '../../services/reportesService';
import { BookOpen, Users, AlertTriangle, BarChart3, RefreshCw, CheckCircle } from 'lucide-react';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { ErrorPage } from '../../components/ui/ErrorMessage';
import { EmptyState } from '../../components/ui/EmptyState';
import { notify } from '../../utils/notify';

export const ReportesDashboard = () => {
  const [librosMasPrestados, setLibrosMasPrestados] = useState([]);
  const [prestamosPorUsuario, setPrestamosPorUsuario] = useState([]);
  const [retrasos, setRetrasos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchReportes = async () => {
    setLoading(true);
    setError('');
    try {
      const [resLibros, resUsuarios, resRetrasos] = await Promise.all([
        reportesService.getLibrosMasPrestados(),
        reportesService.getPrestamosPorUsuario(),
        reportesService.getRetrasos()
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

  useEffect(() => {
    fetchReportes();
  }, []);

  if (loading) {
    return <LoadingSpinner variant="page" text="Cargando reportes..." />;
  }

  if (error) {
    return <ErrorPage title="Error en Reportes" message={error} onRetry={fetchReportes} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <BarChart3 className="text-primary-600" />
            Dashboard de Reportes
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">Vista general de métricas de la biblioteca</p>
        </div>
        <button onClick={() => { notify.info('Actualizando reportes...'); fetchReportes(); }} className="btn btn-secondary text-xs">
          <RefreshCw size={14} />
          Actualizar
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card p-4 flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center text-primary-600">
            <BookOpen size={22} />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{librosMasPrestados.length}</p>
            <p className="text-xs text-gray-500">Libros con préstamos</p>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <Users size={22} />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{prestamosPorUsuario.length}</p>
            <p className="text-xs text-gray-500">Usuarios activos</p>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-4">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${retrasos.length > 0 ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
            {retrasos.length > 0 ? <AlertTriangle size={22} /> : <CheckCircle size={22} />}
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{retrasos.length}</p>
            <p className="text-xs text-gray-500">Préstamos con retraso</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Libros más prestados */}
        <div className="card">
          <div className="card-header">
            <div className="flex items-center gap-2">
              <BookOpen className="text-primary-600" size={18} />
              <h2 className="text-sm font-semibold text-gray-900">Libros Más Prestados</h2>
            </div>
          </div>
          <div className="p-4">
            {librosMasPrestados.length === 0 ? (
              <EmptyState
                title="Sin datos"
                description="No hay datos suficientes de préstamos."
                iconType="books"
              />
            ) : (
              <ul className="space-y-3">
                {librosMasPrestados.map((item, index) => (
                  <li key={item.libro_id || index} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                    <span className={`flex items-center justify-center w-7 h-7 rounded-lg text-xs font-bold ${
                      index === 0 ? 'bg-amber-100 text-amber-700' :
                      index === 1 ? 'bg-gray-100 text-gray-600' :
                      index === 2 ? 'bg-orange-100 text-orange-700' :
                      'bg-gray-50 text-gray-500'
                    }`}>
                      {index + 1}
                    </span>
                    <span className="text-sm font-medium text-gray-700 truncate flex-1" title={item.titulo}>
                      {item.titulo}
                    </span>
                    <span className="text-xs font-bold text-gray-900 bg-gray-100 px-2.5 py-1 rounded-lg">
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
              <h2 className="text-sm font-semibold text-gray-900">Préstamos por Usuario</h2>
            </div>
          </div>
          <div className="p-4">
            {prestamosPorUsuario.length === 0 ? (
              <EmptyState
                title="Sin datos"
                description="No hay datos suficientes de usuarios."
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
                        <span className="font-medium text-gray-700 truncate pr-2" title={item.nombre_usuario || item.email}>
                          {item.nombre_usuario || item.email || `Usuario #${item.usuario_id}`}
                        </span>
                        <span className="text-xs font-bold text-gray-900 whitespace-nowrap">
                          {item.total_prestamos}
                        </span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
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
              <h2 className="text-sm font-semibold text-gray-900">Préstamos con Retraso</h2>
            </div>
            {retrasos.length > 0 && (
              <span className="badge badge-danger text-[10px]">{retrasos.length}</span>
            )}
          </div>
          <div className="p-4">
            {retrasos.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-3">
                  <CheckCircle size={28} />
                </div>
                <p className="text-sm font-semibold text-gray-800">¡Todo al día!</p>
                <p className="text-xs text-gray-500 mt-1">No hay préstamos con retraso</p>
              </div>
            ) : (
              <ul className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                {retrasos.map((item, index) => {
                  const diasRetraso = item.dias_retraso || Math.ceil((new Date() - new Date(item.fecha_devolucion_esperada)) / (1000 * 60 * 60 * 24));
                  return (
                    <li key={item.prestamo_id || index} className="p-3 bg-red-50 border border-red-100 rounded-xl">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-sm font-semibold text-gray-900 truncate pr-2" title={item.titulo_libro}>
                          {item.titulo_libro || `Libro #${item.libro_id}`}
                        </span>
                        <span className="badge badge-danger text-[10px] whitespace-nowrap">
                          {diasRetraso} días
                        </span>
                      </div>
                      <div className="text-xs text-gray-600 space-y-0.5">
                        <p className="truncate">
                          <span className="text-gray-400">Usuario:</span>{' '}
                          {item.nombre_usuario || item.usuario_email || `ID: ${item.usuario_id}`}
                        </p>
                        <p>
                          <span className="text-gray-400">Vencimiento:</span>{' '}
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
