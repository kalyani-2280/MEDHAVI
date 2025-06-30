import React from 'react';

const ProtectedRoute = ({ user, setCurrentPage, children }) => {
  if (!user) {
    setCurrentPage('auth-page'); 
    return null; 
  }
  return children;
};

export default ProtectedRoute;
