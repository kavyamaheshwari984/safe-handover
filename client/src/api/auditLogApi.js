import api from './axios';

export const auditLogApi = {
  getAuditLogs: async () => {
    const response = await api.get('/audit-logs');
    return response.data;
  },
  
  getAuditLogById: async (id) => {
    const response = await api.get(`/audit-logs/${id}`);
    return response.data;
  }
};
