/**
 * AuthLayout.jsx - Layout para páginas de autenticación
 * 
 * Este layout se utiliza para las páginas públicas de autenticación (login y registro).
 * Presenta un diseño bipartito: en pantallas grandes muestra un panel de marca
 * (branding) a la izquierda con el nombre de la biblioteca y características,
 * mientras que a la derecha contiene el formulario. En móviles, solo muestra
 * el formulario centrado.
 * 
 * @author Teca Biblioteca
 * @version 1.0.0
 */

import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Library } from 'lucide-react';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

/**
 * Layout para páginas de autenticación
 * Redirige al dashboard si el usuario ya está autenticado
 * @returns {JSX.Element} Layout de autenticación
 */
export const AuthLayout = () => {
  const { token, loading } = useAuth();

  // Mostrar spinner mientras verifica autenticación
  if (loading) {
    return <LoadingSpinner variant="page" text="Verificando sesión..." />;
  }

  // Redirigir al dashboard si ya está autenticado
  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left Panel - Branding (solo visible en desktop) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800">
        {/* Elementos decorativos de fondo */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-10 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-primary-400/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/3 w-40 h-40 bg-white/5 rounded-full blur-2xl" />
        </div>
        
        {/* Contenido del panel de marca */}
        <div className="relative z-10 flex flex-col justify-center items-start px-16 text-white">
          {/* Logo y nombre */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Library size={28} className="text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight">Teca Biblioteca</span>
          </div>
          
          {/* Título principal */}
          <h1 className="text-4xl font-bold leading-tight mb-4">
            Gestiona tu biblioteca<br />
            <span className="text-primary-200">de forma inteligente</span>
          </h1>
          <p className="text-primary-100 text-lg max-w-md leading-relaxed">
            Administra catálogos, préstamos y usuarios desde una plataforma centralizada y fácil de usar.
          </p>

          {/* Lista de características */}
          <div className="mt-10 space-y-4">
            {[
              'Catálogo completo de libros',
              'Gestión de préstamos en tiempo real',
              'Reportes y estadísticas',
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3 text-primary-100">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-sm font-medium">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Formulario */}
      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8 animate-slide-up">
          {/* Marca móvil (solo visible en mobile) */}
          <div className="text-center lg:hidden">
            <div className="flex items-center justify-center gap-2.5 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center shadow-md">
                <Library size={22} className="text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Teca Biblioteca</span>
            </div>
          </div>

          {/* Título desktop */}
          <div className="hidden lg:block text-left">
            <h2 className="text-2xl font-bold text-gray-900">Bienvenido de vuelta</h2>
            <p className="mt-1 text-sm text-gray-500">
              Ingresa tus credenciales para continuar
            </p>
          </div>

          {/* Contenedor del formulario */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 lg:shadow-xl">
            <Outlet />
          </div>

          {/* Footer */}
          <p className="text-center text-xs text-gray-400">
            © {new Date().getFullYear()} Teca Biblioteca. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </div>
  );
};
