// from https://ui.dev/react-router-protected-routes-authentication
import { Navigate } from 'react-router-dom';
import React from 'react';
import { store } from '../store';

function RequireAuth({ children }) {
  const isLoggedIn = !!store.getState().user?.token;

  return isLoggedIn ? children : <Navigate to="/signIn" replace />;
}

export default RequireAuth;
