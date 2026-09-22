import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { STORE_PREFIX } from '@/lib/constants';

interface SidebarState {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  toggleCollapsed: () => void;
}

const useSidebarStore = create<SidebarState>()(
  persist(
    (set) => ({
      isCollapsed: false,
      setIsCollapsed: (collapsed) => set({ isCollapsed: collapsed }),
      toggleCollapsed: () => set((state) => ({ isCollapsed: !state.isCollapsed })),
    }),
    {
      name: `${STORE_PREFIX}-sidebar`,
    },
  ),
);

export default useSidebarStore;
