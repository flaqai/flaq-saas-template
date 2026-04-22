'use client';

import { useState } from 'react';
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
        'flex items-center gap-2 rounded-lg p-2 text-sm font-normal hover:bg-[#F7F7FB] hover:text-gradient-main',
        isActive && 'bg-[#F7F7FB] text-gradient-main',
      )}
    >
      <span>{icon}</span>
      <div>{title}</div>
    </Link>
  );
}

function SiderGroup({ title, items, icon }: SiderGroupType) {
  const [open, setOpen] = useState(true);
  const matchRoute = useMatchRoute();

  return (
    <div className='flex w-full flex-col gap-0.5'>
      <button
        type='button'
        onClick={() => setOpen(!open)}
        className='mx-1 flex items-center gap-1 rounded-md p-2 text-sm font-medium hover:bg-[#F7F7FB] hover:text-gradient-main'
      >
        <span>{icon}</span>
        <div>{title}</div>
        {items.length > 0 && (
          <ChevronUpIcon className={cn('ml-auto h-4 w-4 rotate-0 transition-all', open && 'rotate-180')} />
        )}
      </button>
      {open && items.length > 0 && (
        <div className='px-5'>
          <div className='border-l border-[var(--c-light-light-gray2)] pl-3'>
            <div className='flex flex-col gap-1'>
              {items.map((item) => (
                <SiderItem key={item.id} {...item} isActive={matchRoute(item.href)} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TreeSider({ group }: { group: SiderGroupType[] }) {
  return (
    <div className='flex flex-col gap-0.5 text-sm'>
      {group.map((item) => (
        <SiderGroup key={item.id} {...item} />
      ))}
    </div>
  );
}
