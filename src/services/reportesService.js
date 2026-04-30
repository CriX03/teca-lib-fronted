import { apiReports } from '../api/axios';

export const reportesService = {
  getLibrosMasPrestados: async () => {
    return await apiReports.get('/reportes/libros-mas-prestados');
  },
  
  getPrestamosPorUsuario: async () => {
    return await apiReports.get('/reportes/prestamos-por-usuario');
  },
  
  getRetrasos: async () => {
    return await apiReports.get('/reportes/retrasos');
  }
};
