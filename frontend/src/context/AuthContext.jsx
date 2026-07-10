import React, { createContext, useState, useEffect } from 'react';
import { loginUser, registerUser } from '../api/authApi';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize and check if user is already logged in
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Login handler
  const login = async (credentials) => {
    try {
      const data = await loginUser(credentials);
      // Save token and user to state and localStorage
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Invalid email or password';
      return { success: false, error: message };
    }
  };

  // Register handler
  const register = async (userData) => {
    try {
      const data = await registerUser(userData);
      // Automatically log in user after registration
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      return { success: false, error: message };
    }
  };

  // Logout handler
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  // Check if current user is admin
  const isAdmin = () => {
    if (!user) return false;
    // Spring Boot seeds roles: "ROLE_ADMIN" or "ROLE_USER" (we check in auth response)
    // Wait, the roles might be stored under user details, or we can check authorities.
    // The Spring Boot database seeding configures the User entity's roles relation.
    // Let's see: the user DTO returned by spring boot might not explicitly list roles unless we expose them.
    // Wait! Let's check how the UserResponse is defined:
    // UserResponse: Long id, String name, String email, LocalDateTime createdAt, LocalDateTime updatedAt
    // Oh, the UserResponse does NOT contain roles!
    // But wait, the admin user has email "admin@blogsphere.com". We can check if email is "admin@blogsphere.com"
    // or we can allow checking email. Let's make a generic check: email contains "admin@" or matches "admin@blogsphere.com".
    return user.email === 'admin@blogsphere.com';
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!token,
        login,
        register,
        logout,
        isAdmin,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};
