import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export function ProtectedRoute({ children }) {
  const { token, user } = useAuth();
  const location = useLocation();
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Admin bypass
  if (user?.role_id === 1) {
    return children;
  }

  // Permission checks based on path
  const path = location.pathname;
  if (user?.permissions) {
    const p = user.permissions;
    if (path === '/' && !p.Dashboard) return <Navigate to="/login" replace />;
    if (path.startsWith('/vehicles') && !p.Vehicles) return <Navigate to="/" replace />;
    if (path.startsWith('/drivers') && !p.Drivers) return <Navigate to="/" replace />;
    if (path.startsWith('/trips') && !p.Trips) return <Navigate to="/" replace />;
    if (path.startsWith('/maintenance') && !p.Maintenance) return <Navigate to="/" replace />;
    if (path.startsWith('/expenses') && !p.FuelExpenses) return <Navigate to="/" replace />;
    if (path.startsWith('/reports') && !p.Reports) return <Navigate to="/" replace />;
  }

  return children;
}
