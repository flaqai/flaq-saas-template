'use client';

import { useState } from 'react';
import { Link, usePathname } from '@/i18n/navigation';
import { ChevronDown } from 'lucide-react';

import { cn } from '@/lib/utils';
import NavigationIcon from '@/components/common/NavigationIcon';

import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';

export default function NavPopover({
  label,
  isHighLight = false,
  navDataList,
  className,
  columnNumber = 2,
  align = 'start',
}: {
  label: string;
  isHighLight?: boolean;
  navDataList: {
    label: string;
    description: string;
    href: string;
    code: string;
    target?: string;
    isNew?: boolean;
    isHot?: boolean;
  }[];
  className?: string;
  columnNumber?: number;
  align?: React.ComponentProps<typeof PopoverContent>['align'];
}) {
  const [openToolsNav, setOpenToolsNav] = useState(false);
  const pathname = usePathname();

  return (
    <Popover open={openToolsNav} onOpenChange={setOpenToolsNav}>
      <PopoverTrigger asChild>
        <button
          type='button'
          className={cn(
            'flex h-10 min-h-10 items-center gap-1 rounded-lg px-1 text-sm font-semibold text-white/70 hover:bg-color-c2 xl:px-2 2xl:px-3 2xl:text-base',
            isHighLight ? 'bg-color-c2 text-color-main' : 'text-white/70',
            className,
          )}
        >
          <span className='font-semibold'>{label}</span>
          <ChevronDown
            className={cn(
              'size-4 rotate-0 text-white/40 transition-transform duration-150 2xl:size-5',
              openToolsNav && '-rotate-180',
            )}
          />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align={align}
        sideOffset={10}
        className={cn(
          'custom-scrollbar z-[120] flex max-h-[calc(100dvh-100px)] max-w-[calc(100vw-24px)] flex-col gap-4 overflow-y-auto rounded-lg border border-color-b1 bg-color-c1 p-4 text-center text-base leading-4 font-normal text-white shadow-[0_24px_80px_rgba(0,0,0,0.55)] backdrop-blur-lg',
          columnNumber === 2 && 'w-[580px]',
          columnNumber === 3 && 'w-[920px]',
          columnNumber === 4 && 'w-[960px]',
        )}
      >
        <ul
          className={cn(
            'grid gap-x-7 gap-y-2.5',
            columnNumber === 2 && 'grid-cols-2',
            columnNumber === 3 && 'grid-cols-3',
            columnNumber === 4 && 'grid-cols-4',
          )}
        >
          {navDataList.map((child) => (
            <li key={child.href}>
              <Link
                key={child.code}
                href={child.href as string}
                target={child?.target}
                onClick={() => setOpenToolsNav(false)}
                className={cn(
                  'group relative flex h-[64px] w-full items-start gap-3 rounded-lg border border-transparent px-2 py-2.5 transition-colors duration-150 after:absolute after:right-0 after:bottom-0 after:left-0 after:h-px after:bg-color-b1 after:content-[""] hover:border-color-main/35 hover:bg-color-c2/90 hover:shadow-[0_10px_26px_rgba(0,0,0,0.22)] hover:after:bg-transparent',
                  columnNumber === 4 && 'h-[68px]',
                )}
              >
                <NavigationIcon code={child.code} href={child.href} isActive={pathname === child.href || pathname.startsWith(`${child.href}/`)} />
                <div className='min-w-0 flex-grow'>
                  <div className='truncate text-left text-base leading-6 font-semibold text-white transition-colors group-hover:text-color-main'>{child.label}</div>
                  <p className='truncate text-left text-xs leading-5 text-white/70 transition-colors group-hover:text-white'>{child.description}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </PopoverContent>
    </Popover>
  );
}
