import axiosInstance from './axiosConfig';

// Fetch all categories
export const getCategories = async () => {
  const response = await axiosInstance.get('/api/categories');
  return response.data;
};

// Fetch single category
export const getCategoryById = async (id) => {
  const response = await axiosInstance.get(`/api/categories/${id}`);
  return response.data;
};

// Create category (Admin only)
export const createCategory = async (categoryData) => {
  const response = await axiosInstance.post('/api/categories', categoryData);
  return response.data;
};

// Update category (Admin only)
export const updateCategory = async (id, categoryData) => {
  const response = await axiosInstance.put(`/api/categories/${id}`, categoryData);
  return response.data;
};

// Delete category (Admin only)
export const deleteCategory = async (id) => {
  const response = await axiosInstance.delete(`/api/categories/${id}`);
  return response.data;
};
