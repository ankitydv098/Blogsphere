import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, user, isAdmin } = useContext(AuthContext);
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to login page but save the current location they were trying to access
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (adminOnly && !isAdmin()) {
    // Redirect unauthorized admins to home
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
