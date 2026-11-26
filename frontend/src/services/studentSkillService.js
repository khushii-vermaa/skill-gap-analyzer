import api from './api';

const studentSkillService = {
  getByStudent: async (studentId) => {
    const { data } = await api.get(`/student-skills/${studentId}`);
    return data;
  },
  add: async (payload) => {
    const { data } = await api.post('/student-skills', payload);
    return data;
  },
  update: async (id, payload) => {
    const { data } = await api.put(`/student-skills/${id}`, payload);
    return data;
  },
  remove: async (id) => {
    const { data } = await api.delete(`/student-skills/${id}`);
    return data;
  },
};

export default studentSkillService;
