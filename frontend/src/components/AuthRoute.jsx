/* eslint-disable react/prop-types */
import React from "react";
import { Navigate } from "react-router-dom";
import { getUserToken } from "../utils/get-user-token";

function AuthRoute({ children, requireAuth = false }) {
  const isLoggedIn = !!getUserToken();

  if (requireAuth && !isLoggedIn) {
    return <Navigate to="/signIn" />;
  }

  if (!requireAuth && isLoggedIn) {
    return <Navigate to="/rooms" />;
  }

  return children;
}

export default AuthRoute;
