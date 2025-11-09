"use client";

import { useEffect } from 'react';

export function MockProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_MOCK === '1') {
      const initMocks = async () => {
        const { initMocks } = await import('@/mocks');
        initMocks();
      };
      
      initMocks();
    }
  }, []);

  return <>{children}</>;
}