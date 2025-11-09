import { create } from 'zustand';
import { Profile, Role } from '@/types';

interface AuthState {
  user: Profile | null;
  role: Role | null;
  postalCode: string | null;
  isLoggedIn: boolean;
  login: (user: Profile) => void;
  logout: () => void;
  setPostalCode: (postalCode: string) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  role: null,
  postalCode: null,
  isLoggedIn: false,
  login: (user) => set({ user, role: user.role, isLoggedIn: true }),
  logout: () => set({ user: null, role: null, isLoggedIn: false }),
  setPostalCode: (postalCode) => set({ postalCode }),
}));