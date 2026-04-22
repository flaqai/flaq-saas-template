'use client';

/* eslint-disable jsx-a11y/control-has-associated-label */
import { useEffect, useRef, useState } from 'react';

import { cn } from '@/lib/utils';
import { numberList } from '@/lib/utils/arrayUtils';
import useInView from '@/hooks/useInView';

const list = numberList(4);

function VideoList({
  selectedVideoId,
  setSelectedVideoId,
  className,
}: {
  selectedVideoId: number;
  setSelectedVideoId: (id: number) => void;
  className?: string;
}) {
  // const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollContainerRef, inView] = useInView();

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;

    if (scrollContainer && inView) {
      const selectedButton = scrollContainer.querySelector(`button:nth-child(${selectedVideoId})`);
      selectedButton?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [scrollContainerRef, selectedVideoId, inView]);

  return (
    <div
      ref={scrollContainerRef}
      className={cn(
        'no-scrollbar flex w-full gap-1 overflow-x-auto scroll-smooth rounded-lg lg:items-center lg:justify-center lg:overflow-x-hidden',
        className,
      )}
    >
      {list.map((num) => (
        <button
          key={num}
          type='button'
          onClick={() => setSelectedVideoId(num)}
          className={cn('mt-auto shrink-0 snap-center', selectedVideoId === num ? 'z-10' : 'z-0')}
        >
          <img
            src={`https://c.topshort.org/fluxpro/home/image/${num}.webp`}
            alt={num.toString()}
            className={cn(
              'h-[60px] w-[107px] rounded-lg border border-transparent transition-all duration-100 ease-linear',
              selectedVideoId === num
                ? 'border-white lg:h-[90px] lg:w-[160px] lg:border-transparent'
                : 'hover:scale-105',
            )}
          />
        </button>
      ))}
    </div>
  );
}

export default function HeroSection() {
  const [selectedVideoId, setSelectedVideoId] = useState(1);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const videoEl = videoRef.current;
    const sectionEl = sectionRef.current;

    const playNextVideo = () => {
      setIsVideoReady(false);
      setSelectedVideoId(selectedVideoId === list.length ? 1 : selectedVideoId + 1);
    };

    const onCanPlay = () => {
      setIsVideoReady(true);
      videoEl?.play();
    };

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          videoEl?.play();
        } else {
          videoEl?.pause();
        }
      });
    };

    videoEl?.addEventListener('canplay', onCanPlay);
    videoEl?.addEventListener('ended', playNextVideo);

    const observer = new IntersectionObserver(handleIntersection, {
      threshold: 0.3,
    });

    if (sectionEl) {
      observer.observe(sectionEl);
    }

    // Play video immediately if it's already loaded
    if (videoEl && videoEl?.readyState >= 3) {
      videoEl.play();
    }

    return () => {
      videoEl?.removeEventListener('ended', playNextVideo);
      videoEl?.removeEventListener('canplay', onCanPlay);
      if (sectionEl) {
        observer.unobserve(sectionEl);
      }
      observer.disconnect();
    };
  }, [selectedVideoId]);

  return (
    <section
      ref={sectionRef}
      className='mx-auto mb-[110px] flex w-full flex-col items-center gap-5 px-3 lg:mb-16 lg:px-0'
    >
      <div className='relative mx-auto flex w-full items-center justify-center lg:w-[960px]'>
        <img
          src={`https://c.topshort.org/fluxpro/home/image/${selectedVideoId}.webp`}
          alt={`Poster for video ${selectedVideoId}`}
          className={cn(
            'absolute inset-0 h-[198px] w-full rounded-xl object-cover lg:h-[540px]',
            isVideoReady ? 'hidden' : 'block',
          )}
        />
        <video
          ref={videoRef}
          muted
          playsInline
          autoPlay
          src={`https://c.topshort.org/fluxpro/home/video/${selectedVideoId}.mp4`}
          className='h-[198px] w-full rounded-xl bg-black lg:h-[540px]'
        />
        <VideoList
          selectedVideoId={selectedVideoId}
          setSelectedVideoId={setSelectedVideoId}
          className='absolute -bottom-10 left-0 w-full translate-y-full lg:-bottom-3 lg:mx-auto lg:px-3'
        />
      </div>
    </section>
  );
}
