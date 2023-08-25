import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import { ThemeProvider } from "@mui/material";
import theme from "./themes/theme";
import "./index.css";
import { store } from "./store";
import IsAdmin from "./components/IsAdmin";
import Root from "./views/Root/Root";
import SignIn from "./views/SignIn/SignIn";
import SignUp from "./views/SignUp/SignUp";
import Room, { roomLoader } from "./views/Room/Room";
import Rooms from "./views/Rooms/Rooms";
import ErrorPage from "./views/ErrorPage/ErrorPage";
import RoomNotFound from "./views/RoomNotFound/RoomNotFound";
import EditRoom from "./views/EditRoom/EditRoom";
import LandingPage from "./views/LandingPage/LandingPage";
import { Header } from "./components/Header";
import AuthRoute from "./components/AuthRoute";

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
            <Header />
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
