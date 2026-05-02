/**
 * useAuth.js - Hook personalizado para acceder al contexto de autenticación
 * 
 * Este hook proporciona una forma sencilla de acceder al estado de autenticación
 * desde cualquier componente de la aplicación. Debe ser usado dentro de un
 * AuthProvider para funcionar correctamente.
 * 
 * @returns {Object} Objeto con user, token, loading, login, logout, register
 * @throws {Error} Si se usa fuera de un AuthProvider
 * 
 * @author Teca Biblioteca
 * @version 1.0.0
 */

import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

/**
 * Hook personalizado para consumir el contexto de autenticación
 * @returns {Object} Estado y funciones de autenticación
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
