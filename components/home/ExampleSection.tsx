'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from '@/i18n/navigation';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, Copy, Check } from 'lucide-react';
import SubHeading from '../internal-page/sub-heading';
import YouTubeVideo, { YouTubeProps, YouTubePlayer } from 'react-youtube';
import useDefaultModalStore from '@/store/useDefaultModalStore';

export interface ExampleSectionProps {
  title: string;
  description: string;
  imageExamplesTitle: string;
  imageExamplesDescription: string;
  videoExamplesTitle: string;
  videoExamplesDescription: string;
  promptLabel: string;
  images: Array<{ src: string; prompt: string }>;
  videos: Array<{ src: string; prompt: string }>;
  autoPlay?: boolean;
}

export default function ExampleSection({
  title,
  description,
  imageExamplesTitle,
  imageExamplesDescription,
  videoExamplesTitle,
  videoExamplesDescription,
  promptLabel,
  images,
  videos,
  autoPlay = true,
}: ExampleSectionProps) {
  const router = useRouter();
  const updateDefaultStore = useDefaultModalStore((state) => state.updateDefaultStore);

  // Extract video ID from YouTube URL
  const getVideoId = (url: string): string => {
    const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/;
    const match = url.match(regex);
    return match ? match[1] : '';
  };

  const imageScrollRef = useRef<HTMLDivElement>(null);
  const imageItemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const isScrollingRef = useRef(false);
  const isManualScrollRef = useRef(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [videoCurrentIndex, setVideoCurrentIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const playerRefs = useRef<(YouTubePlayer | null)[]>([]);

  // 点击图片跳转到 AI 图片生成页面并填充 prompt
  const handleImageClick = (prompt: string) => {
    updateDefaultStore({ prompt });
    router.push('/text-to-image');
  };

  // 初始化滚动位置到中间组
  useEffect(() => {
    const container = imageScrollRef.current;
    if (!container || images.length === 0) return;

    // 一开始就阻止 scroll 监听
    isScrollingRef.current = true;

    const initScroll = () => {
      const middleGroupStartIndex = images.length;
      const firstItem = imageItemRefs.current[middleGroupStartIndex];
      if (firstItem) {
        const containerWidth = container.clientWidth;
        const itemCenter = firstItem.offsetLeft + firstItem.offsetWidth / 2;
        container.scrollLeft = itemCenter - containerWidth / 2;
        setCurrentImageIndex(0);

        // 初始化完成后重置标志
        setTimeout(() => {
          isScrollingRef.current = false;
        }, 50);
      } else {
        // 如果元素还没准备好，继续重试
        setTimeout(initScroll, 50);
      }
    };

    const timer = setTimeout(initScroll, 100);

    const handleResize = () => {
      clearTimeout(timer);
      setTimeout(initScroll, 100);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
    };
  }, [images]);

  // 图片无缝循环滚动监听 - 改进版本
  useEffect(() => {
    const container = imageScrollRef.current;
    if (!container || images.length === 0) return;

    let scrollEndTimer: NodeJS.Timeout | null = null;

    const handleScroll = () => {
      // 如果是手动滚动或正在调整位置，跳过
      if (isScrollingRef.current || isManualScrollRef.current) return;

      // 清除之前的定时器
      if (scrollEndTimer) clearTimeout(scrollEndTimer);

      // 滚动停止后 100ms 再检查并跳转
      scrollEndTimer = setTimeout(() => {
        const scrollLeft = container.scrollLeft;
        const clientWidth = container.clientWidth;
        const centerPosition = scrollLeft + clientWidth / 2;

        // 找到当前中心位置最近的图片
        let currentIdx = 0;
        let currentEl: HTMLDivElement | null = null;
        let minDist = Infinity;
        for (let i = 0; i < imageItemRefs.current.length; i++) {
          const el = imageItemRefs.current[i];
          if (!el) continue;
          const elCenter = el.offsetLeft + el.offsetWidth / 2;
          const dist = Math.abs(elCenter - centerPosition);
          if (dist < minDist) {
            minDist = dist;
            currentIdx = i;
            currentEl = el;
          }
        }

        if (!currentEl) return;

        const oneSetLength = images.length;

        // 判断是否需要跳转
        if (currentIdx >= oneSetLength * 2 || currentIdx < oneSetLength) {
          // 计算在当前图片内的相对偏移
          const elCenter = currentEl.offsetLeft + currentEl.offsetWidth / 2;
          const offsetFromCenter = centerPosition - elCenter;

          // 目标是第二组对应的图片
          const normalizedIdx = currentIdx % oneSetLength;
          const targetIdx = oneSetLength + normalizedIdx;
          const targetEl = imageItemRefs.current[targetIdx];
          if (!targetEl) return;

          // 计算新的 scrollLeft，保持相同的相对偏移
          const targetCenter = targetEl.offsetLeft + targetEl.offsetWidth / 2;
          container.scrollLeft = targetCenter + offsetFromCenter - clientWidth / 2;
        }
      }, 100);
    };

    container.addEventListener('scroll', handleScroll);
    return () => {
      container.removeEventListener('scroll', handleScroll);
      if (scrollEndTimer) clearTimeout(scrollEndTimer);
    };
  }, [images]);

  // 图片自动滚动
  useEffect(() => {
    if (!autoPlay) return;

    const scrollContainer = imageScrollRef.current;
    if (!scrollContainer) return;

    const autoScroll = () => {
      const scrollAmount = 1;
      scrollContainer.scrollLeft += scrollAmount;
    };

    const intervalId = setInterval(autoScroll, 30);

    return () => clearInterval(intervalId);
  }, [autoPlay]);

  // 视频自动切换
  useEffect(() => {
    if (!autoPlay) return;

    const intervalId = setInterval(() => {
      setVideoCurrentIndex((prev) => (prev + 1) % videos.length);
    }, 10000);

    return () => clearInterval(intervalId);
  }, [videos.length, autoPlay]);

  // 图片轮播控制 - 极简版
  const goToPreviousImage = () => {
    const container = imageScrollRef.current;
    if (!container) return;
    const firstItem = imageItemRefs.current[0];
    if (!firstItem) return;
    const itemWidth = firstItem.offsetWidth + 12;
    container.scrollBy({ left: -itemWidth, behavior: 'smooth' });
  };

  const goToNextImage = () => {
    const container = imageScrollRef.current;
    if (!container) return;
    const firstItem = imageItemRefs.current[0];
    if (!firstItem) return;
    const itemWidth = firstItem.offsetWidth + 12;
    container.scrollBy({ left: itemWidth, behavior: 'smooth' });
  };

  // 视频切换时停止当前播放的视频并重置播放状态
  const stopCurrentVideo = () => {
    const currentPlayer = playerRefs.current[videoCurrentIndex];
    if (currentPlayer && typeof currentPlayer.stopVideo === 'function') {
      currentPlayer.stopVideo();
    }
  };

  // 视频轮播控制
  const goToPreviousVideo = () => {
    stopCurrentVideo();
    setVideoCurrentIndex((prev) => (prev - 1 + videos.length) % videos.length);
  };

  const goToNextVideo = () => {
    stopCurrentVideo();
    setVideoCurrentIndex((prev) => (prev + 1) % videos.length);
  };

  return (
    <section className='relative w-full py-15 bg-black'>
      {/* 主标题和描述 */}
      <SubHeading title={title} description={description} />

      {/* 图片示例部分 */}
      <div className='mt-9'>
        {/* 标题和导航按钮 */}
        <div className='mx-auto max-w-[1200px] px-4 flex items-start justify-between'>
          <div className="flex flex-col items-start text-left mx-0">
            <h2 className="text-[18px] font-semibold text-white md:text-[18px] md:leading-[26px] md:tracking-[0.36px]">
              {imageExamplesTitle}
            </h2>
            {imageExamplesDescription && (
              <p className="mt-1 text-[14px] font-normal text-[#B8B8B8]">
                {imageExamplesDescription}
              </p>
            )}
          </div>

          {/* 切换按钮 */}
          <div className='flex items-center gap-3'>
            <button
              onClick={goToPreviousImage}
              className='flex items-center justify-center w-12 h-12 rounded-full bg-[#1C1D23] text-white transition hover:bg-[#2C2D33]'
              aria-label='Previous image'
            >
              <ChevronLeft className='w-[18px] h-[18px]' />
            </button>
            <button
              onClick={goToNextImage}
              className='flex items-center justify-center w-12 h-12 rounded-full bg-[#1C1D23] text-white transition hover:bg-[#2C2D33]'
              aria-label='Next image'
            >
              <ChevronRight className='w-[18px] h-[18px]' />
            </button>
          </div>
        </div>

        {/* 图片轮播容器 */}
        <div
          ref={imageScrollRef}
          className='mt-3 overflow-x-scroll overflow-y-hidden [&::-webkit-scrollbar]:hidden'
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          <div className='flex gap-3'>
            {[...images, ...images, ...images].map((item, index) => (
              <div
                key={`image-${index}`}
                ref={(el) => {
                  imageItemRefs.current[index] = el;
                }}
                className='relative group h-[200px] max-w-[85vw] flex-shrink-0 cursor-pointer md:h-[360px] md:max-w-none lg:h-[440px]'
                onClick={() => handleImageClick(item.prompt)}
              >
                <div className='relative h-full overflow-hidden rounded-xl bg-[#383838]'>
                  <img
                    src={item.src}
                    alt={`Example ${index + 1}`}
                    className='h-full w-auto object-cover transition-transform duration-500 group-hover:scale-105'
                    loading='eager'
                  />

                  {/* 底部渐变遮罩和 Prompt */}
                  <div className='absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent transition-all duration-300 opacity-0 group-hover:opacity-100 px-4 pb-4 pt-20'>
                    <p className='text-xs text-white/90 line-clamp-4 leading-relaxed'>
                      {item.prompt}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 视频示例部分 */}
      <div className='mt-9 mx-auto max-w-[1200px] px-4'>
        {/* 标题和导航按钮 */}
        <div className='flex items-start justify-between'>
          <div className='flex flex-col items-start text-left mx-0'>
            <h3 className='text-[18px] font-semibold text-white md:text-[18px] md:leading-[26px] md:tracking-[0.36px]'>{videoExamplesTitle}</h3>
            <p className='mt-1 text-[14px] font-normal text-[#B8B8B8]'>
              {videoExamplesDescription}
            </p>
          </div>

          {/* 切换按钮 */}
          <div className='flex items-center gap-3'>
            <button
              onClick={goToPreviousVideo}
              className='flex items-center justify-center w-12 h-12 rounded-full bg-[#1C1D23] text-white transition hover:bg-[#2C2D33]'
              aria-label='Previous video'
            >
              <ChevronLeft className='w-[18px] h-[18px]' />
            </button>
            <button
              onClick={goToNextVideo}
              className='flex items-center justify-center w-12 h-12 rounded-full bg-[#1C1D23] text-white transition hover:bg-[#2C2D33]'
              aria-label='Next video'
            >
              <ChevronRight className='w-[18px] h-[18px]' />
            </button>
          </div>
        </div>

        {/* 视频内容区域 */}
        <div className='mt-3 grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6'>
          {/* YouTube 播放器 */}
          <div className='relative overflow-hidden rounded-xl bg-[#383838] aspect-video'>
            {videos.map((video, index) => (
              <div
                key={index}
                className={cn(
                  'absolute inset-0 transition-opacity duration-300',
                  index === videoCurrentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
                )}
              >
                <YouTubeVideo
                  videoId={getVideoId(video.src)}
                  opts={{
                    width: '100%',
                    height: '100%',
                    playerVars: {
                      autoplay: 0,
                      controls: 1,
                      rel: 0,
                      showinfo: 0,
                    },
                  } as YouTubeProps['opts']}
                  className='w-full h-full'
                  onReady={(event) => {
                    playerRefs.current[index] = event.target;
                  }}
                />
              </div>
            ))}
          </div>

          {/* 视频信息和Prompt */}
          <div className='flex flex-col gap-4 rounded-xl bg-[#16171B] p-4'>
            {/* Prompt 标题和复制按钮 */}
            <div className='flex items-center justify-start gap-3'>
              <p className='text-sm font-medium text-white'>{promptLabel}</p>
              <button
                type='button'
                className='flex items-center gap-2 text-xs text-white/70 transition hover:text-white cursor-pointer'
                onClick={() => {
                  navigator.clipboard.writeText(videos[videoCurrentIndex].prompt);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
              >
                {copied ? <Check className='w-4 h-4 text-green-500' /> : <Copy className='w-4 h-4' />}
              </button>
            </div>

            {/* 视频Prompt */}
            <p className='text-xs text-white/70 line-clamp-10'>
              {videos[videoCurrentIndex].prompt}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
