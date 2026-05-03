import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Eye, EyeOff, CheckCircle, Loader2 } from 'lucide-react';
import { notify } from '../utils/notify';

export const Register = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    contrasena: '',
    rol: 'estudiante'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setIsLoading(true);

    try {
      const res = await register(formData);
      if (res.success) {
        setSuccess(true);
        notify.success('¡Registro exitoso! Redirigiendo al login...');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setError(res.error?.message || 'Error al registrar el usuario');
      }
    } catch (_err) {
      setError('Error inesperado durante el registro');
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
      
      {success && (
        <div className="flex items-start gap-3 rounded-xl bg-emerald-500/10 p-4 border border-emerald-500/20 animate-slide-down">
          <CheckCircle size={18} className="text-emerald-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-emerald-400 font-medium">
            ¡Registro exitoso! Redirigiendo al login...
          </p>
        </div>
      )}
      
      <div>
        <label className="block text-sm font-semibold mb-2" htmlFor="reg-nombre">
          Nombre Completo
        </label>
        <input
          id="reg-nombre"
          name="nombre"
          type="text"
          required
          placeholder="Juan Pérez"
          className="input"
          value={formData.nombre}
          onChange={handleChange}
          autoComplete="name"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2" htmlFor="reg-email">
          Correo electrónico
        </label>
        <input
          id="reg-email"
          name="email"
          type="email"
          required
          placeholder="tu@email.com"
          className="input"
          value={formData.email}
          onChange={handleChange}
          autoComplete="email"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2" htmlFor="reg-contrasena">
          Contraseña
        </label>
        <div className="relative">
          <input
            id="reg-contrasena"
            name="contrasena"
            type={showPassword ? 'text' : 'password'}
            required
            minLength={6}
            placeholder="Mínimo 6 caracteres"
            className="input pr-12"
            value={formData.contrasena}
            onChange={handleChange}
            autoComplete="new-password"
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

      <div>
        <label className="block text-sm font-semibold mb-2" htmlFor="reg-rol">
          Rol
        </label>
        <select
          id="reg-rol"
          name="rol"
          required
          className="select"
          value={formData.rol}
          onChange={handleChange}
        >
          <option value="estudiante">Estudiante</option>
          <option value="docente">Docente</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={isLoading || success}
        className="btn btn-primary w-full py-3"
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <Loader2 size={18} className="animate-spin" />
            Registrando...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <UserPlus size={18} />
            Crear cuenta
          </span>
        )}
      </button>
      
      <div className="text-center text-[var(--text-secondary)] pt-2">
        ¿Ya tienes cuenta?{' '}
        <Link to="/login" className="text-primary-500 hover:text-primary-400 font-semibold transition-colors">
          Inicia sesión
        </Link>
      </div>
    </form>
  );
};