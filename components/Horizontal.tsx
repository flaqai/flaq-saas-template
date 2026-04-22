import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { cn } from '@/lib/utils';

interface BtnProps {
  onClick: () => void;
  className?: string;
  hidden: boolean;
  children: ReactNode;
}

function Btn({ onClick, className, hidden, children }: BtnProps) {
  return (
    <button
      type='button'
      onClick={onClick}
      className={cn(
        'absolute top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/80 p-2 opacity-100 shadow-md backdrop-blur-sm transition duration-150 ease-in-out',
        hidden && 'opacity-0',
        className,
      )}
    >
      {children}
    </button>
  );
}

interface HorizontalProps {
  className?: string;
  children: ReactNode;
}

export default function Horizontal({ className, children }: HorizontalProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [showLeftBtn, setShowLeftBtn] = useState<boolean>(false);
  const [showRightBtn, setShowRightBtn] = useState<boolean>(false);

  const checkScroll = (): void => {
    if (containerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
      setShowLeftBtn(scrollLeft > 0);
      setShowRightBtn(scrollLeft + clientWidth < scrollWidth - 1);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, []);

  const clickBtn = (direction: 'left' | 'right'): void => {
    if (containerRef.current) {
      const scrollAmount = containerRef.current.clientWidth / 2;
      containerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className={cn('relative w-full', className)}>
      <Btn onClick={() => clickBtn('left')} className='left-0 ml-1' hidden={!showLeftBtn}>
        <ChevronLeft />
      </Btn>
      <div ref={containerRef} className='no-scrollbar w-full overflow-x-auto' onScroll={checkScroll}>
        <div className='flex w-max items-center gap-3'>{children}</div>
      </div>
      <Btn onClick={() => clickBtn('right')} className='right-0 mr-1' hidden={!showRightBtn}>
        <ChevronRight />
      </Btn>
    </div>
  );
}
