// RatingStars.tsx

'use client';

import React, { useMemo, useState } from 'react';
import { Star } from 'lucide-react';

import { cn } from '@/lib/utils';

type Props = {
  /** Current rating value (0 – total).  If omitted the component is uncontrolled. */
  value?: number;
  /** Callback when user selects a rating */
  onChange?: (rating: number) => void;
  /** Total number of stars displayed */
  total?: number;
  /** Enable user interaction */
  editable?: boolean;
  /** Minimum change step (0.5 = half-star, 1 = whole star, etc.) */
  step?: number;
  /** Tailwind classes for size – default w-6 h-6 */
  sizeClass?: string;
};

export default function RatingStars({
  value,
  onChange,
  total = 5,
  editable = false,
  step = 0.5,
  sizeClass = 'w-6 h-6',
}: Props) {
  // Uncontrolled fallback
  const [internal, setInternal] = useState(0);
  const current = value ?? internal;

  // Hover preview state
  const [preview, setPreview] = useState<number | null>(null);

  // Utility – clamp & round value to nearest step
  const snap = (val: number) =>
    Math.max(
      0,
      Math.min(total, Math.round(val / step) * step), // round to step
    );

  // Star fill percentages for render optimisation
  const fills = useMemo(() => {
    const r = preview ?? current;
    // eslint-disable-next-line no-nested-ternary
    return Array.from({ length: total }, (_, i) => (r >= i + 1 ? 100 : r > i ? (r - i) * 100 : 0));
  }, [preview, current, total]);

  // Handle selection & hover
  const handlePointer = (index: number, e: React.PointerEvent<HTMLDivElement>, commit: boolean) => {
    if (!editable) return;
    const { left, width } = e.currentTarget.getBoundingClientRect();
    const fraction = (e.clientX - left) / width;
    const val = snap(index + fraction);
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    commit ? onChange?.(val) ?? setInternal(val) : setPreview(val);
  };

  return (
    <div className='flex select-none items-center space-x-1' onPointerLeave={() => setPreview(null)}>
      {fills.map((p, i) => (
        <div
          key={i}
          className={`relative ${sizeClass} cursor-${editable ? 'pointer' : 'default'}`}
          onPointerMove={(e) => handlePointer(i, e, false)}
          onPointerDown={(e) => handlePointer(i, e, true)}
        >
          {/* Empty star */}
          <Star className={cn(sizeClass, 'absolute inset-0 fill-[#9CBDFF] stroke-[#9CBDFF]')} />

          {/* Filled portion */}
          <div style={{ width: `${p}%` }} className='absolute left-0 top-0 h-full overflow-hidden'>
            <Star className={`inset-0 fill-color-main stroke-color-main ${sizeClass}`} />
          </div>
        </div>
      ))}
    </div>
  );
}
