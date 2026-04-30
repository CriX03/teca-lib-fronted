import { apiLoans } from '../api/axios';

export const prestamosService = {
  createPrestamo: async (data) => {
    return await apiLoans.post('/prestamos', data);
  },
  
  getMisPrestamos: async () => {
    return await apiLoans.get('/prestamos/mis-prestamos');
  },
  
  returnPrestamo: async (id) => {
    return await apiLoans.post(`/prestamos/${id}/devolucion`);
  }
};
