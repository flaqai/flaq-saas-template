'use client';

import { type CSSProperties, useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

import useImageHistory, { type ImageHistoryItem } from '@/network/image/history';
import useVideoHistory, { type VideoHistoryItem } from '@/network/video/history';

import CreatorVideoPreview from './CreatorVideoPreview';
import CreatorHistoryColumnControl from './CreatorHistoryColumnControl';

type HistoryType = 'image' | 'video';

const PAGE_SIZE = 12;
const ImageDetailModal = dynamic(() => import('@/components/dialog/ImageDetailModal'), { ssr: false });
const VideoDetailModal = dynamic(() => import('@/components/dialog/VideoDetailModal'), { ssr: false });

export default function CreatorHistory() {
  const t = useTranslations('CreatorHistory');
  const [type, setType] = useState<HistoryType>('video');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [desktopColumns, setDesktopColumns] = useState(4);
  const [mobileColumns, setMobileColumns] = useState(2);
  const [selectedImage, setSelectedImage] = useState<ImageHistoryItem | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<VideoHistoryItem | null>(null);
  const historyScrollRef = useRef<HTMLDivElement>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const imageHistory = useImageHistory(1, visibleCount);
  const videoHistory = useVideoHistory({ pageNum: 1, pageSize: visibleCount });
  const history = type === 'image' ? imageHistory : videoHistory;
  const hasMore = history.data.length < history.total;

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
    historyScrollRef.current?.scrollTo({ top: 0 });
  }, [type]);

  useEffect(() => {
    const target = loadMoreRef.current;
    if (!target || !historyScrollRef.current || !hasMore) return undefined;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0]?.isIntersecting) {
        setVisibleCount((count) => Math.min(count + PAGE_SIZE, history.total));
      }
    }, { root: historyScrollRef.current, rootMargin: '320px 0px', threshold: 0.01 });
    observer.observe(target);
    return () => observer.disconnect();
  }, [hasMore, history.total, visibleCount, type]);

  return (
    <section className='flex max-h-[calc(100dvh-64px)] min-h-0 flex-col gap-3 rounded-xl border border-color-b1 bg-black p-3'>
      <div className='flex shrink-0 flex-wrap items-center justify-between gap-3'>
        <div>
          <h2 className='text-xl font-semibold text-white'>{t('title')}</h2>
          <p className='mt-1 text-sm text-white/45'>{t('description')}</p>
        </div>
        <div className='flex flex-wrap items-center gap-3'>
          <CreatorHistoryColumnControl value={desktopColumns} onChange={setDesktopColumns} decreaseLabel={t('decrease-columns')} increaseLabel={t('increase-columns')} valueLabel={t('column-count', { count: desktopColumns })} />
          <div className='lg:hidden'>
            <CreatorHistoryColumnControl compact value={mobileColumns} onChange={setMobileColumns} minColumns={1} maxColumns={4} decreaseLabel={t('decrease-columns')} increaseLabel={t('increase-columns')} valueLabel={t('column-count', { count: mobileColumns })} />
          </div>
          <div className='flex rounded-xl border border-white/10 bg-black/20 p-1'>
            {(['video', 'image'] as const).map((historyType) => (
              <button
                key={historyType}
                type='button'
                className={`rounded-lg px-3 py-1.5 text-sm ${type === historyType ? 'bg-white text-black' : 'text-white/50'}`}
                onClick={() => setType(historyType)}
              >
                {t(historyType)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div ref={historyScrollRef} className='custom-scrollbar min-h-0 touch-pan-y overflow-y-auto overscroll-contain pr-1'>
        {history.data.length ? (
          <div className='columns-[var(--history-mobile-columns)] gap-3 lg:columns-[var(--history-desktop-columns)]' style={{ '--history-mobile-columns': mobileColumns, '--history-desktop-columns': desktopColumns } as CSSProperties}>
            {type === 'image'
              ? imageHistory.data.map((item) => {
                const src = item.thumbnailUrl || item.url;
                const card = (
                  <div className='group relative overflow-hidden rounded-xl border border-white/10 bg-white/5'>
                    {src ? (
                      <img src={src} alt={item.prompt} loading='lazy' className='h-auto w-full' />
                    ) : (
                      <div className='flex aspect-square items-center justify-center text-white/30'>
                        {item.status === 'processing' ? null : t('no-preview')}
                      </div>
                    )}
                    {item.status === 'processing' ? (
                      <div className='pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-black/40 text-white' aria-busy='true'>
                        <Loader2 className='size-6 animate-spin' />
                      </div>
                    ) : null}
                    <div className='absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-3 pt-10'>
                      <p className='line-clamp-2 text-xs text-white/80'>{item.prompt}</p>
                    </div>
                  </div>
                );
                return item.url && item.status !== 'processing' && item.status !== 'fail' ? (
                  <button key={item.id} type='button' className='mb-3 block w-full break-inside-avoid cursor-pointer text-left' onClick={() => setSelectedImage(item)}>{card}</button>
                ) : <div key={item.id} className='mb-3 break-inside-avoid'>{card}</div>;
              })
              : videoHistory.data.map((item) => {
                const card = (
                  <div className='group relative aspect-video overflow-hidden rounded-xl border border-white/10 bg-white/5'>
                    <CreatorVideoPreview item={item} noPreviewLabel={t('no-preview')} />
                    {item.status === 'processing' || item.status === 'pending' ? (
                      <div className='pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-black/40 text-white' aria-busy='true'>
                        <Loader2 className='size-6 animate-spin' />
                      </div>
                    ) : null}
                    <div className='absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-3 pt-10'>
                      <p className='line-clamp-2 text-xs text-white/80'>{item.prompt}</p>
                    </div>
                  </div>
                );
                return item.videoUrl && item.status === 'completed' ? (
                  <button key={item.id} type='button' className='mb-3 block w-full break-inside-avoid cursor-pointer text-left' onClick={() => setSelectedVideo(item)}>{card}</button>
                ) : <div key={item.id} className='mb-3 break-inside-avoid'>{card}</div>;
              })}
          </div>
        ) : (
          <div className='flex min-h-44 items-center justify-center rounded-2xl border border-dashed border-white/10 text-sm text-white/35'>
            {t('empty')}
          </div>
        )}

        <div ref={loadMoreRef} className='flex h-8 items-center justify-center text-xs text-white/35'>
          {hasMore ? t('loading-more') : history.data.length ? t('end') : null}
        </div>
      </div>
      {selectedImage && (
        <ImageDetailModal
          open
          onOpenChange={(open) => {
            if (!open) setSelectedImage(null);
          }}
          onDelete={() => setSelectedImage(null)}
          image={{ ...selectedImage, modelName: selectedImage.modelInfo || selectedImage.modelName }}
        />
      )}
      {selectedVideo && (
        <VideoDetailModal
          open
          onOpenChange={(open) => {
            if (!open) setSelectedVideo(null);
          }}
          onDelete={() => setSelectedVideo(null)}
          video={selectedVideo}
        />
      )}
    </section>
  );
}
