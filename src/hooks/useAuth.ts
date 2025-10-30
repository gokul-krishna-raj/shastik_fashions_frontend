
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { RootState } from '@/store';

const useAuth = (redirectIfUnauthenticated: string = '/auth/login') => {
  const router = useRouter();
  const { token, status } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    // Only redirect if the status is not loading and there's no token
    // This prevents redirecting during initial app load while token is being checked from localStorage
    if (status !== 'loading' && !token) {
      router.push(redirectIfUnauthenticated);
    }
  }, [token, status, router, redirectIfUnauthenticated]);

  return { isAuthenticated: !!token, isLoading: status === 'loading' };
};

export default useAuth;
