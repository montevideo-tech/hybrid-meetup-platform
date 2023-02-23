/* eslint-disable react/prop-types */
import { Navigate } from 'react-router-dom';
import React from 'react';
import { store } from '../store';

function Home() {
  return (
    store.getState().user.email ? <Navigate to="/rooms" /> : <Navigate to="/signIn" />
  );
}

export default Home;
