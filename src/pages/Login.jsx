import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, Eye, EyeOff, Loader2 } from 'lucide-react';
import { notify } from '../utils/notify';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

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
      {error && (
        <div className="flex items-start gap-3 rounded-xl bg-red-500/10 p-4 border border-red-500/20 animate-slide-down">
          <div className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-red-500 text-xs font-bold">!</span>
          </div>
          <p className="text-sm text-red-400 font-medium">{error}</p>
        </div>
      )}

      <div>
        <label className="block text-sm font-semibold mb-2" htmlFor="login-email">
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
          autoComplete="email"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2" htmlFor="login-password">
          Contraseña
        </label>
        <div className="relative">
          <input
            id="login-password"
            type={showPassword ? 'text' : 'password'}
            required
            placeholder="••••••••"
            className="input pr-12"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors rounded-lg hover:bg-[var(--primary-light)]"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="btn btn-primary w-full py-3"
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <Loader2 size={18} className="animate-spin" />
            Iniciando sesión...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <LogIn size={18} />
            Iniciar Sesión
          </span>
        )}
      </button>

      <div className="text-center text-[var(--text-secondary)] pt-2">
        ¿No tienes cuenta?{' '}
        <Link to="/registro" className="text-primary-500 hover:text-primary-400 font-semibold transition-colors">
          Regístrate
        </Link>
      </div>
    </form>
  );
};