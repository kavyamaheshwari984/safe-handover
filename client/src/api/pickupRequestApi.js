import api from './axios';

export const pickupRequestApi = {
  createRequest: async (childId) => {
    const response = await api.post('/pickup-requests', { childId });
    return response.data;
  },
  
  getRequests: async () => {
    const response = await api.get('/pickup-requests');
    return response.data;
  },
  
  getRequestById: async (id) => {
    const response = await api.get(`/pickup-requests/${id}`);
    return response.data;
  },
  
  updateStatus: async (id, status) => {
    const response = await api.patch(`/pickup-requests/${id}/status`, { status });
    return response.data;
  },
  
  cancelRequest: async (id) => {
    const response = await api.patch(`/pickup-requests/${id}/cancel`);
    return response.data;
  }
};
