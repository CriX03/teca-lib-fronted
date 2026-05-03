import { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../context/ThemeContext';
import { Book, LayoutDashboard, LogOut, FileText, Bookmark, Menu, X, ChevronRight, Library, Users, Sun, Moon } from 'lucide-react';
import { NotificationBell } from '../components/ui/NotificationBell';

export const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme, isDark } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Catálogo', path: '/catalogo', icon: Book },
    { name: 'Préstamos', path: '/prestamos', icon: Bookmark },
    ...(user?.rol === 'admin' ? [
      { name: 'Gestión Préstamos', path: '/prestamos/admin', icon: Users },
      { name: 'Reportes', path: '/reportes', icon: FileText },
    ] : []),
  ];

  const closeSidebar = () => setSidebarOpen(false);
  const currentSection = navItems.find(item => location.pathname.startsWith(item.path));

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-mesh">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-md lg:hidden animate-fade-in"
          onClick={closeSidebar}
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-72 flex-shrink-0 glass-card
          transform transition-transform duration-300 ease-out
          lg:relative lg:translate-x-0 lg:z-auto lg:h-screen
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex h-16 items-center justify-between px-5 border-b border-[var(--border-color)]">
          <Link to="/dashboard" className="flex items-center gap-3 group" onClick={closeSidebar}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg shadow-primary-500/25 group-hover:scale-105 transition-transform">
              <Library size={20} className="text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-[var(--text-primary)]">Teca</span>
          </Link>
          <button onClick={closeSidebar} className="lg:hidden p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--primary-light)] rounded-lg transition-all">
            <X size={20} />
          </button>
        </div>

        <nav className="flex flex-col gap-1 p-4">
          <p className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
            Menú Principal
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={closeSidebar}
                className={`
                  flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200
                  ${isActive
                    ? 'bg-gradient-to-r from-primary-500/15 to-accent-500/10 text-primary-500 border border-primary-500/20'
                    : 'text-[var(--text-secondary)] hover:bg-[var(--primary-light)] hover:text-[var(--text-primary)]'
                  }
                `}
              >
                <Icon size={18} className={isActive ? 'text-primary-500' : 'text-[var(--text-muted)]'} />
                {item.name}
                {isActive && <ChevronRight size={16} className="ml-auto text-primary-400" />}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[var(--border-color)] bg-[var(--bg-base)]/50 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center flex-shrink-0 shadow-md">
              <span className="text-sm font-bold text-white">
                {(user?.nombre || 'U')[0].toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[var(--text-primary)] truncate">{user?.nombre || 'Usuario'}</p>
              <p className="text-xs text-[var(--text-muted)] truncate">{user?.email || ''}</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex-shrink-0 p-2.5 text-[var(--text-muted)] hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all duration-200"
              title="Cerrar sesión"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-16 items-center justify-between border-b border-[var(--border-color)] glass-surface px-4 sm:px-6 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--primary-light)] rounded-xl transition-colors"
            >
              <Menu size={20} />
            </button>
            <div className="hidden sm:flex items-center gap-2 text-sm">
              <span className="text-[var(--text-muted)]">Inicio</span>
              {currentSection && (
                <>
                  <ChevronRight size={14} className="text-[var(--text-muted)]" />
                  <span className="font-semibold text-[var(--text-primary)]">{currentSection.name}</span>
                </>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--primary-light)] transition-all duration-200"
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            
            <NotificationBell />
            
            <div className="hidden lg:flex items-center gap-3">
              {user?.rol === 'admin' && (
                <span className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-primary-500/20 to-accent-500/20 text-primary-500 text-xs font-bold border border-primary-500/30">
                  Admin
                </span>
              )}
              <span className="text-sm font-semibold text-[var(--text-primary)]">
                {user?.nombre || 'Usuario'}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 rounded-xl text-[var(--text-muted)] hover:text-red-500 transition-all duration-200 p-2.5 hover:bg-red-500/10"
                title="Cerrar sesión"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="page-transition">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};