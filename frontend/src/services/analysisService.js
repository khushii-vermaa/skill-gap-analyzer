import api from './api';

const analysisService = {
  runAnalysis: async (studentId, jobRoleId) => {
    const { data } = await api.post(`/analysis/${studentId}/${jobRoleId}`);
    return data;
  },
  getResult: async (assessmentId) => {
    const { data } = await api.get(`/analysis/${assessmentId}`);
    return data;
  },
  getDetails: async (assessmentId) => {
    const { data } = await api.get(`/analysis/${assessmentId}/details`);
    return data;
  },
};

export default analysisService;
