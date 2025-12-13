import api from './axios.js';

export const userAPI = {
  getAll: async () => {
    const response = await api.get('/users');
    return response.data;
  },
};
