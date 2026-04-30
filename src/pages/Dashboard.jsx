import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Book, Bookmark, TrendingUp, ArrowRight, Clock } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { catalogoService } from '../services/catalogoService';
import { prestamosService } from '../services/prestamosService';
import { CardSkeleton } from '../components/ui/LoadingSpinner';

export const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ libros: null, prestamosActivos: null, prestamosTotal: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [librosRes, prestamosRes] = await Promise.allSettled([
          catalogoService.getLibros({ per_page: 1 }),
          prestamosService.getMisPrestamos(),
        ]);

        const librosData = librosRes.status === 'fulfilled' 
          ? (librosRes.value.data?.total || librosRes.value.total || '—')
          : '—';
        
        let activos = '—';
        let total = '—';
        if (prestamosRes.status === 'fulfilled') {
          const prestamos = prestamosRes.value.data?.data || prestamosRes.value.data || prestamosRes.value || [];
          if (Array.isArray(prestamos)) {
            total = prestamos.length;
            activos = prestamos.filter(p => p.estado === 'activo').length;
          }
        }

        setStats({ libros: librosData, prestamosActivos: activos, prestamosTotal: total });
      } catch {
        // Silently fail — cards will show "—"
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const cards = [
    { 
      label: 'Libros en Catálogo', 
      value: stats.libros, 
      icon: Book, 
      color: 'bg-blue-50 text-primary-600',
      link: '/catalogo',
      linkLabel: 'Ver catálogo',
    },
    { 
      label: 'Préstamos Activos', 
      value: stats.prestamosActivos, 
      icon: Bookmark, 
      color: 'bg-emerald-50 text-emerald-600',
      link: '/prestamos',
      linkLabel: 'Ver préstamos',
    },
    { 
      label: 'Total de Préstamos', 
      value: stats.prestamosTotal, 
      icon: TrendingUp, 
      color: 'bg-purple-50 text-purple-600',
      link: '/prestamos',
      linkLabel: 'Ver historial',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          ¡Hola, {user?.nombre?.split(' ')[0] || 'Usuario'}! 👋
        </h1>
        <p className="mt-1 text-gray-500">
          Aquí tienes un resumen de la actividad de la biblioteca.
        </p>
      </div>

      {/* Metric Cards */}
      {loading ? (
        <CardSkeleton count={3} />
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div 
                key={card.label} 
                className="card group hover:shadow-md transition-all duration-300"
                style={{ animationDelay: `${idx * 80}ms` }}
              >
                <div className="p-5">
                  <div className="flex items-center justify-between">
                    <div className={`h-11 w-11 rounded-xl ${card.color} flex items-center justify-center`}>
                      <Icon size={22} />
                    </div>
                    <span className="text-3xl font-bold text-gray-900">{card.value ?? '—'}</span>
                  </div>
                  <p className="mt-3 text-sm font-medium text-gray-500">{card.label}</p>
                </div>
                <Link 
                  to={card.link}
                  className="flex items-center justify-between px-5 py-3 bg-gray-50 text-sm font-medium text-gray-600 hover:text-primary-600 hover:bg-primary-50 transition-colors border-t border-gray-100 group"
                >
                  {card.linkLabel}
                  <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            );
          })}
        </div>
      )}

      {/* Quick actions */}
      <div className="card">
        <div className="card-header">
          <div className="flex items-center gap-2">
            <Clock size={18} className="text-gray-400" />
            <h2 className="text-base font-semibold text-gray-900">Acceso rápido</h2>
          </div>
        </div>
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <Link 
            to="/catalogo"
            className="flex items-center gap-3 p-4 rounded-xl border border-gray-100 hover:border-primary-200 hover:bg-primary-50/50 transition-all duration-200 group"
          >
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-primary-600 group-hover:bg-primary-100 transition-colors">
              <Book size={20} />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Explorar Catálogo</p>
              <p className="text-xs text-gray-500">Buscar y gestionar libros</p>
            </div>
          </Link>

          <Link 
            to="/prestamos"
            className="flex items-center gap-3 p-4 rounded-xl border border-gray-100 hover:border-emerald-200 hover:bg-emerald-50/50 transition-all duration-200 group"
          >
            <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-100 transition-colors">
              <Bookmark size={20} />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Mis Préstamos</p>
              <p className="text-xs text-gray-500">Revisar y devolver libros</p>
            </div>
          </Link>

          <Link 
            to="/catalogo/nuevo"
            className="flex items-center gap-3 p-4 rounded-xl border border-gray-100 hover:border-purple-200 hover:bg-purple-50/50 transition-all duration-200 group"
          >
            <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600 group-hover:bg-purple-100 transition-colors">
              <TrendingUp size={20} />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Registrar Libro</p>
              <p className="text-xs text-gray-500">Agregar al catálogo</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};
