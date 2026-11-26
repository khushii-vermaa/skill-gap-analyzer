import api from './api';

const categoryService = {
  getAll: async () => {
    const { data } = await api.get('/categories');
    return data;
  },
  create: async (payload) => {
    const { data } = await api.post('/categories', payload);
    return data;
  },
  update: async (id, payload) => {
    const { data } = await api.put(`/categories/${id}`, payload);
    return data;
  },
  remove: async (id) => {
    const { data } = await api.delete(`/categories/${id}`);
    return data;
  },
};

export default categoryService;
