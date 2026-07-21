import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Redirect PENDING Farmers or Delivery Partners to the pending page
  if (
    (user?.role === 'FARMER' || user?.role === 'DELIVERY') &&
    user?.status === 'PENDING' &&
    location.pathname !== '/pending-verification'
  ) {
    return <Navigate to="/pending-verification" replace />;
  }

  // If already APPROVED/ACTIVE but trying to access the pending page, redirect to their dashboard
  if (user?.status === 'APPROVED' && location.pathname === '/pending-verification') {
    const dashboardRedirects = {
      FARMER: '/farmer/dashboard',
      DELIVERY: '/delivery/dashboard',
    };
    return <Navigate to={dashboardRedirects[user.role] || '/'} replace />;
  }

  return children;
};

export default ProtectedRoute;
