/**
 * AppRouter.jsx - Configuración de rutas de la aplicación
 * 
 * Este archivo define toda la estructura de rutas de la aplicación usando
 * React Router DOM. Establece la jerarquía de layouts, rutas públicas,
 * rutas protegidas y rutas exclusivas de administrador.
 * 
 * Estructura de rutas:
 * - Rutas públicas (AuthLayout): /login, /registro
 * - Rutas protegidas (DashboardLayout): /dashboard, /catalogo, /prestamos
 * - Rutas admin: /prestamos/admin, /reportes
 * - Catch-all: Redirige cualquier ruta no encontrada a /dashboard
 * 
 * @author Teca Biblioteca
 * @version 1.0.0
 */

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
import { AdminPrestamos } from '../pages/prestamos/AdminPrestamos';
import { ReportesDashboard } from '../pages/reportes/ReportesDashboard';

/**
 * Componente principal de enrutamiento
 * Configura todas las rutas de la aplicación con sus respectivos layouts
 * y protecciones
 * 
 * @returns {JSX.Element} Componente de enrutamiento
 */
export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas - Layout de autenticación */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Register />} />
        </Route>

        {/* Rutas protegidas - Requieren autenticación */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            {/* Dashboard principal */}
            <Route path="/dashboard" element={<Dashboard />} />
            
            {/* Catálogo de libros */}
            <Route path="/catalogo" element={<Catalogo />} />
            <Route path="/catalogo/nuevo" element={<LibroForm />} />
            <Route path="/catalogo/editar/:id" element={<LibroForm />} />
            <Route path="/catalogo/autores" element={<Autores />} />
            <Route path="/catalogo/editoriales" element={<Editoriales />} />
            <Route path="/catalogo/categorias" element={<Categorias />} />
            
            {/* Préstamos de usuario */}
            <Route path="/prestamos" element={<MisPrestamos />} />
            
            {/* Rutas exclusivas de administrador */}
            <Route element={<AdminRoute />}>
              <Route path="/prestamos/admin" element={<AdminPrestamos />} />
              <Route path="/reportes" element={<ReportesDashboard />} />
            </Route>
          </Route>
        </Route>

        {/* Ruta catch-all - Redirige cualquier ruta no encontrada al dashboard */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
};
