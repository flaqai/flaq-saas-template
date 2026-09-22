'use client';

import { useState } from 'react';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';

import { isItemActive, type SidebarNavigationGroup } from '@/lib/constants/sidebar-navigation';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

import SidebarIcon from './SidebarIcon';

type SidebarItem = SidebarNavigationGroup['items'][number];

export default function SidebarMoreButton({
  group,
  hiddenItems,
  pathname,
  t,
}: {
  group: SidebarNavigationGroup;
  hiddenItems: SidebarItem[];
  pathname: string;
  t: ReturnType<typeof useTranslations>;
}) {
  const [open, setOpen] = useState(false);
  const hasActiveHiddenItem = hiddenItems.some((item) => isItemActive(pathname, item.href));
  const moreOff = `/images/sidebar-icon/off/${group.iconFolder}/more_${group.iconFolder}_off.svg`;
  const moreOn = `/images/sidebar-icon/on/${group.iconFolder}/more_${group.iconFolder}_on.svg`;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type='button'
          className='flex w-full justify-center'
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
          aria-label={t(group.groupLabelKey)}
        >
          <div
            className={cn(
              'flex h-9 w-9 items-center justify-center rounded-lg transition-colors',
              hasActiveHiddenItem || open ? 'bg-color-c2' : 'hover:bg-color-c2/80',
            )}
          >
            <img
              src={hasActiveHiddenItem || open ? moreOn : moreOff}
              alt=''
              aria-hidden='true'
              className='h-5 w-5 shrink-0'
            />
          </div>
        </button>
      </PopoverTrigger>
      <PopoverContent
        side='right'
        sideOffset={0}
        align='start'
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onOpenAutoFocus={(e) => e.preventDefault()}
        onCloseAutoFocus={(e) => e.preventDefault()}
        className='border-color-b1 bg-color-c1/95 ml-[-1px] w-72 rounded-xl border p-2 shadow-[0_18px_60px_rgba(0,0,0,0.45)] backdrop-blur-md'
      >
        <div className='text-color-t3 px-2 pt-1 pb-2 text-xs font-medium'>{t(group.groupLabelKey)}</div>
        <div className='flex flex-col gap-1'>
          {hiddenItems.map((item) => {
            const active = isItemActive(pathname, item.href);

            return (
              <Link key={item.code} href={item.href} className='block' onClick={() => setOpen(false)}>
                <div
                  className={cn(
                    'group/item flex min-h-10 items-center gap-3 rounded-lg px-3 py-2 transition-colors',
                    active ? 'bg-color-c2' : 'hover:bg-color-c2/80',
                  )}
                >
                  <SidebarIcon code={item.code} isActive={active} className='h-5 w-5 shrink-0' />
                  <span
                    className={cn(
                      'truncate text-sm leading-5 transition-colors',
                      active ? 'text-color-main' : 'text-color-t2 group-hover/item:text-color-main',
                    )}
                  >
                    {t(item.code)}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}

