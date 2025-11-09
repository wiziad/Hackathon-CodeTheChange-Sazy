'use client';
import { useAuth } from '@/providers/auth-provider';
import { useRouter } from 'next/navigation';

export function useRequireAuth() {
  const { user } = useAuth();
  const router = useRouter();
  return (fn: () => void) => {
    if (!user) {
      localStorage.setItem('metra_return_to', window.location.pathname || '/feed');
      router.push('/auth');
      return;
    }
    fn();
  };
}