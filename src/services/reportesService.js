import { apiReports } from '../api/axios';

export const reportesService = {
  getLibrosMasPrestados: async (limit = 10) => {
    return await apiReports.get('/reportes/libros-mas-prestados', { params: { limit } });
  },
  
  getPrestamosPorUsuario: async (limit = 10) => {
    return await apiReports.get('/reportes/prestamos-por-usuario', { params: { limit } });
  },
  
  getRetrasos: async (limit = 10) => {
    return await apiReports.get('/reportes/retrasos', { params: { limit } });
  }
};
