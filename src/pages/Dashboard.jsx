import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Book, Bookmark, TrendingUp, ArrowRight, Clock, Loader2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { catalogoService } from '../services/catalogoService';
import { prestamosService } from '../services/prestamosService';

export const Dashboard = () => {
  const { user } = useAuth();
  
  const [stats, setStats] = useState({ 
    libros: null,
    prestamosActivos: null,
    prestamosTotal: null
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [librosRes, prestamosRes] = await Promise.allSettled([
          catalogoService.getLibros({ per_page: 1 }),
          prestamosService.getMisPrestamos(),
        ]);

        const librosData = librosRes.status === 'fulfilled' 
          ? (librosRes.value?.data?.pagination?.total ?? '—')
          : '—';
        
        let activos = '—';
        let total = '—';
        if (prestamosRes.status === 'fulfilled') {
          const prestamos = prestamosRes.value?.data?.items || prestamosRes.value?.data || [];
          if (Array.isArray(prestamos)) {
            total = prestamos.length;
            activos = prestamos.filter(p => p.estado === 'activo').length;
          }
        }

        setStats({ libros: librosData, prestamosActivos: activos, prestamosTotal: total });
      } catch {
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
      color: 'from-blue-500 to-blue-600',
      textColor: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      link: '/catalogo',
      linkLabel: 'Ver catálogo',
    },
    { 
      label: 'Préstamos Activos', 
      value: stats.prestamosActivos, 
      icon: Bookmark, 
      color: 'from-emerald-500 to-emerald-600',
      textColor: 'text-emerald-500',
      bgColor: 'bg-emerald-500/10',
      link: '/prestamos',
      linkLabel: 'Ver préstamos',
    },
    { 
      label: 'Total de Préstamos', 
      value: stats.prestamosTotal, 
      icon: TrendingUp, 
      color: 'from-violet-500 to-violet-600',
      textColor: 'text-violet-500',
      bgColor: 'bg-violet-500/10',
      link: '/prestamos',
      linkLabel: 'Ver historial',
    },
  ];

  const quickActions = [
    { 
      to: '/catalogo',
      icon: Book, 
      title: 'Explorar Catálogo',
      desc: 'Buscar y gestionar libros',
      color: 'from-blue-500/20 to-blue-600/10',
      iconColor: 'text-blue-500',
      borderColor: 'border-blue-500/20'
    },
    { 
      to: '/prestamos',
      icon: Bookmark, 
      title: 'Mis Préstamos',
      desc: 'Revisar y devolver libros',
      color: 'from-emerald-500/20 to-emerald-600/10',
      iconColor: 'text-emerald-500',
      borderColor: 'border-emerald-500/20'
    },
    { 
      to: user?.rol === 'admin' ? '/catalogo/nuevo' : '/catalogo',
      icon: TrendingUp, 
      title: user?.rol === 'admin' ? 'Registrar Libro' : 'Ver Catálogo',
      desc: user?.rol === 'admin' ? 'Agregar al catálogo' : 'Explorar colección',
      color: 'from-violet-500/20 to-violet-600/10',
      iconColor: 'text-violet-500',
      borderColor: 'border-violet-500/20'
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">
          ¡Hola, {user?.nombre?.split(' ')[0] || 'Usuario'}! 👋
        </h1>
        <p className="text-[var(--text-secondary)]">
          Aquí tienes un resumen de la actividad de la biblioteca.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="glass-card rounded-2xl p-5 animate-pulse">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl skeleton" />
                <div className="w-16 h-8 skeleton" />
              </div>
              <div className="w-24 h-4 skeleton" />
            </div>
          ))
        ) : (
          cards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div 
                key={card.label} 
                className="glass-card rounded-2xl overflow-hidden group hover:-translate-y-1"
                style={{ animationDelay: `${idx * 80}ms` }}
              >
                <div className="p-5">
                  <div className="flex items-center justify-between">
                    <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center shadow-lg`}>
                      <Icon size={22} className="text-white" />
                    </div>
                    <span className="text-4xl font-bold text-[var(--text-primary)]">{card.value ?? '—'}</span>
                  </div>
                  <p className="mt-4 text-sm font-semibold text-[var(--text-secondary)]">{card.label}</p>
                </div>
                <Link 
                  to={card.link}
                  className="flex items-center justify-between px-5 py-3.5 bg-[var(--bg-base)]/50 border-t border-[var(--border-color)] text-sm font-semibold text-[var(--text-secondary)] hover:text-primary-500 hover:bg-[var(--primary-light)] transition-colors"
                >
                  {card.linkLabel}
                  <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            );
          })
        )}
      </div>

      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-[var(--border-color)] flex items-center gap-2">
          <Clock size={18} className="text-[var(--text-muted)]" />
          <h2 className="text-base font-semibold text-[var(--text-primary)]">Acceso rápido</h2>
        </div>
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {quickActions.map((action, idx) => {
            const Icon = action.icon;
            return (
              <Link 
                key={idx}
                to={action.to}
                className="flex items-center gap-4 p-4 rounded-xl border border-[var(--border-color)] hover:border-primary-500/30 hover:bg-[var(--primary-light)]/50 transition-all duration-200 group"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center ${action.iconColor} group-hover:scale-105 transition-transform`}>
                  <Icon size={22} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[var(--text-primary)]">{action.title}</p>
                  <p className="text-xs text-[var(--text-muted)]">{action.desc}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};