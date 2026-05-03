import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../context/ThemeContext';
import { Library, Sun, Moon } from 'lucide-react';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

export const AuthLayout = () => {
  const { token, loading } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();

  if (loading) {
    return <LoadingSpinner variant="page" text="Verificando sesión..." />;
  }

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="flex min-h-screen bg-gradient-mesh transition-all duration-500">
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/4 w-48 h-48 bg-primary-400/8 rounded-full blur-2xl animate-pulse-glow" />
        </div>
        
        <div className="relative z-10 flex flex-col justify-center items-start px-12 xl:px-20 text-white">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/20">
              <Library size={32} className="text-white" />
            </div>
            <span className="text-3xl font-bold tracking-tight">Teca Biblioteca</span>
          </div>
          
          <h1 className="text-5xl font-bold leading-tight mb-5">
            Gestiona tu biblioteca<br />
            <span className="text-primary-300">de forma inteligente</span>
          </h1>
          <p className="text-primary-100/80 text-xl max-w-lg leading-relaxed">
            Administra catálogos, préstamos y usuarios desde una plataforma centralizada y fácil de usar.
          </p>

          <div className="mt-12 space-y-5">
            {[
              'Catálogo completo de libros',
              'Gestión de préstamos en tiempo real',
              'Reportes y estadísticas',
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-4 text-primary-100/80">
                <div className="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center flex-shrink-0 border border-white/20">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-lg font-medium">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center items-center py-10 px-4 sm:px-8 lg:px-12">
        <div className="w-full max-w-md space-y-8 animate-slide-up">
          <button
            onClick={toggleTheme}
            className="absolute top-4 right-4 p-2.5 rounded-xl glass-button transition-all duration-200 hover:scale-105"
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? (
              <Sun size={20} className="text-amber-400" />
            ) : (
              <Moon size={20} className="text-slate-600" />
            )}
          </button>

          <div className="text-center lg:hidden">
            <div className="flex items-center justify-center gap-2.5 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg shadow-primary-500/25">
                <Library size={26} className="text-white" />
              </div>
              <span className="text-2xl font-bold text-white">Teca Biblioteca</span>
            </div>
          </div>

          <div className="hidden lg:block text-left">
            <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-2">Bienvenido de vuelta</h2>
            <p className="text-[var(--text-secondary)] text-base">
              Ingresa tus credenciales para continuar
            </p>
          </div>

          <div className="glass-card rounded-2xl p-8 lg:p-10">
            <Outlet />
          </div>

          <p className="text-center text-sm text-[var(--text-muted)]">
            © {new Date().getFullYear()} Teca Biblioteca. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </div>
  );
};