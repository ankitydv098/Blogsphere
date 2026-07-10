import axiosInstance from './axiosConfig';

// Fetch all posts with pagination and sorting
export const getPosts = async (pageNumber = 0, pageSize = 10, sortBy = 'createdAt', sortDir = 'desc') => {
  const response = await axiosInstance.get(`/api/posts`, {
    params: { pageNumber, pageSize, sortBy, sortDir },
  });
  return response.data;
};

// Fetch single post details
export const getPostById = async (id) => {
  const response = await axiosInstance.get(`/api/posts/${id}`);
  return response.data;
};

// Create a new post
export const createPost = async (postData) => {
  const response = await axiosInstance.post(`/api/posts`, postData);
  return response.data;
};

// Update an existing post
export const updatePost = async (id, postData) => {
  const response = await axiosInstance.put(`/api/posts/${id}`, postData);
  return response.data;
};

// Delete a post
export const deletePost = async (id) => {
  const response = await axiosInstance.delete(`/api/posts/${id}`);
  return response.data;
};

// Fetch posts by a specific user (author)
export const getPostsByUser = async (userId, pageNumber = 0, pageSize = 10) => {
  const response = await axiosInstance.get(`/api/users/${userId}/posts`, {
    params: { pageNumber, pageSize },
  });
  return response.data;
};

// Fetch posts by a specific category
export const getPostsByCategory = async (categoryId, pageNumber = 0, pageSize = 10) => {
  const response = await axiosInstance.get(`/api/categories/${categoryId}/posts`, {
    params: { pageNumber, pageSize },
  });
  return response.data;
};

// Search posts by keyword
export const searchPosts = async (keyword, pageNumber = 0, pageSize = 10) => {
  const response = await axiosInstance.get(`/api/posts/search`, {
    params: { keyword, pageNumber, pageSize },
  });
  return response.data;
};

// Upload post image
export const uploadPostImage = async (id, imageFile) => {
  const formData = new FormData();
  formData.append('image', imageFile);
  
  const response = await axiosInstance.post(`/api/posts/${id}/image`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// Fetch comments for a post
export const getPostComments = async (postId) => {
  const response = await axiosInstance.get(`/api/posts/${postId}/comments`);
  return response.data;
};

// Add a comment to a post
export const addComment = async (postId, commentData) => {
  const response = await axiosInstance.post(`/api/posts/${postId}/comments`, commentData);
  return response.data;
};

// Delete a comment
export const deleteComment = async (commentId) => {
  const response = await axiosInstance.delete(`/api/comments/${commentId}`);
  return response.data;
};
