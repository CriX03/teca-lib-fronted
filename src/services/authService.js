import { apiUsers } from '../api/axios';

export const authService = {
  login: async (credentials) => {
    return await apiUsers.post('/auth/login', credentials);
  },
  
  registro: async (userData) => {
    return await apiUsers.post('/auth/registro', userData);
  },
  
  getCurrentUser: async () => {
    return await apiUsers.get('/auth/me');
  },
  
  checkAdmin: async () => {
    return await apiUsers.get('/auth/admin/check');
  }
};
