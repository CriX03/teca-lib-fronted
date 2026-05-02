/**
 * useDebounce.js - Hook personalizado para debounce de valores
 * 
 * Este hook retrasa la actualización de un valor hasta que ha pasado un
 * tiempo determinado sin que el valor cambie. Es útil para evitar llamadas
 * excesivas a APIs durante la escritura en campos de búsqueda.
 * 
 * @param {any} value - Valor a debouncear
 * @param {number} delay - Tiempo de espera en milisegundos (por defecto 500ms)
 * @returns {any} El valor debounceado
 * 
 * @example
 * const debouncedSearch = useDebounce(searchTerm, 500);
 * // Solo se actualiza cuando el usuario deja de escribir por 500ms
 * 
 * @author Teca Biblioteca
 * @version 1.0.0
 */

import { useState, useEffect } from 'react';

/**
 * Hook que devuelve el valor con un retraso especificado
 * @param {any} value - Valor que se desea debouncear
 * @param {number} delay - Milisegundos de retraso (default: 500ms)
 * @returns {any} Valor con delay aplicado
 */
export const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Configurar temporizador que actualiza el valor después del delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Limpiar el temporizador si el valor cambia antes de que termine el delay
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};
