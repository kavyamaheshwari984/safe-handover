import api from './axios';

export const childrenApi = {
  createChild: async (childData) => {
    const response = await api.post('/children', childData);
    return response.data;
  },
  
  getAllChildren: async () => {
    const response = await api.get('/children');
    return response.data;
  },
  
  getChildById: async (id) => {
    const response = await api.get(`/children/${id}`);
    return response.data;
  },
  
  updateChild: async (id, updates) => {
    const response = await api.patch(`/children/${id}`, updates);
    return response.data;
  },
  
  deleteChild: async (id) => {
    const response = await api.delete(`/children/${id}`);
    return response.data;
  }
};
