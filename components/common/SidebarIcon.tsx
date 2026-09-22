import { Sparkles } from 'lucide-react';

import { isNavigationIconImage, NAVIGATION_ICON_MAP } from '@/lib/constants/navigation-icons';
import { cn } from '@/lib/utils';

export default function SidebarIcon({ code, isActive, className }: { code: string; isActive: boolean; className?: string }) {
  const mappedIcon = NAVIGATION_ICON_MAP[code];
  const imageIcon = isNavigationIconImage(mappedIcon) ? mappedIcon : undefined;

  if (imageIcon) {
    return (
      <span aria-hidden='true' className={cn('relative block', className)}>
        <img
          src={imageIcon.off}
          alt=''
          className={cn(
            'absolute inset-0 h-full w-full object-contain transition-opacity',
            isActive ? 'opacity-0' : 'opacity-100 group-hover/item:opacity-0',
          )}
        />
        <img
          src={imageIcon.on}
          alt=''
          className={cn(
            'absolute inset-0 h-full w-full object-contain transition-opacity',
            isActive ? 'opacity-100' : 'opacity-0 group-hover/item:opacity-100',
          )}
        />
        <span className='block h-full w-full opacity-0' />
      </span>
    );
  }

  const Icon = mappedIcon && !isNavigationIconImage(mappedIcon) ? mappedIcon : Sparkles;

  return (
    <Icon
      aria-hidden='true'
      className={cn(className, isActive ? 'text-color-main' : 'text-color-t2 group-hover/item:text-color-main')}
    />
  );
}

