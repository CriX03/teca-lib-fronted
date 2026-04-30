import { apiCatalog } from '../api/axios';

export const catalogoService = {
  // Libros
  getLibros: async (params) => {
    return await apiCatalog.get('/catalogo/libros', { params });
  },
  
  createLibro: async (libroData) => {
    return await apiCatalog.post('/catalogo/libros', libroData);
  },
  
  updateLibro: async (id, libroData) => {
    return await apiCatalog.put(`/catalogo/libros/${id}`, libroData);
  },
  
  deleteLibro: async (id) => {
    return await apiCatalog.delete(`/catalogo/libros/${id}`);
  },
  
  updateDisponibilidad: async (id, disponible) => {
    return await apiCatalog.patch(`/catalogo/libros/${id}/disponibilidad`, { disponible });
  },

  // Autores
  getAutores: async () => await apiCatalog.get('/catalogo/autores'),
  createAutor: async (data) => await apiCatalog.post('/catalogo/autores', data),
  updateAutor: async (id, data) => await apiCatalog.put(`/catalogo/autores/${id}`, data),
  deleteAutor: async (id) => await apiCatalog.delete(`/catalogo/autores/${id}`),

  // Editoriales
  getEditoriales: async () => await apiCatalog.get('/catalogo/editoriales'),
  createEditorial: async (data) => await apiCatalog.post('/catalogo/editoriales', data),
  updateEditorial: async (id, data) => await apiCatalog.put(`/catalogo/editoriales/${id}`, data),
  deleteEditorial: async (id) => await apiCatalog.delete(`/catalogo/editoriales/${id}`),

  // Categorias
  getCategorias: async () => await apiCatalog.get('/catalogo/categorias'),
  createCategoria: async (data) => await apiCatalog.post('/catalogo/categorias', data),
  updateCategoria: async (id, data) => await apiCatalog.put(`/catalogo/categorias/${id}`, data),
  deleteCategoria: async (id) => await apiCatalog.delete(`/catalogo/categorias/${id}`)
};
