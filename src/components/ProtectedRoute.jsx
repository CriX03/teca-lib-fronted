import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LoadingSpinner } from './ui/LoadingSpinner';

export const ProtectedRoute = () => {
  const { token, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner variant="page" text="Verificando sesión..." />;
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
