/**
 * main.jsx - Punto de entrada principal de la aplicación React
 * 
 * Este archivo configura y monta la aplicación en el DOM. Es el primer punto
 * de ejecución cuando se carga la página web.
 * 
 * Componentes providers:
 * - StrictMode: Modo de desarrollo de React para detectar problemas potenciales
 * - AuthProvider: Proveedor de contexto de autenticación global
 * - ConfirmProvider: Proveedor para diálogos de confirmación
 * - AppRouter: Componente de enrutamiento principal
 * - Toaster: Componente para mostrar notificaciones toast
 * 
 * @author Teca Biblioteca
 * @version 1.0.0
 */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Toaster } from 'react-hot-toast';
import './index.css';
import { AppRouter } from './routes/AppRouter';
import { AuthProvider } from './context/AuthContext';
import { ConfirmProvider } from './components/ui/ConfirmDialog';
import { ThemeProvider } from './context/ThemeContext';

/**
 * Monta la aplicación React en el elemento con id="root" del HTML
 * y envuelve todos los componentes providers necesarios para el funcionamiento
 */
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <ConfirmProvider>
          <AppRouter />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
            }}
            containerStyle={{
              top: 20,
              right: 20,
            }}
          />
        </ConfirmProvider>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>
);
