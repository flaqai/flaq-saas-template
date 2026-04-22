'use client';

import { useContext } from 'react';
import useVideoHistory, { pageSize, VideoRequestType } from '@/network/video/useVideoHistory';
import useMobileVideoHistoryButttonStore from '@/store/video/useMobileVideoHistoryButttonStore';
import { ChevronRight, CircleX } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { cn } from '@/lib/utils';
import useIsMobile from '@/hooks/useIsMobile';

import { videoTypeContenxt } from './VideoContenxtProvider';

export default function VideoMobileButton() {
  const t = useTranslations('components.video-form.bottom-button');
  const videoType = useContext(videoTypeContenxt);
  const setOpen = useMobileVideoHistoryButttonStore((state) => state.setOpen);
  const showBtn = useMobileVideoHistoryButttonStore((state) => state.showBtn);
  const setShowBtn = useMobileVideoHistoryButttonStore((state) => state.setShowBtn);
  const isMobile = useIsMobile();

  const { data } = useVideoHistory({ videoType: videoType as VideoRequestType['videoType'], pageNum: 1, pageSize });

  const hasVideoProcess = !!data?.some((item) => item.status === 'processing' || item.status === 'pending');

  return (
    <div
      className={cn(
        'fixed bottom-0 z-50 h-14 w-full -translate-x-3 bg-color-main p-1 text-white',
        !showBtn && 'hidden',
        !isMobile && 'hidden',
        hasVideoProcess && 'text-color-main',
      )}
    >
      <button
        className={cn(
          'flex h-full w-full items-center border border-color-main bg-transparent p-3 text-left',
          !hasVideoProcess && 'bg-color-main',
        )}
        type='button'
        onClick={() => setOpen(true)}
      >
        {hasVideoProcess ? t('processing') : t('complete')}
        <ChevronRight className='size-5' strokeWidth={1} />
      </button>
      <button type='button' className='absolute right-3 top-1/2 -translate-y-1/2' onClick={() => setShowBtn(false)}>
        <CircleX className='size-5' strokeWidth={1} />
      </button>
    </div>
  );
}
