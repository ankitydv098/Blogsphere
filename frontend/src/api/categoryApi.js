import { mockService } from '../mock/mockService';

export const getCategories = async () => {
  return await mockService.getCategories();
};

export const getCategoryById = async (id) => {
  const categories = await mockService.getCategories();
  return categories.find(c => c.id === Number(id));
};
