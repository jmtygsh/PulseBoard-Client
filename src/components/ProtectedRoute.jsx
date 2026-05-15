import { Navigate, Outlet } from 'react-router';
import { useAuth } from '@/hooks/useAuth';
import { useEffect, useState } from 'react';
import api from '@/api/axios';

export const ProtectedRoute = () => {
  const { token, logout } = useAuth();
  const [isVerifying, setIsVerifying] = useState(true);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setIsVerifying(false);
        return;
      }

      try {
        await api.get('/api/auth/me');
        setIsValid(true);
      } catch (error) {
        setIsValid(false);
        logout();
      } finally {
        setIsVerifying(false);
      }
    };

    verifyToken();
  }, [token, logout]);

  if (isVerifying) {
    return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">Checking...</div>; // Or your loading spinner
  }

  if (!token || !isValid) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
