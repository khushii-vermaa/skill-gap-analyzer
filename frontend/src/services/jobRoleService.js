import api from './api';

const jobRoleService = {
  getAll: async () => {
    const { data } = await api.get('/job-roles');
    return data;
  },
  getById: async (id) => {
    const { data } = await api.get(`/job-roles/${id}`);
    return data;
  },
  create: async (payload) => {
    const { data } = await api.post('/job-roles', payload);
    return data;
  },
  update: async (id, payload) => {
    const { data } = await api.put(`/job-roles/${id}`, payload);
    return data;
  },
  remove: async (id) => {
    const { data } = await api.delete(`/job-roles/${id}`);
    return data;
  },
  getRequirements: async (roleId) => {
    const { data } = await api.get(`/job-roles/${roleId}/skills`);
    return data;
  },
  addRequirement: async (roleId, payload) => {
    const { data } = await api.post(`/job-roles/${roleId}/skills`, payload);
    return data;
  },
  updateRequirement: async (requirementId, payload) => {
    const { data } = await api.put(`/job-role-skills/${requirementId}`, payload);
    return data;
  },
  removeRequirement: async (requirementId) => {
    const { data } = await api.delete(`/job-role-skills/${requirementId}`);
    return data;
  },
};

export default jobRoleService;
