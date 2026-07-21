import React, { createContext, useState, useEffect } from 'react';
import { mockService } from '../mock/mockService';
import { ANKIT } from '../mock/mockData';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');

    if (storedUser && storedToken) {
      try {
        const parsed = JSON.parse(storedUser);
        if (parsed.name !== 'Ankit Kumar') {
          // Reset to default portfolio identity
          const newToken = 'mock-jwt-ankit-kumar';
          setUser(ANKIT);
          setToken(newToken);
          localStorage.setItem('user', JSON.stringify(ANKIT));
          localStorage.setItem('token', newToken);
        } else {
          setUser(parsed);
          setToken(storedToken);
        }
      } catch (e) {
        const newToken = 'mock-jwt-ankit-kumar';
        setUser(ANKIT);
        setToken(newToken);
        localStorage.setItem('user', JSON.stringify(ANKIT));
        localStorage.setItem('token', newToken);
      }
    } else {
      // Default: Ankit Kumar's portfolio session
      const newToken = 'mock-jwt-ankit-kumar';
      setUser(ANKIT);
      setToken(newToken);
      localStorage.setItem('user', JSON.stringify(ANKIT));
      localStorage.setItem('token', newToken);
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    // For demo purposes — always resolves as Ankit Kumar
    const newToken = `mock-token-${Date.now()}`;
    setUser(ANKIT);
    setToken(newToken);
    mockService.setCurrentUser(ANKIT);
    localStorage.setItem('user', JSON.stringify(ANKIT));
    localStorage.setItem('token', newToken);
    return { success: true };
  };

  const register = async (userData) => {
    const newUser = {
      ...ANKIT,
      id: Date.now(),
      name: userData.name || ANKIT.name,
      email: userData.email || ANKIT.email,
    };
    const newToken = `mock-token-${Date.now()}`;
    setUser(newUser);
    setToken(newToken);
    mockService.setCurrentUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
    localStorage.setItem('token', newToken);
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const isAdmin = () => {
    return user && (user.role === 'ROLE_ADMIN' || user.email === 'ankit@blogsphere.com');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user,
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
