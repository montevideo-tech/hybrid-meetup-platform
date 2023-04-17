import { Navigate } from 'react-router-dom';
import React from 'react';
import { store } from '../store';

// eslint-disable-next-line react/prop-types
function IsAdmin({ children }) {
  const isLoggedIn = store.getState().user?.token;
  if (isLoggedIn) {
    const isAdmin = store.getState().user.role;
    return isAdmin === 'admin' ? children : <Navigate to="/rooms" replace />;
  }
  return isLoggedIn === true ? children : <Navigate to="/signIn" replace />;
}

export default IsAdmin;
