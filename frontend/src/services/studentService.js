import api from './api';

const studentService = {
  getAll: async () => {
    const { data } = await api.get('/students');
    return data;
  },
  getById: async (id) => {
    const { data } = await api.get(`/students/${id}`);
    return data;
  },
  create: async (payload) => {
    const { data } = await api.post('/students', payload);
    return data;
  },
  update: async (id, payload) => {
    const { data } = await api.put(`/students/${id}`, payload);
    return data;
  },
  remove: async (id) => {
    const { data } = await api.delete(`/students/${id}`);
    return data;
  },
  updateStatus: async (id, active) => {
    const { data } = await api.patch(`/students/${id}/status`, { active });
    return data;
  },
};

export default studentService;
