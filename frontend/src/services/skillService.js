import api from './api';

const skillService = {
  getAll: async () => {
    const { data } = await api.get('/skills');
    return data;
  },
  getById: async (id) => {
    const { data } = await api.get(`/skills/${id}`);
    return data;
  },
  create: async (payload) => {
    const { data } = await api.post('/skills', payload);
    return data;
  },
  update: async (id, payload) => {
    const { data } = await api.put(`/skills/${id}`, payload);
    return data;
  },
  remove: async (id) => {
    const { data } = await api.delete(`/skills/${id}`);
    return data;
  },
};

export default skillService;
