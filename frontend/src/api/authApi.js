import { INITIAL_USERS } from '../mock/mockData';

export const loginUser = async (credentials) => {
  return {
    token: `mock-token-${Date.now()}`,
    user: INITIAL_USERS.find(u => u.email.toLowerCase() === credentials.email.toLowerCase()) || INITIAL_USERS[0]
  };
};

export const registerUser = async (userData) => {
  return {
    token: `mock-token-${Date.now()}`,
    user: {
      id: Date.now(),
      name: userData.name,
      email: userData.email,
      role: 'ROLE_USER',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80',
      bio: 'Tech Writer & Developer'
    }
  };
};
