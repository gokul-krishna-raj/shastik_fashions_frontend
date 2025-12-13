'use client';

import { StoreProvider } from '@/components/providers/StoreProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  return <StoreProvider>{children}</StoreProvider>;
}

