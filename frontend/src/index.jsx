import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Root from './views/Root';
import SignIn from './views/SignIn';
import Room, { roomLoader } from './views/Room';
import ErrorPage from './views/errorPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/rooms/:roomId',
        element: <Room />,
        loader: roomLoader,
      },
    ],
  },
  {
    path: '/signIn',
    element: <SignIn />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<RouterProvider router={router} />);
