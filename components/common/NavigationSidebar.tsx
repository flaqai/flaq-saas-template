'use client';

import { Fragment } from 'react';
import { Link, usePathname } from '@/i18n/navigation';
import useSidebarStore from '@/store/useSidebarStore';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { isItemActive, SIDEBAR_NAVIGATION_GROUPS, SIDEBAR_PRIMARY_ITEMS } from '@/lib/constants/sidebar-navigation';
import { cn } from '@/lib/utils';

import SidebarIcon from './SidebarIcon';
import SidebarMoreButton from './SidebarMoreButton';

export default function NavigationSidebar() {
  const pathname = usePathname();
  const t = useTranslations('Navigation');
  const { isCollapsed, toggleCollapsed } = useSidebarStore();

  return (
    <aside
      className={cn(
        'border-color-b1 bg-black fixed inset-y-0 left-0 z-40 hidden h-screen flex-col border-r md:flex',
        'transition-[width] duration-300',
        isCollapsed ? 'w-14' : 'w-64',
      )}
    >
      <div
        className={cn(
          'border-color-b1 flex h-[64px] w-full shrink-0 items-center border-b',
          isCollapsed ? 'justify-center px-2' : 'justify-between pr-2 pl-4',
        )}
      >
        {isCollapsed ? (
          <button
            type='button'
            onClick={toggleCollapsed}
            className='bg-color-c1 hover:bg-color-c2 flex h-9 w-9 items-center justify-center rounded-lg transition-colors'
            aria-label={t('expand-sidebar')}
            aria-expanded={false}
          >
            <ChevronRight className='text-color-t2 h-5 w-5' />
          </button>
        ) : (
          <>
            <Link href='/' className='flex min-w-0 items-center gap-3 hover:opacity-80'>
              <img src='/images/logo.png' alt={t('title')} className='h-8 w-8 shrink-0 rounded-md object-cover' />
              <span className='text-color-t1 truncate text-sm font-semibold'>{t('title')}</span>
            </Link>
            <button
              type='button'
              onClick={toggleCollapsed}
              className='bg-color-c1/80 hover:bg-color-c2 flex h-8 w-8 items-center justify-center rounded-lg transition-colors'
              aria-label={t('collapse-sidebar')}
              aria-expanded={true}
            >
              <ChevronLeft className='text-color-t2 h-5 w-5' />
            </button>
          </>
        )}
      </div>

      <div className='no-scrollbar w-full min-w-0 flex-1 overflow-y-auto py-2 pb-8'>
        {isCollapsed ? (
          <div className='flex w-full flex-col gap-0.5 pb-24'>
            {SIDEBAR_PRIMARY_ITEMS.map((item) => {
              const active = isItemActive(pathname, item.href);

              return (
                <Link key={item.code} href={item.href} title={t(item.code)} className='block'>
                  <div
                    className={cn(
                      'group/item mx-auto flex h-9 w-9 items-center justify-center rounded-lg transition-colors',
                      active ? 'bg-color-c2' : 'hover:bg-color-c2/80',
                    )}
                  >
                    <SidebarIcon code={item.code} isActive={active} className='h-5 w-5 shrink-0' />
                  </div>
                </Link>
              );
            })}
            <div className='border-color-b1 mx-2 my-2 border-t' />
            {SIDEBAR_NAVIGATION_GROUPS.map((group, groupIndex) => {
              const visibleItems = group.items.slice(0, group.collapsedVisibleCount);
              const hiddenItems = group.items.slice(group.collapsedVisibleCount);

              return (
                <Fragment key={group.code}>
                  {groupIndex > 0 && <div className='border-color-b1 mx-2 my-2 border-t' />}
                  <div className='flex w-full flex-col gap-0.5'>
                    {visibleItems.map((item) => {
                      const active = isItemActive(pathname, item.href);

                      return (
                        <Link key={item.code} href={item.href} title={t(item.code)} className='block'>
                          <div
                            className={cn(
                              'group/item mx-auto flex h-9 w-9 items-center justify-center rounded-lg transition-colors',
                              active ? 'bg-color-c2' : 'hover:bg-color-c2/80',
                            )}
                          >
                            <SidebarIcon code={item.code} isActive={active} className='h-5 w-5 shrink-0' />
                          </div>
                        </Link>
                      );
                    })}
                    {hiddenItems.length > 0 && (
                      <SidebarMoreButton group={group} hiddenItems={hiddenItems} pathname={pathname} t={t} />
                    )}
                  </div>
                </Fragment>
              );
            })}
          </div>
        ) : (
          <div className='flex w-full min-w-0 flex-col pb-24'>
            {SIDEBAR_PRIMARY_ITEMS.map((item) => {
              const active = isItemActive(pathname, item.href);

              return (
                <Link key={item.code} href={item.href} className='block'>
                  <div
                    className={cn(
                      'group/item mx-2 flex min-h-9 items-center gap-3 rounded-lg px-3 py-1.5 transition-colors',
                      active ? 'bg-color-c2' : 'hover:bg-color-c2/80',
                    )}
                  >
                    <SidebarIcon code={item.code} isActive={active} className='h-5 w-5 shrink-0' />
                    <div className='flex min-w-0 flex-1 items-center gap-2'>
                      <span
                        className={cn(
                          'truncate text-sm leading-6 transition-colors',
                          active ? 'text-color-main' : 'text-color-t2 group-hover/item:text-color-main',
                        )}
                      >
                        {t(item.code)}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
            <div className='border-color-b1 mx-3 my-1 border-t' />
            {SIDEBAR_NAVIGATION_GROUPS.map((group, groupIndex) => (
              <Fragment key={group.code}>
                {groupIndex > 0 && <div className='border-color-b1 mx-3 my-1 border-t' />}
                <div className='px-4 pt-3 pb-1'>
                  <span className='text-color-t3 text-xs font-medium'>{t(group.groupLabelKey)}</span>
                </div>
                {group.items.map((item) => {
                  const active = isItemActive(pathname, item.href);

                  return (
                    <Link key={item.code} href={item.href} className='block'>
                      <div
                        className={cn(
                          'group/item mx-2 flex min-h-9 items-center gap-3 rounded-lg px-3 py-1.5 transition-colors',
                          active ? 'bg-color-c2' : 'hover:bg-color-c2/80',
                        )}
                      >
                        <SidebarIcon code={item.code} isActive={active} className='h-5 w-5 shrink-0' />
                        <span
                          className={cn(
                            'truncate text-sm leading-6 transition-colors',
                            active ? 'text-color-main' : 'text-color-t2 group-hover/item:text-color-main',
                          )}
                        >
                          {t(item.code)}
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </Fragment>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}
