import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthLayout } from '../layouts/AuthLayout';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { AdminRoute } from '../components/AdminRoute';
import { Login } from '../pages/Login';
import { Register } from '../pages/Register';
import { Dashboard } from '../pages/Dashboard';
import { Catalogo } from '../pages/catalogo/Catalogo';
import { LibroForm } from '../pages/catalogo/LibroForm';
import { Autores } from '../pages/catalogo/Autores';
import { Editoriales } from '../pages/catalogo/Editoriales';
import { Categorias } from '../pages/catalogo/Categorias';
import { MisPrestamos } from '../pages/prestamos/MisPrestamos';
import { ReportesDashboard } from '../pages/reportes/ReportesDashboard';

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Register />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/catalogo" element={<Catalogo />} />
            <Route path="/catalogo/nuevo" element={<LibroForm />} />
            <Route path="/catalogo/editar/:id" element={<LibroForm />} />
            <Route path="/catalogo/autores" element={<Autores />} />
            <Route path="/catalogo/editoriales" element={<Editoriales />} />
            <Route path="/catalogo/categorias" element={<Categorias />} />
            <Route path="/prestamos" element={<MisPrestamos />} />
            
            <Route element={<AdminRoute />}>
              <Route path="/reportes" element={<ReportesDashboard />} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
};
