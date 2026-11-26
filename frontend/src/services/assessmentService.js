import api from './api';

const assessmentService = {
  getAll: async () => {
    const { data } = await api.get('/assessments');
    return data;
  },
  getByStudent: async (studentId) => {
    const { data } = await api.get(`/assessments/student/${studentId}`);
    return data;
  },
  getById: async (id) => {
    const { data } = await api.get(`/assessments/${id}`);
    return data;
  },
  getLatestByStudent: async (studentId) => {
    const { data } = await api.get(`/assessments/student/${studentId}/latest`);
    return data;
  },
};

export default assessmentService;
