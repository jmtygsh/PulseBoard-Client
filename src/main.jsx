import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';

import App from '@/App';
import { Homepage, Loginpage, Registerpage, CreatePoll, Dashboard, LiveDashboard, SubmitVote, VerifyEmail, ForgotPassword, ResetPassword } from '@/pages/index';
import { AuthProvider } from '@/hooks/useAuth';
import { ProtectedRoute } from '@/components/ProtectedRoute';

import { ErrorBoundary } from 'react-error-boundary';
import ErrorPage from '@/components/ErrorPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
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
        path: '/verify-email/:token',
        element: <VerifyEmail />,
      },
      {
        path: '/forgot-password',
        element: <ForgotPassword />,
      },
      {
        path: '/reset-password/:token',
        element: <ResetPassword />,
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
    <ErrorBoundary FallbackComponent={ErrorPage}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ErrorBoundary>
  </StrictMode>
);
