import api from './api';

const reportService = {
  getSummary: async (params = {}) => {
    const { data } = await api.get('/reports/summary', { params });
    return data;
  },
  getJobRolesReport: async (params = {}) => {
    const { data } = await api.get('/reports/job-roles', { params });
    return data;
  },
  getSkillsReport: async (params = {}) => {
    const { data } = await api.get('/reports/skills', { params });
    return data;
  },
  getReadinessReport: async (params = {}) => {
    const { data } = await api.get('/reports/readiness', { params });
    return data;
  },
  getReadinessDistribution: async (params = {}) => {
    const { data } = await api.get('/reports/readiness', { params });
    return data;
  },
};

export default reportService;
