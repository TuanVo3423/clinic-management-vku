import { Result } from 'antd';
import React, { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Fallback from './components/Fallback';
import './css/style.css';

const Basic = lazy(() => import('./pages/Basic'));
const Admin = lazy(() => import('./pages/Admin'));

function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      children: [
        {
          path: '/',
          element: (
            <Suspense fallback={<Fallback />}>
              <Basic />
            </Suspense>
          ),
        },
        {
          path: '/admin',
          element: (
            <Suspense fallback={<Fallback />}>
              <Admin />
            </Suspense>
          ),
        },
        {
          path: '*',
          element: <Result status="404" title="404" subTitle="Sorry, the page you visited does not exist or is under construction." />,
        },
      ],
    },
    {
      path: '*',
      element: <Result status="404" title="404" subTitle="Sorry, the page you visited does not exist or is under construction." />,
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
