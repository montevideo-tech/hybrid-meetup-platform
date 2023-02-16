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
import Rooms from './views/Rooms';
import ErrorPage from './views/errorPage';
import RoomTest from './components/RoomTest';
import Home from './views/Home';
import RoomNotFound from './views/RoomNotFound';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '',
        element: <Home />,
      },
      {
        path: '/rooms',
        element: <Rooms />,
      },
      {
        path: '/rooms/404',
        element: <RoomNotFound />,
      },
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
      },
      {
        path: '/room-test',
        element: <RoomTest />,
      },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Provider store={store}><RouterProvider router={router} /></Provider>);
