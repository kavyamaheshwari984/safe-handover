import api from './axios';

export const handoverApi = {
  getHandovers: async () => {
    const response = await api.get('/handovers');
    return response.data;
  },
  
  getHandoverById: async (id) => {
    const response = await api.get(`/handovers/${id}`);
    return response.data;
  }
};
