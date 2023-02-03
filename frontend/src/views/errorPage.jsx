import React from 'react';
import { useRouteError, useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';

export default function ErrorPage() {
  const error = useRouteError();
  const navigate = useNavigate();

  return (
    <div style={{
      width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    }}
    >
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{error.statusText || error.message}</i>
      </p>
      <Button onClick={() => navigate('/')}>Back to home</Button>
    </div>
  );
}
