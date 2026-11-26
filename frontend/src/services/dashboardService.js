import api from './api';

const dashboardService = {
  getAdminDashboard: async () => {
    const { data } = await api.get('/dashboard/admin');
    return data;
  },
  getStudentDashboard: async (studentId) => {
    const { data } = await api.get(`/dashboard/student/${studentId}`);
    return data;
  },
};

export default dashboardService;
