import { mockService } from '../mock/mockService';

export const getPosts = async (pageNumber = 0, pageSize = 6) => {
  return await mockService.getPosts(pageNumber, pageSize);
};

export const getPostById = async (id) => {
  return await mockService.getPostById(id);
};

export const createPost = async (postData) => {
  return await mockService.createPost(postData);
};

export const updatePost = async (id, postData) => {
  return await mockService.updatePost(id, postData);
};

export const deletePost = async (id) => {
  return await mockService.deletePost(id);
};

export const getPostsByUser = async (userId, pageNumber = 0, pageSize = 6) => {
  return await mockService.getPostsByUser(userId, pageNumber, pageSize);
};

export const getPostsByCategory = async (categoryId, pageNumber = 0, pageSize = 6) => {
  return await mockService.getPostsByCategory(categoryId, pageNumber, pageSize);
};

export const searchPosts = async (keyword, pageNumber = 0, pageSize = 6) => {
  return await mockService.searchPosts(keyword, pageNumber, pageSize);
};

export const uploadPostImage = async (id, imageFile) => {
  // Mock image upload return image URL
  return { imageName: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80' };
};

export const getPostComments = async (postId) => {
  return await mockService.getPostComments(postId);
};

export const addComment = async (postId, commentData) => {
  const text = typeof commentData === 'string' ? commentData : commentData.content;
  return await mockService.addComment(postId, text);
};

export const deleteComment = async (commentId) => {
  return { success: true };
};
