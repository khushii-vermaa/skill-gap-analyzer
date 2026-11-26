import api from './api';

const roadmapService = {
  generate: async (assessmentId) => {
    const { data } = await api.post(`/roadmaps/generate/${assessmentId}`);
    return data;
  },
  getByStudent: async (studentId) => {
    const { data } = await api.get(`/roadmaps/student/${studentId}`);
    return data;
  },
  getById: async (id) => {
    const { data } = await api.get(`/roadmaps/${id}`);
    return data;
  },
  update: async (id, payload) => {
    const { data } = await api.put(`/roadmaps/${id}`, payload);
    return data;
  },
  getTasks: async (roadmapId) => {
    const { data } = await api.get(`/roadmaps/${roadmapId}/tasks`);
    return data;
  },
  addTask: async (roadmapId, payload) => {
    const { data } = await api.post(`/roadmaps/${roadmapId}/tasks`, payload);
    return data;
  },
  updateTask: async (taskId, payload) => {
    const { data } = await api.put(`/roadmaps/tasks/${taskId}`, payload);
    return data;
  },
  deleteTask: async (taskId) => {
    const { data } = await api.delete(`/roadmap-tasks/${taskId}`);
    return data;
  },
};

export default roadmapService;
