import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import { ThemeProvider } from "@mui/material";
import theme from "./themes/theme";
import "./index.css";
import { store } from "./store";
import IsAdmin from "./components/IsAdmin";
import Root from "./views/Root";
import SignIn from "./views/SignIn";
import SignUp from "./views/SignUp";
import Room, { roomLoader } from "./views/Room";
import Rooms from "./views/Rooms";
import ErrorPage from "./views/ErrorPage";
import RoomNotFound from "./views/RoomNotFound";
import EditRoom from "./views/EditRoom";
import { Header } from "./components/Header";

// import RoomTest from './components/RoomTest';
import AuthRoute from "./components/AuthRoute";
import LandingPage from "./views/LandingPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "",
        element: (
          <AuthRoute>
            <Header />,
          </AuthRoute>
        ),
        children: [{ path: "", element: <LandingPage /> }],
      },
      {
        path: "/rooms",
        element: (
          <AuthRoute requireAuth>
            <Header />
          </AuthRoute>
        ),
        children: [
          {
            path: "",
            element: <Rooms />,
          },
          {
            path: "404",
            element: <RoomNotFound />,
          },
          {
            path: ":roomId",
            element: <Room />,
            loader: roomLoader,
          },
          {
            path: ":roomId/edit",
            element: (
              <IsAdmin>
                <EditRoom />
              </IsAdmin>
            ),
            loader: roomLoader,
          },
        ],
      },
      {
        path: "/signIn",
        element: (
          <AuthRoute>
            <SignIn />
          </AuthRoute>
        ),
      },
      {
        path: "/signUp",
        element: (
          <AuthRoute>
            <SignUp />
          </AuthRoute>
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

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ThemeProvider theme={theme}>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </ThemeProvider>,
);
