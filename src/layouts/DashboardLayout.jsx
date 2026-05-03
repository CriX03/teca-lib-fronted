/**
 * DashboardLayout.jsx - Layout principal del dashboard
 * 
 * Este layout envuelve todas las páginas que requieren autenticación.
 * Proporciona una barra lateral de navegación (sidebar) con menús,
 * un header con información del usuario y controles de sesión,
 * y un área de contenido principal donde se renderizan las páginas.
 * Es completamente responsive con menú lateral colapsable en móviles.
 * 
 * @author Teca Biblioteca
 * @version 1.0.0
 */

import { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Book, LayoutDashboard, LogOut, FileText, Bookmark, Menu, X, ChevronRight, Library, Users } from 'lucide-react';
import { NotificationBell } from '../components/ui/NotificationBell';

/**
 * Layout del dashboard con sidebar y header
 * @returns {JSX.Element} Layout del dashboard
 */
export const DashboardLayout = () => {
  const { user, logout } = useAuth(); // Usuario y función de logout
  const navigate = useNavigate();      // Navegación programática
  const location = useLocation();     // Ruta actual
  const [sidebarOpen, setSidebarOpen] = useState(false); // Estado del sidebar

  /**
   * Maneja el cierre de sesión
   */
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Elementos de navegación según el rol del usuario
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Catálogo', path: '/catalogo', icon: Book },
    { name: 'Préstamos', path: '/prestamos', icon: Bookmark },
    // Solo mostrar opciones de admin si el usuario es administrador
    ...(user?.rol === 'admin' ? [
      { name: 'Gestión Préstamos', path: '/prestamos/admin', icon: Users },
      { name: 'Reportes', path: '/reportes', icon: FileText },
    ] : []),
  ];

  // Cerrar sidebar
  const closeSidebar = () => setSidebarOpen(false);

  // Determinar sección actual para el breadcrumb
  const currentSection = navItems.find(item => location.pathname.startsWith(item.path));

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Overlay móvil */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden animate-fade-in"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-64 flex-shrink-0 bg-white border-r border-gray-200 
          transform transition-transform duration-300 ease-in-out
          lg:relative lg:translate-x-0 lg:z-auto
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Marca */}
        <div className="flex h-16 items-center justify-between px-5 border-b border-gray-100">
          <Link to="/dashboard" className="flex items-center gap-2.5 group" onClick={closeSidebar}>
            <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
              <Library size={18} className="text-white" />
            </div>
            <span className="text-lg font-bold text-gray-900 tracking-tight">Teca</span>
          </Link>
          <button onClick={closeSidebar} className="lg:hidden text-gray-400 hover:text-gray-600 p-1">
            <X size={20} />
          </button>
        </div>

        {/* Navegación */}
        <nav className="flex flex-col gap-1 p-4">
          <p className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
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
                  flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200
                  ${isActive
                    ? 'bg-primary-50 text-primary-700 shadow-sm shadow-primary-100'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }
                `}
              >
                <Icon size={18} className={isActive ? 'text-primary-600' : 'text-gray-400'} />
                {item.name}
                {isActive && <ChevronRight size={14} className="ml-auto text-primary-400" />}
              </Link>
            );
          })}
        </nav>

        {/* Información del usuario en el pie del sidebar */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-bold text-primary-700">
                {(user?.nombre || 'U')[0].toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{user?.nombre || 'Usuario'}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email || ''}</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex-shrink-0 p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
              title="Cerrar sesión"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Contenido principal */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header superior */}
        <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 sm:px-6 shadow-sm">
          <div className="flex items-center gap-3">
            {/* Botón de menú móvil */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Menu size={20} />
            </button>
            {/* Breadcrumb */}
            <div className="hidden sm:flex items-center gap-2 text-sm">
              <span className="text-gray-400">Inicio</span>
              {currentSection && (
                <>
                  <ChevronRight size={14} className="text-gray-300" />
                  <span className="text-gray-700 font-medium">{currentSection.name}</span>
                </>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Info de usuario móvil */}
            <div className="lg:hidden flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                <span className="text-xs font-bold text-primary-700">
                  {(user?.nombre || 'U')[0].toUpperCase()}
                </span>
              </div>
            </div>
            
            {/* Info de usuario desktop */}
            <div className="hidden lg:flex items-center gap-3">
              <NotificationBell />
              {user?.rol === 'admin' && (
                <span className="badge badge-info">Admin</span>
              )}
              <span className="text-sm font-medium text-gray-700">
                {user?.nombre || 'Usuario'}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 rounded-lg text-gray-400 hover:text-red-600 transition-all duration-200 p-2 hover:bg-red-50"
                title="Cerrar sesión"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </header>

        {/* Área de contenido */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gray-50/50">
          <div className="page-transition">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
