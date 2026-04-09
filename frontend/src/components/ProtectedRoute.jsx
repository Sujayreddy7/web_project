import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const token = localStorage.getItem('access_token');

  // If there's no token, boot the user to the login page immediately
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Otherwise gently render the child components (Layout and its children)
  return <Outlet />;
};

export default ProtectedRoute;
