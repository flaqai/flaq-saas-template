'use client';

import { usePathname } from '@/i18n/navigation';
import SidebarShell from '@/components/common/SidebarShell';
import Navigation from '@/components/home/Navigation';

export default function CanvasLayout({ children }: { readonly children: React.ReactNode }) {
  const pathname = usePathname();
  const normalizedPathname = pathname.replace(/\/$/, '');

  if (normalizedPathname === '/ai-canvas') {
    return <div className='canvas-workspace flex min-h-dvh'><SidebarShell>{children}</SidebarShell></div>;
  }

  return (
    <div className='canvas-workspace min-h-dvh'>
      {normalizedPathname === '/ai-canvas/projects' && <Navigation />}
      {children}
    </div>
  );
}
