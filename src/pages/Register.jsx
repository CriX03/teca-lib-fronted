/**
 * Register.jsx - Página de registro de nuevos usuarios
 * 
 * Este componente renderiza el formulario de registro donde los nuevos
 * usuarios pueden crear una cuenta en el sistema. Solicita información
 * básica como nombre, email, contraseña y rol (estudiante o docente).
 * 
 * @author Teca Biblioteca
 * @version 1.0.0
 */

import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { notify } from '../utils/notify';

/**
 * Componente de formulario de registro
 * @returns {JSX.Element} Formulario de registro
 */
export const Register = () => {
  // Estado del formulario
  const [formData, setFormData] = useState({
    nombre: '',        // Nombre completo del usuario
    email: '',         // Correo electrónico
    contrasena: '',    // Contraseña
    rol: 'estudiante'  // Rol del usuario (estudiante/docente)
  });
  const [showPassword, setShowPassword] = useState(false); // Mostrar/ocultar contraseña
  const [error, setError] = useState('');                  // Mensaje de error
  const [success, setSuccess] = useState(false);            // Registro exitoso
  const [isLoading, setIsLoading] = useState(false);        // Estado de carga
  
  const { register } = useAuth(); // Función de registro del contexto
  const navigate = useNavigate(); // Navegación programática

  /**
   * Actualiza los valores del formulario
   */
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  /**
   * Maneja el envío del formulario de registro
   */
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
      {/* Mensaje de error */}
      {error && (
        <div className="flex items-start gap-3 rounded-lg bg-red-50 p-3.5 border border-red-100 animate-slide-down">
          <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-red-600 text-xs font-bold">!</span>
          </div>
          <p className="text-sm text-red-700 font-medium">{error}</p>
        </div>
      )}
      
      {/* Mensaje de éxito */}
      {success && (
        <div className="flex items-start gap-3 rounded-lg bg-emerald-50 p-3.5 border border-emerald-100 animate-slide-down">
          <CheckCircle size={18} className="text-emerald-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-emerald-700 font-medium">
            ¡Registro exitoso! Redirigiendo al login...
          </p>
        </div>
      )}
      
      {/* Campo de nombre completo */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="reg-nombre">
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
        />
      </div>

      {/* Campo de email */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="reg-email">
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
        />
      </div>

      {/* Campo de contraseña */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="reg-contrasena">
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
            className="input pr-10"
            value={formData.contrasena}
            onChange={handleChange}
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

      {/* Selector de rol */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="reg-rol">
          Rol
        </label>
        <select
          id="reg-rol"
          name="rol"
          required
          className="input"
          value={formData.rol}
          onChange={handleChange}
        >
          <option value="estudiante">Estudiante</option>
          <option value="docente">Docente</option>
        </select>
      </div>

      {/* Botón de registro */}
      <button
        type="submit"
        disabled={isLoading || success}
        className="btn btn-primary w-full py-2.5"
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Registrando...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <UserPlus size={18} />
            Crear cuenta
          </span>
        )}
      </button>
      
      {/* Enlace a login */}
      <div className="text-center text-sm text-gray-500 pt-2">
        ¿Ya tienes cuenta?{' '}
        <Link to="/login" className="text-primary-600 hover:text-primary-500 font-semibold transition-colors">
          Inicia sesión
        </Link>
      </div>
    </form>
  );
};
