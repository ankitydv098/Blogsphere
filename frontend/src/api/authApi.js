import axiosInstance from './axiosConfig';

export const loginUser = async (credentials) => {
  const response = await axiosInstance.post('/api/auth/login', credentials);
  return response.data;
};

export const registerUser = async (userData) => {
  const response = await axiosInstance.post('/api/auth/register', userData);
  return response.data;
};
