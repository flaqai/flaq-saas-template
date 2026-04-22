import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface BrandItem {
  name: string;
  icon: string;
}

const brands: BrandItem[] = [
  // { name: 'Wan', icon: '/images/model-brand/wan.png' },
  { name: 'Kling', icon: '/images/model-brand/kling.png' },
  { name: 'Veo', icon: '/images/model-brand/veo.png' },
  { name: 'Nano Banana', icon: '/images/model-brand/veo.png' },
  { name: 'Seedance', icon: '/images/model-brand/seed.png' },
  { name: 'Seedream', icon: '/images/model-brand/seed.png' },
];

export default function ModelBrandsBar({ className }: { className?: string }) {
  return (
    <div className={cn('relative flex w-full items-center justify-center px-4 lg:px-0', className)}>
      {/* 外层容器 */}
        <div
          className={cn(
            'flex w-full max-w-full flex-row flex-wrap items-center justify-center',
            'gap-2 rounded-xl px-3 py-2 backdrop-blur-xl',
            'lg:w-auto lg:gap-3 lg:rounded-[48px] lg:px-6 lg:py-2'
          )}
          style={{
            boxShadow: `
              0 1px 0 0 rgba(0, 0, 0, 0.1),
              inset 1px 1px 0 0 rgba(255, 255, 255, 0.5),
              inset 0 -1px 1px rgba(255, 255, 255, 0.1),
              inset 0 0 0 0 rgba(255, 255, 255, 0.02)
            `
          }}
        >
        {brands.map((brand, index) => (
          <div
            key={index}
            className='flex flex-none flex-row items-center gap-1 rounded-none px-1.5 py-0.5'
          >
            {/* 图标 */}
            <div className='relative size-4 flex-none lg:size-6'>
              <Image
                src={brand.icon}
                alt={brand.name}
                fill
                className='object-contain'
              />
            </div>
            {/* 文字 */}
            <span
              className='flex-none text-center text-sm font-normal capitalize leading-5 text-white lg:text-2xl lg:leading-8'
              style={{ fontFamily: "'Noto Sans', sans-serif" }}
            >
              {brand.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
