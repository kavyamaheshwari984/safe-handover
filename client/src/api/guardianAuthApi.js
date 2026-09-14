import api from './axios';

export const guardianAuthApi = {
  createAuthorization: async (authData) => {
    const response = await api.post('/guardian-authorizations', authData);
    return response.data;
  },
  
  getAuthorizations: async () => {
    const response = await api.get('/guardian-authorizations');
    return response.data;
  },
  
  getAuthorizationById: async (id) => {
    const response = await api.get(`/guardian-authorizations/${id}`);
    return response.data;
  },
  
  updateStatus: async (id, status) => {
    const response = await api.patch(`/guardian-authorizations/${id}/status`, { status });
    return response.data;
  },
  
  deleteAuthorization: async (id) => {
    const response = await api.delete(`/guardian-authorizations/${id}`);
    return response.data;
  }
};
