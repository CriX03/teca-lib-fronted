import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Toaster } from 'react-hot-toast';
import './index.css';
import { AppRouter } from './routes/AppRouter';
import { AuthProvider } from './context/AuthContext';
import { ConfirmProvider } from './components/ui/ConfirmDialog';

createRoot(document.getElementById('root')).render(
  <StrictMode>
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
  </StrictMode>
);
