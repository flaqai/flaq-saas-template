'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

import { cn } from '@/lib/utils';

interface TextHideProps {
  text: string;
  maxHeight: number;
  className?: string;
  textClassName?: string;
}

export default function TextHide({ text, maxHeight, className, textClassName }: TextHideProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className='relative'>
      <div
        style={{
          height: !isExpanded ? `${maxHeight}px` : '100%',
        }}
        className={cn(
          'cursor-text resize-none rounded-lg border border-main-gray bg-black p-3 text-sm text-white/70',
          'overflow-hidden transition-transform duration-150 ease-in-out',
          !isExpanded &&
            'after:absolute after:bottom-0 after:left-0 after:h-20 after:w-full after:bg-linear-to-b after:from-transparent after:to-black after:transition-opacity after:duration-300 after:content-[""]',
          className,
        )}
      >
        <p className={textClassName}>{text}</p>
      </div>
      {text.length > maxHeight && (
        <button
          type='button'
          onClick={toggleExpand}
          className='absolute bottom-0 left-1/2 flex h-3 w-5 -translate-x-1/2 items-center justify-center rounded-t bg-main-gray text-black'
        >
          {isExpanded ? <ChevronUp className='size-3' /> : <ChevronDown className='size-3' />}
        </button>
      )}
    </div>
  );
}
