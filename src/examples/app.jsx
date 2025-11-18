import { Result } from "antd";
import React, { lazy, Suspense } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  Outlet,
} from "react-router-dom";
import Fallback from "./components/Fallback";
import { NotificationProvider } from "./contexts/NotificationContext";
import "./css/style.css";
import Landing from "./pages/Landing";
/* eslint-disable react/function-component-definition */
/* eslint-disable react/prop-types */
const Basic = lazy(() => import("./pages/Basic"));
const Admin = lazy(() => import("./pages/Admin"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const AppointmentDetail = lazy(() => import("./pages/Admin/AppointmentDetail"));
const Notification = lazy(() => import("./pages/Notification"));

// Protected route component
const ProtectedRoute = ({ children }) => {
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      children: [
        {
          path: "/",
          element: (
            <Suspense fallback={<Fallback />}>
              <Landing />
            </Suspense>
          ),
        },

        {
          path: "/scheduler",
          element: (
            <Suspense fallback={<Fallback />}>
              <Basic />
            </Suspense>
          ),
        },
        {
          path: "/admin/login",
          element: (
            <Suspense fallback={<Fallback />}>
              <Login />
            </Suspense>
          ),
        },
        {
          path: "/admin/register",
          element: (
            <Suspense fallback={<Fallback />}>
              <Register />
            </Suspense>
          ),
        },
        {
          path: "/admin",
          element: (
            <ProtectedRoute>
              <NotificationProvider>
                <Outlet />
              </NotificationProvider>
            </ProtectedRoute>
          ),
          children: [
            {
              path: "",
              element: <Admin />,
            },
            {
              path: "notifications",
              element: <Notification />,
            },
            {
              path: "appointment/:id",
              element: <AppointmentDetail />,
            },
          ],
        },
        {
          path: "*",
          element: (
            <Result
              status="404"
              title="404"
              subTitle="Sorry, the page you visited does not exist or is under construction."
            />
          ),
        },
      ],
    },
    {
      path: "*",
      element: (
        <Result
          status="404"
          title="404"
          subTitle="Sorry, the page you visited does not exist or is under construction."
        />
      ),
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
