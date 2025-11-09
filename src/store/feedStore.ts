import { create } from 'zustand';

interface FeedState {
  filters: {
    category?: string;
    distanceKm?: number;
    timeWindow?: string;
  };
  cursor: string | null;
  setFilters: (filters: Partial<FeedState['filters']>) => void;
  setCursor: (cursor: string | null) => void;
  resetFilters: () => void;
}

export const useFeedStore = create<FeedState>((set) => ({
  filters: {},
  cursor: null,
  setFilters: (filters) => set((state) => ({ 
    filters: { ...state.filters, ...filters } 
  })),
  setCursor: (cursor) => set({ cursor }),
  resetFilters: () => set({ filters: {} }),
}));