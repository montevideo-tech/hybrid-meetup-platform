// from https://ui.dev/react-router-protected-routes-authentication
import { Navigate } from 'react-router-dom';
import React from 'react';
import store from '../store';

// eslint-disable-next-line react/prop-types
function RequireAuth({ children }) {
  const isLoggedIn = store.getState().loggedUser.email;

  return isLoggedIn === true ? children : <Navigate to="/signIn" replace />;
}

export default RequireAuth;
