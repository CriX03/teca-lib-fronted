import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LoadingSpinner } from './ui/LoadingSpinner';

export const ProtectedRoute = () => {
  const { token, loading } = useAuth();
  const tokenFromStorage = localStorage.getItem('token');

  if (loading) {
    return <LoadingSpinner variant="page" text="Verificando sesión..." />;
  }

  if (!token && !tokenFromStorage) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
