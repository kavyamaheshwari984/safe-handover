import api from './axios';

export const otpApi = {
  generateOTP: async (pickupRequestId) => {
    const response = await api.post('/otp/generate', { pickupRequestId });
    return response.data;
  },
  
  verifyOTP: async (pickupRequestId, otp) => {
    const response = await api.post('/otp/verify', { pickupRequestId, otp });
    return response.data;
  },
  
  resendOTP: async (pickupRequestId) => {
    const response = await api.post('/otp/resend', { pickupRequestId });
    return response.data;
  },
  
  invalidateOTP: async (pickupRequestId) => {
    const response = await api.post('/otp/invalidate', { pickupRequestId });
    return response.data;
  }
};
