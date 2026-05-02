/**
 * Login.jsx - Página de inicio de sesión
 * 
 * Este componente renderiza el formulario de inicio de sesión donde los
 * usuarios registrados pueden autenticarse para acceder al sistema.
 * Valida las credenciales y maneja los estados de error y carga.
 * 
 * @author Teca Biblioteca
 * @version 1.0.0
 */

import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, Eye, EyeOff } from 'lucide-react';
import { notify } from '../utils/notify';

/**
 * Componente de formulario de inicio de sesión
 * @returns {JSX.Element} Formulario de login
 */
export const Login = () => {
  const [email, setEmail] = useState('');              // Email del usuario
  const [password, setPassword] = useState('');       // Contraseña del usuario
  const [showPassword, setShowPassword] = useState(false); // Mostrar/ocultar contraseña
  const [error, setError] = useState('');             // Mensaje de error
  const [isLoading, setIsLoading] = useState(false);  // Estado de carga
  
  const { login } = useAuth();                         // Función de login del contexto
  const navigate = useNavigate();                      // Navegación programática

  /**
   * Maneja el envío del formulario de login
   * @param {React.FormEvent} e - Evento del formulario
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await login({ email, contrasena: password });
      if (!res.success) {
        setError(res.error?.message || 'Credenciales inválidas');
      } else {
        notify.success('¡Bienvenido de vuelta!');
        navigate('/dashboard');
      }
    } catch (_err) {
      setError('Error inesperado al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      {/* Mensaje de error */}
      {error && (
        <div className="flex items-start gap-3 rounded-lg bg-red-50 p-3.5 border border-red-100 animate-slide-down">
          <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-red-600 text-xs font-bold">!</span>
          </div>
          <p className="text-sm text-red-700 font-medium">{error}</p>
        </div>
      )}

      {/* Campo de email */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="login-email">
          Correo electrónico
        </label>
        <input
          id="login-email"
          type="email"
          required
          placeholder="tu@email.com"
          className="input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      {/* Campo de contraseña con toggle de visibilidad */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="login-password">
          Contraseña
        </label>
        <div className="relative">
          <input
            id="login-password"
            type={showPassword ? 'text' : 'password'}
            required
            placeholder="••••••••"
            className="input pr-10"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      {/* Botón deSubmit */}
      <button
        type="submit"
        disabled={isLoading}
        className="btn btn-primary w-full py-2.5"
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Iniciando sesión...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <LogIn size={18} />
            Iniciar Sesión
          </span>
        )}
      </button>

      {/* Enlace a registro */}
      <div className="text-center text-sm text-gray-500 pt-2">
        ¿No tienes cuenta?{' '}
        <Link to="/registro" className="text-primary-600 hover:text-primary-500 font-semibold transition-colors">
          Regístrate
        </Link>
      </div>
    </form>
  );
};
