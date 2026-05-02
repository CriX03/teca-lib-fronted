/**
 * catalogoService.js - Servicio de catálogo de libros
 * 
 * Este módulo proporciona todos los métodos necesarios para interactuar con el
 * API del catálogo de libros. Incluye operaciones CRUD completas para libros,
 * autores, editoriales y categorías.
 * 
 * @author Teca Biblioteca
 * @version 1.0.0
 */

import { apiCatalog } from '../api/axios';

/**
 * Objeto con métodos para gestionar el catálogo de la biblioteca
 */
export const catalogoService = {
  // ========== OPERACIONES CON LIBROS ==========
  
  /**
   * Obtiene la lista de libros con soporte para paginación y filtros
   * @param {Object} params - Parámetros de consulta (page, per_page, titulo, disponible)
   * @returns {Promise<Object>} Lista de libros
   */
  getLibros: async (params) => {
    return await apiCatalog.get('/catalogo/libros', { params });
  },
  
  /**
   * Obtiene los detalles de un libro específico
   * @param {number|string} id - ID del libro
   * @returns {Promise<Object>} Datos del libro
   */
  getLibroById: async (id) => {
    return await apiCatalog.get(`/catalogo/libros/${id}`);
  },
  
  /**
   * Crea un nuevo libro en el catálogo
   * @param {Object} libroData - Datos del nuevo libro
   * @returns {Promise<Object>} Libro creado
   */
  createLibro: async (libroData) => {
    return await apiCatalog.post('/catalogo/libros', libroData);
  },
  
  /**
   * Actualiza un libro existente
   * @param {number|string} id - ID del libro a actualizar
   * @param {Object} libroData - Nuevos datos del libro
   * @returns {Promise<Object>} Libro actualizado
   */
  updateLibro: async (id, libroData) => {
    return await apiCatalog.put(`/catalogo/libros/${id}`, libroData);
  },
  
  /**
   * Elimina un libro del catálogo
   * @param {number|string} id - ID del libro a eliminar
   * @returns {Promise<Object>} Resultado de la operación
   */
  deleteLibro: async (id) => {
    return await apiCatalog.delete(`/catalogo/libros/${id}`);
  },
  
  /**
   * Actualiza la disponibilidad de un libro
   * @param {number|string} id - ID del libro
   * @param {boolean} disponible - Nuevo estado de disponibilidad
   * @returns {Promise<Object>} Resultado de la operación
   */
  updateDisponibilidad: async (id, disponible) => {
    return await apiCatalog.patch(`/catalogo/libros/${id}/disponibilidad`, { disponible });
  },

  // ========== OPERACIONES CON AUTORES ==========
  
  /**
   * Obtiene todos los autores del catálogo
   * @returns {Promise<Object>} Lista de autores
   */
  getAutores: async () => await apiCatalog.get('/catalogo/autores'),
  
  /**
   * Crea un nuevo autor
   * @param {Object} data - Datos del autor (nombre)
   * @returns {Promise<Object>} Autor creado
   */
  createAutor: async (data) => await apiCatalog.post('/catalogo/autores', data),
  
  /**
   * Actualiza un autor existente
   * @param {number|string} id - ID del autor
   * @param {Object} data - Nuevos datos del autor
   * @returns {Promise<Object>} Autor actualizado
   */
  updateAutor: async (id, data) => await apiCatalog.put(`/catalogo/autores/${id}`, data),
  
  /**
   * Elimina un autor del catálogo
   * @param {number|string} id - ID del autor a eliminar
   * @returns {Promise<Object>} Resultado de la operación
   */
  deleteAutor: async (id) => await apiCatalog.delete(`/catalogo/autores/${id}`),

  // ========== OPERACIONES CON EDITORIALES ==========
  
  /**
   * Obtiene todas las editoriales del catálogo
   * @returns {Promise<Object>} Lista de editoriales
   */
  getEditoriales: async () => await apiCatalog.get('/catalogo/editoriales'),
  
  /**
   * Crea una nueva editorial
   * @param {Object} data - Datos de la editorial (nombre)
   * @returns {Promise<Object>} Editorial creada
   */
  createEditorial: async (data) => await apiCatalog.post('/catalogo/editoriales', data),
  
  /**
   * Actualiza una editorial existente
   * @param {number|string} id - ID de la editorial
   * @param {Object} data - Nuevos datos de la editorial
   * @returns {Promise<Object>} Editorial actualizada
   */
  updateEditorial: async (id, data) => await apiCatalog.put(`/catalogo/editoriales/${id}`, data),
  
  /**
   * Elimina una editorial del catálogo
   * @param {number|string} id - ID de la editorial a eliminar
   * @returns {Promise<Object>} Resultado de la operación
   */
  deleteEditorial: async (id) => await apiCatalog.delete(`/catalogo/editoriales/${id}`),

  // ========== OPERACIONES CON CATEGORÍAS ==========
  
  /**
   * Obtiene todas las categorías del catálogo
   * @returns {Promise<Object>} Lista de categorías
   */
  getCategorias: async () => await apiCatalog.get('/catalogo/categorias'),
  
  /**
   * Crea una nueva categoría
   * @param {Object} data - Datos de la categoría (nombre)
   * @returns {Promise<Object>} Categoría creada
   */
  createCategoria: async (data) => await apiCatalog.post('/catalogo/categorias', data),
  
  /**
   * Actualiza una categoría existente
   * @param {number|string} id - ID de la categoría
   * @param {Object} data - Nuevos datos de la categoría
   * @returns {Promise<Object>} Categoría actualizada
   */
  updateCategoria: async (id, data) => await apiCatalog.put(`/catalogo/categorias/${id}`, data),
  
  /**
   * Elimina una categoría del catálogo
   * @param {number|string} id - ID de la categoría a eliminar
   * @returns {Promise<Object>} Resultado de la operación
   */
  deleteCategoria: async (id) => await apiCatalog.delete(`/catalogo/categorias/${id}`)
};
