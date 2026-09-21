'use client';

import { ZoomIn, ZoomOut } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Slider } from '@/components/ui/slider';

interface AIMediaCreatorHistoryColumnControlProps {
  value: number;
  onChange: (value: number) => void;
  decreaseLabel: string;
  increaseLabel: string;
  valueLabel: string;
  compact?: boolean;
  minColumns?: number;
  maxColumns?: number;
}

const DEFAULT_MIN_COLUMNS = 2;
const DEFAULT_MAX_COLUMNS = 5;

export default function AIMediaCreatorHistoryColumnControl({
  value,
  onChange,
  decreaseLabel,
  increaseLabel,
  valueLabel,
  compact = false,
  minColumns = DEFAULT_MIN_COLUMNS,
  maxColumns = DEFAULT_MAX_COLUMNS,
}: AIMediaCreatorHistoryColumnControlProps) {
  return (
    <div
      className={cn(
        'border-color-b1 bg-color-bg0 h-10 items-center gap-2 rounded-xl border px-3',
        compact ? 'flex' : 'hidden lg:flex',
      )}
      aria-label={valueLabel}
    >
      <button
        type='button'
        onClick={() => onChange(Math.max(minColumns, value - 1))}
        disabled={value <= minColumns}
        aria-label={decreaseLabel}
        title={decreaseLabel}
        className='text-color-t2 hover:text-color-t1 disabled:text-color-t3 transition-colors disabled:cursor-not-allowed'
      >
        <ZoomOut className='size-4' />
      </button>
      <Slider
        value={[value]}
        onValueChange={(values) => onChange(values[0])}
        min={minColumns}
        max={maxColumns}
        step={1}
        aria-label={valueLabel}
        className='w-20 [&_[data-slot=slider-track]]:h-0.5 [&_[data-slot=slider-track]]:bg-white/20 [&_[data-slot=slider-range]]:bg-white/70 [&_[data-slot=slider-thumb]]:size-2.5 [&_[data-slot=slider-thumb]]:border-0 [&_[data-slot=slider-thumb]]:bg-white [&_[data-slot=slider-thumb]]:shadow-none'
      />
      <button
        type='button'
        onClick={() => onChange(Math.min(maxColumns, value + 1))}
        disabled={value >= maxColumns}
        aria-label={increaseLabel}
        title={increaseLabel}
        className='text-color-t2 hover:text-color-t1 disabled:text-color-t3 transition-colors disabled:cursor-not-allowed'
      >
        <ZoomIn className='size-4' />
      </button>
    </div>
  );
}
