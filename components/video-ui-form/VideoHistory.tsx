'use client';

/* eslint-disable @typescript-eslint/indent */
/* eslint-disable react/jsx-indent */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { forwardRef, useContext, useEffect, useState } from 'react';
import useVideoHistory, { VideoRequestType, VideoResponseType, refreshVideoHistory } from '@/network/video/useVideoHistory';
import { deleteVideoById } from '@/network/video/client';
import useVideoFormStore from '@/store/form/useVideoFormStore';
import { Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { cn } from '@/lib/utils';
import { numberList } from '@/lib/utils/arrayUtils';
import useFormatPastTime from '@/hooks/utils/useFormatPastTime';
import FailurePlaceholder from '@/components/ui/failure-placeholder';

import Spinning from '../Spinning';
import Scroll, { ScrollRef } from './shared/scroll';
import { videoTypeContenxt, showAllVideoHistoryContext } from './VideoContenxtProvider';

function VideoItem({
  imgSrc,
  onClick,
  createTime,
  status,
  onDelete,
}: {
  imgSrc: string;
  onClick: () => void;
  createTime: number;
  status: VideoResponseType['status'];
  onDelete?: () => void;
}) {
  const formatPastTime = useFormatPastTime();
  if (status === 'pending' || status === 'processing') {
    return (
      <div
        className={cn(
          'relative flex h-[130px] w-[195px] shrink-0 items-center justify-center rounded-lg border border-[#303030] bg-[#2a2b2f]',
        )}
      >
        <Spinning />
      </div>
    );
  }
  if (status === 'fail') {
    return (
      <div className='relative h-[130px] w-[195px] shrink-0'>
        <FailurePlaceholder className='h-full' iconSize={32} />
        {onDelete && (
          <button
            type='button'
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className='absolute right-1 top-1 z-20 flex size-6 items-center justify-center rounded-lg bg-black/50 text-white backdrop-blur-sm hover:bg-black/70'
          >
            <Trash2 className='size-4' />
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      className={cn(
        'group relative flex h-[130px] shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-[#2a2b2f] transition-all duration-200 hover:bg-[#323339]',
      )}
      onClick={onClick}
    >
      <img
        src={imgSrc}
        alt='imgSrc'
        className='h-full w-auto bg-contain transition-all duration-200 group-hover:scale-110'
        loading='lazy'
        decoding='async'
        fetchPriority='high'
      />
      <div className='absolute bottom-0 left-0 flex items-center justify-center rounded-tr-lg rounded-bl-lg bg-[rgba(128,128,128,0.5)] p-2.5 py-1 text-xs text-white backdrop-blur'>
        {formatPastTime(createTime)}
      </div>
    </div>
  );
}

interface VideoHistoryProps {
  onClickImage?: () => void;
  onScrollChange?: (scrollLeft: number) => void;
}

const VideoHistory = forwardRef<ScrollRef, VideoHistoryProps>(({ onClickImage, onScrollChange }, ref) => {
  const videoTypeTemp = useContext(videoTypeContenxt);
  const showAllVideoHistory = useContext(showAllVideoHistoryContext);

  const videoType = showAllVideoHistory ? undefined : videoTypeTemp;

  const updateVideoObj = useVideoFormStore((state) => state.updateVideoObj);
  const [pageNum] = useState(1);
  const { data, isLoading } = useVideoHistory({ pageNum, pageSize: 30, videoType: videoType as VideoRequestType['videoType'] });

  const hasData = !!data && data.length > 0;

  const t = useTranslations('components.video-form.history');
  const resetDefault = useVideoFormStore((state) => state.resetDefault);

  // 当 videoType 变化时，重置为默认预设视频
  useEffect(() => {
    resetDefault();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoType]);

  const handleClickImg = (videoData: NonNullable<typeof data>[number]) => {
    // 如果视频失败或没有videoUrl，不处理点击
    if (videoData.status === 'fail' || !videoData.videoUrl) {
      return;
    }

    updateVideoObj({
      id: videoData.id,
      name: videoData.videoUrl.split('/').pop()!,
      videoSrc: videoData.videoUrl,
      posterSrc: videoData.videoThumbnailUrl,
      coverImg: videoData.coverImage || videoData.videoThumbnailUrl, // 供详情弹窗/展示使用
      model: '', // TODO: video model
      platformName: videoData.platformName, // 详情弹窗的 ModelTag 依赖它
      ratio: videoData.ratio, // 详情弹窗的 ratio 依赖它
      duration: videoData.duration, // 详情弹窗的 duration 依赖它
      createTime: videoData.createTime, // 详情弹窗的 generatedTime 依赖它
      isAllowExtend: !!videoData.isAllowExtend,
      prompt: videoData.prompt,
      startFrame: videoData.imageUrl,
      endFrame: videoData.imageEndUrl,
    });

    if (onClickImage) {
      onClickImage();
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await deleteVideoById(id);
      if (res.code === 200) {
        toast.success(res.msg || t('deleteSuccess'));
        refreshVideoHistory();
      } else {
        toast.error(res.msg || t('deleteFailed'));
      }
    } catch (error) {
      toast.error(t('deleteFailed'));
    }
  };

  return (
    <Scroll ref={ref} onScrollChange={onScrollChange}>
      {!isLoading && !hasData && (
        <div className='flex h-[130px] w-[195px] shrink-0 items-center justify-center rounded-lg border border-[#303030] bg-[#2a2b2f]'>
          <div className='text-sm font-normal text-[#b8b8b8]'>{t('noHistory')}</div>
        </div>
      )}
      {isLoading &&
        numberList(8).map((num) => (
          <div
            key={num}
            className='size-[130px] shrink-0 animate-pulse rounded-lg border border-[#303030] bg-[#2a2b2f]'
          />
        ))}
      {!isLoading &&
        hasData &&
        data.map((el) => (
          <VideoItem
            key={el.id}
            imgSrc={el.coverImage || el.imageUrl}
            onClick={() => handleClickImg(el)}
            createTime={el.createTime}
            status={el.status}
            onDelete={el.status === 'fail' ? () => handleDelete(el.id) : undefined}
          />
        ))}
    </Scroll>
  );
});

VideoHistory.displayName = 'VideoHistory';

export default VideoHistory;
