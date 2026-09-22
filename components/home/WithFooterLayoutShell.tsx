'use client';

import { usePathname } from '@/i18n/navigation';

import { ALL_FEATURE_ROUTES } from '@/lib/constants';
import SidebarShell from '@/components/common/SidebarShell';

import Navigation from './Navigation';

export default function WithFooterLayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const normalizedPathname = pathname.length > 1 ? pathname.replace(/\/$/, '') : pathname;
  const showSidebar = ALL_FEATURE_ROUTES.some(
    (route) => normalizedPathname === route.href || normalizedPathname.endsWith(route.href),
  );

  if (showSidebar) {
    return <SidebarShell>{children}</SidebarShell>;
  }

  return (
    <>
      <Navigation />
      <main className='mx-auto flex w-full flex-1'>{children}</main>
    </>
  );
}
