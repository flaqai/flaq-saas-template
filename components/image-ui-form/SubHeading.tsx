'use client';

import { CircleHelp } from 'lucide-react';

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import ArrowDown from './svg/ArrowDown';

export default function SubHeading({ children, tips }: { children: React.ReactNode; tips?: string }) {
  return (
    <div className='flex h-3.5 items-center justify-between text-sm capitalize text-white/60'>
      <div className='flex items-center gap-0.5'>
        {children}
        <ArrowDown />
      </div>
      {tips && (
        <TooltipProvider>
          <Tooltip delayDuration={150}>
            <TooltipTrigger asChild>
              <button type='button'>
                <CircleHelp className='size-3.5 text-[#404142] hover:text-white' />
              </button>
            </TooltipTrigger>
            <TooltipContent side='right' className='isolate max-w-[206px] rounded border-main-gray bg-card-black p-2'>
              <p>{tips}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
}
