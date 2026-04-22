'use client';

/* eslint-disable consistent-return */
import { ComponentProps, useEffect, useRef } from 'react';

export default function InViewPlayVideo({ src, ...props }: ComponentProps<'video'>) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const videoEl = videoRef.current;

    if (!videoEl) return;

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          videoEl.play();
        } else {
          videoEl.pause();
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, {
      threshold: 0.5,
    });

    if (videoEl) {
      observer.observe(videoEl);
    }

    return () => {
      if (videoEl) {
        observer.unobserve(videoEl);
      }
      observer.disconnect();
    };
  }, []);

  return <video ref={videoRef} src={src} muted loop playsInline {...props} />;
}
