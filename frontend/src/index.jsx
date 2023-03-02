import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';

import './index.css';
import { store } from './store';

import Root from './views/Root';
import SignIn from './views/SignIn';
import SignUp from './views/SignUp';
import Room, { roomLoader } from './views/Room';
import Rooms from './views/Rooms';
import ErrorPage from './views/errorPage';
import Home from './views/Home';
import RoomNotFound from './views/RoomNotFound';
import EditRoom from './views/EditRoom';

// import RoomTest from './components/RoomTest';
import RequireAuth from './components/RequireAuth';

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
        path: '/rooms/404',
        element: <RoomNotFound />,
      },
      {
        path: '/rooms/:roomId',
        element: (
          <RequireAuth>
            <Room />
          </RequireAuth>
        ),
        loader: roomLoader,
      },
      {
        path: '/rooms/:roomId/edit',
        element: (
          <RequireAuth>
            <EditRoom />
          </RequireAuth>
        ),
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
        path: '/rooms',
        element: (
          <RequireAuth>
            <Rooms />
          </RequireAuth>
        ),
      },
      // {
      //   path: '/room-test',
      //   element: (
      //     <RequireAuth>
      //       <RoomTest />
      //     </RequireAuth>
      //   ),
      // },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Provider store={store}><RouterProvider router={router} /></Provider>);
