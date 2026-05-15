import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router';
import './index.css';

import App from '@/App';
import { Homepage, Loginpage, Registerpage, CreatePoll, Dashboard, LiveDashboard, SubmitVote } from '@/pages/index';
import { AuthProvider } from '@/hooks/useAuth';
import { ProtectedRoute } from '@/components/ProtectedRoute';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <Homepage />,
      },
      {
        path: '/login',
        element: <Loginpage />,
      },
      {
        path: '/register',
        element: <Registerpage />,
      },
      {
        path: '/dashboard/submit-vote',
        element: <SubmitVote />,
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: '/create-poll',
            element: <CreatePoll />,
          },
          {
            path: '/dashboard',
            element: <Dashboard />,
          },
          {
            path: '/dashboard/live/poll',
            element: <LiveDashboard />,
          },

        ],
      },
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
);
