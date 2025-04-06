'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import LoadingScreen from './LoadingScreen';

interface AuthenticatedLayoutProps {
  children: React.ReactNode;
  requireAuth?: boolean; // if true, redirects to login if not authenticated
  redirectIfAuth?: boolean; // if true, redirects to dashboard if authenticated
}

const AuthenticatedLayout = ({
  children,
  requireAuth = false,
  redirectIfAuth = false,
}: AuthenticatedLayoutProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = Cookies.get('token');
        if (token) {
          const res = await axios.post(
            `${process.env.API_URL}/auth/get_token`,
            {},
            { withCredentials: true }
          );

          setIsAuthenticated(res.data.success);

          // Handle redirects
          if (res.data.success && redirectIfAuth) {
            window.location.href = '/dashboard';
            return;
          }
        } else if (requireAuth) {
          window.location.href = '/login';
          return;
        }
      } catch (error) {
        if (requireAuth) {
          window.location.href = '/login';
          return;
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [requireAuth, redirectIfAuth]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return <>{children}</>;
};

export default AuthenticatedLayout;
