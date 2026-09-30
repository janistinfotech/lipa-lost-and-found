import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';
import './ProtectedRoute.css';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="auth-loading-screen">
        <div className="auth-loading-card">
          <Loader2 size={36} className="auth-spinner" />
          <p className="auth-loading-text">Verifying security session...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login page while preserving original intended target route
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
