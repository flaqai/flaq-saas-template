'use client';

import type { ReactNode } from 'react';
import useSidebarStore from '@/store/useSidebarStore';

import { cn } from '@/lib/utils';
import Navigation from '@/components/home/Navigation';

import NavigationSidebar from './NavigationSidebar';

export default function SidebarShell({ children, footer }: { children: ReactNode; footer?: ReactNode }) {
  const isCollapsed = useSidebarStore((state) => state.isCollapsed);

  return (
    <div className='flex w-full flex-1'>
      <div
        aria-hidden='true'
        className={cn(
          'hidden h-screen shrink-0 transition-[width] duration-300 md:block',
          isCollapsed ? 'w-14' : 'w-64',
        )}
      />
      <NavigationSidebar />
      <div className='flex min-w-0 flex-1 flex-col'>
        <Navigation hasSidebar />
        <main className='mx-auto flex w-full min-w-0 flex-1 flex-col overflow-x-hidden'>{children}</main>
        {footer}
      </div>
    </div>
  );
}
