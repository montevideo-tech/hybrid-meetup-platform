import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import Root from './views/Root';
import SignIn from './views/SignIn';
import SignUp from './views/SignUp';
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
      {
        path: '/signIn',
        element: <SignIn />,
      },
      {
        path: '/signUp',
        element: <SignUp />,
      }
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Provider store={store}><RouterProvider router={router} /></Provider>);
