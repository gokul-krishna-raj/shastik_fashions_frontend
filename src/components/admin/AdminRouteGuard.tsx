'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

interface AdminRouteGuardProps {
  children: React.ReactNode;
}

export function AdminRouteGuard({ children }: AdminRouteGuardProps) {
  const router = useRouter();
  const { token, profile, status } = useSelector((state: RootState) => state.user);

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    // Wait for auth status to be determined
    if (status === 'idle' || status === 'loading') {
      return;
    }

    // Check if user is authenticated and is admin
    if (!token || !profile) {
      router.push('/auth/login');
      return;
    }

    if (profile.role !== 'admin') {
      router.push('/');
      return;
    }
  }, [token, profile, status, router]);

  // Show loading state while checking auth or during initial client render
  if (!isMounted || status === 'loading' || !token || !profile || profile.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Checking permissions...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

