import { Result } from "antd";
import React, { lazy, Suspense } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import Fallback from "./components/Fallback";
import "./css/style.css";
/* eslint-disable react/function-component-definition */
/* eslint-disable react/prop-types */
const Basic = lazy(() => import("./pages/Basic"));
const Admin = lazy(() => import("./pages/Admin"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));

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
              <Suspense fallback={<Fallback />}>
                <Admin />
              </Suspense>
            </ProtectedRoute>
          ),
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
