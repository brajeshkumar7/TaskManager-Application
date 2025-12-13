import api from './axios.js';

export const taskAPI = {
  getAll: async (params = {}) => {
    const response = await api.get('/tasks', { params });
    return response.data;
  },

  getOne: async (id) => {
    const response = await api.get(`/tasks/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/tasks', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/tasks/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
  },

  getMyCreated: async (params = {}) => {
    const response = await api.get('/tasks/my-created', { params });
    return response.data;
  },

  getMyAssigned: async (params = {}) => {
    const response = await api.get('/tasks/my-assigned', { params });
    return response.data;
  },

  getOverdue: async (params = {}) => {
    const response = await api.get('/tasks/overdue', { params });
    return response.data;
  },
};
