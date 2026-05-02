/**
 * AdminRoute.jsx - Componente de ruta para administradores
 * 
 * Este componente protege las rutas que requieren privilegios de administrador.
 * Verifica con el backend si el usuario tiene rol de administrador antes de
 * permitir el acceso. Si no tiene permisos, redirige al dashboard y muestra
 * una advertencia.
 * 
 * Uso típico:
 * <Route element={<AdminRoute />}>
 *   <Route path="/reportes" element={<Reportes />} />
 * </Route>
 * 
 * @author Teca Biblioteca
 * @version 1.0.0
 */

import { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { authService } from '../services/authService';
import { useAuth } from '../hooks/useAuth';
import { LoadingSpinner } from './ui/LoadingSpinner';
import { notify } from '../utils/notify';

/**
 * Componente que verifica si el usuario es administrador
 * @returns {JSX.Element} - Outlet si es admin, redirección si no lo es
 */
export const AdminRoute = () => {
  const { loading: authLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(null);
  const [checking, setChecking] = useState(true);

  /**
   * Effect para verificar el rol de administrador
   */
  useEffect(() => {
    const verifyAdmin = async () => {
      if (authLoading) return;
      
      try {
        const res = await authService.checkAdmin();
        if (res.success) {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } catch (_error) {
        setIsAdmin(false);
      } finally {
        setChecking(false);
      }
    };

    verifyAdmin();
  }, [authLoading]);

  // Mostrar spinner mientras verifica permisos
  if (authLoading || checking) {
    return <LoadingSpinner variant="page" text="Verificando permisos..." />;
  }

  // Si no es administrador, mostrar advertencia y redirigir
  if (!isAdmin) {
    notify.warning('No tienes permisos de administrador para acceder a esta sección.');
    return <Navigate to="/dashboard" replace />;
  }

  // Permitir acceso a las rutas de administrador
  return <Outlet />;
};
