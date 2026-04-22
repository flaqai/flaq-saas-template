'use client';

import { useState, useEffect } from 'react';
import { Link } from '@/i18n/navigation';
import { ChevronUpIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import useMatchRoute from '@/hooks/use-match-route';

type SiderGroupType = {
  icon?: React.ReactNode;
  id: string;
  title: string;
  items: { id: string; icon?: React.ReactNode; title: string; href: string }[];
};

function SiderItem({ title, icon, href, isActive }: SiderGroupType['items'][number] & { isActive: boolean }) {
  return (
    <Link
      href={href}
      className={cn(
        'group flex items-center gap-2 rounded-lg p-2 text-sm font-normal text-white/70 hover:bg-white/5',
        isActive && 'bg-white/10 font-medium',
      )}
    >
      <div className={cn(isActive && 'bg-gradient-to-r from-[#2563eb] to-[#60a5fa] bg-clip-text text-transparent')}>
        {icon && <span>{icon}</span>}
        <div>{title}</div>
      </div>
    </Link>
  );
}

function SiderGroup({ title, items, icon }: SiderGroupType) {
  const matchRoute = useMatchRoute();

  const hasActiveItem = items.some((item) => matchRoute(item.href));
  const [clickedOpen, setClickedOpen] = useState(false);

  useEffect(() => {
    setClickedOpen(false);
  }, [hasActiveItem]);

  const shouldOpen = hasActiveItem || clickedOpen;

  const handleClick = () => {
    setClickedOpen(!clickedOpen);
  };

  return (
    <div className='flex w-full flex-col gap-0.5'>
      <button
        type='button'
        onClick={handleClick}
        className='mx-1 flex items-center gap-1 rounded-md p-2 text-sm font-medium text-white/80 hover:bg-white/5 hover:cursor-pointer'
      >
        <span>{icon}</span>
        <div>{title}</div>
        {items.length > 0 && (
          <ChevronUpIcon className={cn('ml-auto h-4 w-4 rotate-0 text-white/60 transition-all', shouldOpen && 'rotate-180')} />
        )}
      </button>
      {items.length > 0 && (
        <div
          className={cn(
            'grid transition-[grid-template-rows] duration-150 ease-in-out',
            shouldOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
          )}
        >
          <div className='overflow-hidden'>
            <div className='px-5'>
              <div className='border-l border-white/10 pl-3'>
                <div className='flex flex-col gap-1'>
                  {items.map((item) => (
                    <SiderItem key={item.id} {...item} isActive={matchRoute(item.href)} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TreeSider({ group }: { group: SiderGroupType[] }) {
  return (
    <div className='flex flex-col gap-0.5 pb-32 text-sm'>
      {group.map((item) => (
        <SiderGroup key={item.id} {...item} />
      ))}
    </div>
  );
}
