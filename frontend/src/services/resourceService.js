import api from './api';

const resourceService = {
  getAll: async () => {
    const { data } = await api.get('/resources');
    return data;
  },
  getBySkill: async (skillId) => {
    const { data } = await api.get(`/resources/skill/${skillId}`);
    return data;
  },
  create: async (payload) => {
    const { data } = await api.post('/resources', payload);
    return data;
  },
  update: async (id, payload) => {
    const { data } = await api.put(`/resources/${id}`, payload);
    return data;
  },
  remove: async (id) => {
    const { data } = await api.delete(`/resources/${id}`);
    return data;
  },
};

export default resourceService;
