'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import { cn } from '@/lib/utils';

interface CompareProps {
  firstImage?: string;
  secondImage?: string;
  className?: string;
  firstImageClassName?: string;
  secondImageClassname?: string;
  initialSliderPercentage?: number;
  slideMode?: 'hover' | 'drag';
  showHandlebar?: boolean;
  autoplay?: boolean;
  autoplayDuration?: number;
}

function ImagesCompare({
  firstImage = '',
  secondImage = '',
  className,
  firstImageClassName,
  secondImageClassname,
  initialSliderPercentage = 50,
  slideMode = 'hover',
  showHandlebar = true,
  autoplay = false,
  autoplayDuration = 5000,
}: CompareProps) {
  const [sliderXPercent, setSliderXPercent] = useState(initialSliderPercentage);
  const [isDragging, setIsDragging] = useState(false);

  const sliderRef = useRef<HTMLDivElement>(null);

  const [isMouseOver, setIsMouseOver] = useState(false);

  const autoplayRef = useRef<NodeJS.Timeout | null>(null);

  const startAutoplay = useCallback(() => {
    if (!autoplay) return;

    const startTime = Date.now();
    const animate = () => {
      const elapsedTime = Date.now() - startTime;
      const progress = (elapsedTime % (autoplayDuration * 2)) / autoplayDuration;
      const percentage = progress <= 1 ? progress * 100 : (2 - progress) * 100;

      setSliderXPercent(percentage);
      autoplayRef.current = setTimeout(animate, 16); // ~60fps
    };

    animate();
  }, [autoplay, autoplayDuration]);

  const stopAutoplay = useCallback(() => {
    if (autoplayRef.current) {
      clearTimeout(autoplayRef.current);
      autoplayRef.current = null;
    }
  }, []);

  useEffect(() => {
    startAutoplay();
    return () => stopAutoplay();
  }, [startAutoplay, stopAutoplay]);

  function mouseEnterHandler() {
    setIsMouseOver(true);
    stopAutoplay();
  }

  function mouseLeaveHandler() {
    setIsMouseOver(false);
    if (slideMode === 'hover') {
      setSliderXPercent(initialSliderPercentage);
    }
    if (slideMode === 'drag') {
      setIsDragging(false);
    }
    startAutoplay();
  }

  const handleStart = useCallback(
    (clientX: number) => {
      if (slideMode === 'drag') {
        setIsDragging(true);
      }
    },
    [slideMode],
  );

  const handleEnd = useCallback(() => {
    if (slideMode === 'drag') {
      setIsDragging(false);
    }
  }, [slideMode]);

  const handleMove = useCallback(
    (clientX: number) => {
      if (!sliderRef.current) return;
      if (slideMode === 'hover' || (slideMode === 'drag' && isDragging)) {
        const rect = sliderRef.current.getBoundingClientRect();
        const x = clientX - rect.left;
        const percent = (x / rect.width) * 100;
        requestAnimationFrame(() => {
          setSliderXPercent(Math.max(0, Math.min(100, percent)));
        });
      }
    },
    [slideMode, isDragging],
  );

  const handleMouseDown = useCallback((e: React.MouseEvent) => handleStart(e.clientX), [handleStart]);
  const handleMouseUp = useCallback(() => handleEnd(), [handleEnd]);
  const handleMouseMove = useCallback((e: React.MouseEvent) => handleMove(e.clientX), [handleMove]);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (!autoplay) {
        handleStart(e.touches[0].clientX);
      }
    },
    [handleStart, autoplay],
  );

  const handleTouchEnd = useCallback(() => {
    if (!autoplay) {
      handleEnd();
    }
  }, [handleEnd, autoplay]);

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!autoplay) {
        handleMove(e.touches[0].clientX);
      }
    },
    [handleMove, autoplay],
  );

  return (
    <div
      ref={sliderRef}
      className={cn('relative inline-block cursor-col-resize', className)}
      onMouseMove={handleMouseMove}
      onMouseLeave={mouseLeaveHandler}
      onMouseEnter={mouseEnterHandler}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchMove={handleTouchMove}
    >
      <img
        src={secondImage || firstImage}
        alt='reference'
        className='invisible block h-auto w-auto max-h-full max-w-full select-none'
        draggable={false}
      />

      <AnimatePresence initial={false}>
        <motion.div
          className='absolute top-0 z-30 m-auto h-full w-px bg-color-main'
          style={{
            left: `${sliderXPercent}%`,
            top: '0',
            zIndex: 40,
          }}
          transition={{ duration: 0 }}
        >
          {showHandlebar && (
            <div className='absolute -right-2.5 top-1/2 z-30 flex h-12 w-3 -translate-x-1 -translate-y-1/2 items-center justify-center bg-color-main shadow-lg'>
              <div className='h-4 w-4 text-black' />
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className='pointer-events-none absolute inset-0 z-20 overflow-hidden'>
        <AnimatePresence initial={false}>
          {firstImage ? (
            <motion.div
              className={cn(
                'absolute inset-0 z-20 h-full w-full flex-shrink-0 select-none overflow-hidden',
                firstImageClassName,
              )}
              style={{
                clipPath: `inset(0 ${100 - sliderXPercent}% 0 0)`,
              }}
              transition={{ duration: 0 }}
            >
              <img
                alt='first image'
                src={firstImage}
                className={cn('h-full w-full select-none object-contain', firstImageClassName)}
                draggable={false}
              />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      <AnimatePresence initial={false}>
        {secondImage ? (
          <motion.img
            className={cn('absolute inset-0 z-[19] h-full w-full select-none object-contain', secondImageClassname)}
            alt='second image'
            src={secondImage}
            draggable={false}
          />
        ) : null}
      </AnimatePresence>
    </div>
  );
}

export default React.memo(ImagesCompare);
