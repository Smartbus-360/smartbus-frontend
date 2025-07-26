import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated } from './config/authService.js';

export default function PrivateRoute({ children }) {
  return isAuthenticated() ? children : <Navigate to="/auth/sign-in" />;
}
