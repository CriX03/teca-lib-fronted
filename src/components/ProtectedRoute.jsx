/**
 * ProtectedRoute.jsx - Componente de ruta protegida
 * 
 * Este componente protege las rutas que requieren autenticación. Si el usuario
 * no está autenticado, redirige a la página de login. Mientras verifica el
 * estado de autenticación, muestra un spinner de carga.
 * 
 * Uso típico:
 * <Route element={<ProtectedRoute />}>
 *   <Route path="/dashboard" element={<Dashboard />} />
 * </Route>
 * 
 * @author Teca Biblioteca
 * @version 1.0.0
 */

import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LoadingSpinner } from './ui/LoadingSpinner';

/**
 * Componente que envuelve rutas que requieren autenticación
 * @returns {JSX.Element} - Outlet si está autenticado, redirección si no lo está
 */
export const ProtectedRoute = () => {
  const { token, loading } = useAuth();
  const tokenFromStorage = localStorage.getItem('token');

  // Mostrar spinner mientras verifica la autenticación
  if (loading) {
    return <LoadingSpinner variant="page" text="Verificando sesión..." />;
  }

  // Redirigir a login si no hay token
  if (!token && !tokenFromStorage) {
    return <Navigate to="/login" replace />;
  }

  // Permitir acceso a las rutas anidadas
  return <Outlet />;
};
