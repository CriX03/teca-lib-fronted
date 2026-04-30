import { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { authService } from '../services/authService';
import { useAuth } from '../hooks/useAuth';
import { LoadingSpinner } from './ui/LoadingSpinner';
import { notify } from '../utils/notify';

export const AdminRoute = () => {
  const { loading: authLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(null);
  const [checking, setChecking] = useState(true);

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

  if (authLoading || checking) {
    return <LoadingSpinner variant="page" text="Verificando permisos..." />;
  }

  if (!isAdmin) {
    notify.warning('No tienes permisos de administrador para acceder a esta sección.');
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};
