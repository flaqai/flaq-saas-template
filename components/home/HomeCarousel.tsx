'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import SubHeading from '../internal-page/sub-heading';

export interface CarouselCard {
  type: string;
  media: {
    type: 'video' | 'image';
    src: string;
    poster?: string;
  };
  href?: string;
}

export default function HomeCarousel({ title, description, className, data }: { title: string; description: string; className?: string; data: CarouselCard[] }) {
  const t = useTranslations('Home.carousel');
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + data.length) % data.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % data.length);
  };

  const handleCardClick = (index: number) => {
    const diff = (index - currentIndex + data.length) % data.length;

    if (diff === 0) {
      // 当前卡片，跳转到对应页面
      const card = data[index];
      if (card.href) {
        router.push(card.href);
      }
    } else if (diff === 1 || diff === -(data.length - 1)) {
      // 右侧卡片，切换到下一张
      goToNext();
    } else if (diff === data.length - 1 || diff === -1) {
      // 左侧卡片，切换到上一张
      goToPrevious();
    }
  };

  const getCardStyle = (index: number) => {
    const diff = (index - currentIndex + data.length) % data.length;
    
    if (diff === 0) {
      // 中间卡片
      return {
        transform: 'translateX(0%) scale(1)',
        zIndex: 30,
        opacity: 1,
      };
    } else if (diff === 1 || diff === -(data.length - 1)) {
      // 右侧卡片
      return {
        transform: 'translateX(70%) scale(0.85)',
        zIndex: 20,
        opacity: 0.6,
      };
    } else if (diff === data.length - 1 || diff === -1) {
      // 左侧卡片
      return {
        transform: 'translateX(-70%) scale(0.85)',
        zIndex: 20,
        opacity: 0.6,
      };
    } else {
      // 隐藏的卡片
      return {
        transform: 'translateX(0%) scale(0.7)',
        zIndex: 10,
        opacity: 0,
      };
    }
  };

  return (
    <div className={cn('relative w-full overflow-hidden py-8 lg:py-12', className)}>
      <SubHeading title={title} description={description} />

      <div className='relative mx-auto w-full max-w-[1200px] px-4'>
        {/* 卡片容器 */}
        <div className='relative aspect-[16/9] w-full'>
          {data.map((card, index) => {
            const style = getCardStyle(index);
            return (
              <div
                key={index}
                style={style}
                onClick={() => handleCardClick(index)}
                className={cn(
                  'absolute left-1/2 top-1/2 aspect-[16/9] w-[95%] -translate-x-1/2 -translate-y-1/2 transition-all duration-500 ease-out lg:w-[85%] cursor-pointer'
                )}
              >
                {/* 卡片内容 */}
                <div className='relative h-full w-full overflow-hidden rounded-2xl shadow-2xl lg:rounded-3xl'>
                  {/* 媒体内容 */}
                  {card.media.type === 'video' ? (
                    <video
                      className='h-full w-full object-contain select-none'
                      src={card.media.src}
                      poster={card.media.poster}
                      autoPlay
                      loop
                      muted
                      playsInline
                      draggable={false}
                      onDragStart={(e) => e.preventDefault()}
                      onLoadedMetadata={(e) => {
                        const video = e.currentTarget;
                        video.volume = 0;
                      }}
                    />
                  ) : (
                    <Image
                      src={card.media.src}
                      alt={card.type}
                      fill
                      className='object-contain select-none'
                      draggable={false}
                      onDragStart={(e) => e.preventDefault()}
                    />
                  )}

                  {/* 底部渐变模糊 - 从底往上逐渐清晰 */}
                  <div className='absolute inset-x-0 bottom-0 h-[15%] backdrop-blur-[8px]' style={{ maskImage: 'linear-gradient(to top, black 0%, transparent 100%)' }} />
                  <div className='absolute inset-x-0 bottom-0 h-[15%] bg-gradient-to-t from-black/40 via-black/15 to-transparent' />

                  {/* 左上角类型标识 - 毛玻璃效果 */}
                  <div className='absolute left-3 top-3 flex flex-row items-center justify-center gap-2.5 rounded-lg bg-black/20 px-4 py-2.5 backdrop-blur-[9px]'>
                    <span className='text-sm font-medium text-white lg:text-base'>
                      {card.type}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 左右切换按钮 */}
        <button
          onClick={goToPrevious}
          className='absolute left-0 top-1/2 z-40 -translate-y-1/2 text-white transition hover:scale-110 lg:left-[2%]'
          aria-label='Previous'
        >
          <ChevronLeft className='size-10 lg:size-12' strokeWidth={2.5} />
        </button>
        <button
          onClick={goToNext}
          className='absolute right-0 top-1/2 z-40 -translate-y-1/2 text-white transition hover:scale-110 lg:right-[2%]'
          aria-label='Next'
        >
          <ChevronRight className='size-10 lg:size-12' strokeWidth={2.5} />
        </button>

        {/* 底部指示器 */}
        <div className='absolute -bottom-4 left-1/2 z-40 flex -translate-x-1/2 gap-2'>
          {data.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={cn(
                'h-2 rounded-full transition-all',
                index === currentIndex ? 'w-8 bg-white' : 'w-2 bg-white/50'
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}