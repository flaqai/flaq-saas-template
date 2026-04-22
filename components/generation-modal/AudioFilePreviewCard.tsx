'use client';

import { useEffect, useRef, useState, useContext, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { Pause, Play, Trash2, Scissors, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { videoAudioContext } from '@/components/video-ui-form/VideoContenxtProvider';

interface AudioFilePreviewCardProps {
  file: File;
  onDelete: () => void;
  onDurationChange?: (duration: number) => void;
  onTrimChange?: (startTime: number, endTime: number) => void;
}

export default function AudioFilePreviewCard({
  file,
  onDelete,
  onDurationChange,
  onTrimChange,
}: AudioFilePreviewCardProps) {
  const t = useTranslations('components.audio-modal');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string>('');
  const [showTrimmer, setShowTrimmer] = useState(false);
  const [waveformData, setWaveformData] = useState<number[]>([]);
  const [isGeneratingWaveform, setIsGeneratingWaveform] = useState(false);

  // 裁剪状态持久化
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [isDraggingStart, setIsDraggingStart] = useState(false);
  const [isDraggingEnd, setIsDraggingEnd] = useState(false);

  // 进度指示器拖动状态
  const [isDraggingProgress, setIsDraggingProgress] = useState(false);
  const [isProgressHandleHovered, setIsProgressHandleHovered] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const waveformContainerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const justFinishedDraggingRef = useRef(false);

  const audioContext = useContext(videoAudioContext);

  // 生成波形数据（始终生成，用于默认显示）
  const generateWaveform = useCallback(async (url: string) => {
    setIsGeneratingWaveform(true);
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);

      const rawData = audioBuffer.getChannelData(0);
      const samples = 100;
      const blockSize = Math.floor(rawData.length / samples);
      const filteredData: number[] = [];

      for (let i = 0; i < samples; i += 1) {
        const blockStart = blockSize * i;
        let sum = 0;
        for (let j = 0; j < blockSize; j += 1) {
          sum += Math.abs(rawData[blockStart + j]);
        }
        filteredData.push(sum / blockSize);
      }

      const normalizedData = filteredData.map((n) => n / Math.max(...filteredData));
      setWaveformData(normalizedData);
      audioCtx.close();
    } catch (error) {
      console.error('Error generating waveform:', error);
    } finally {
      setIsGeneratingWaveform(false);
    }
  }, []);

  // 绘制波形
  const drawWaveform = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || waveformData.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;
    const barWidth = width / waveformData.length;
    const centerY = height / 2;

    canvas.width = width * 2;
    canvas.height = height * 2;
    ctx.scale(2, 2);

    ctx.clearRect(0, 0, width, height);

    waveformData.forEach((value, index) => {
      const x = index * barWidth;
      const barHeight = value * (height * 0.8);

      const time = (index / waveformData.length) * duration;
      const isInRange = !showTrimmer || (time >= startTime && time <= endTime);
      const isPlayed = time <= currentTime;

      if (isInRange) {
        ctx.fillStyle = isPlayed ? '#427cf1' : '#6b9aff';
      } else {
        ctx.fillStyle = '#404040';
      }

      ctx.fillRect(x, centerY - barHeight / 2, barWidth - 1, barHeight);
    });
  }, [waveformData, duration, startTime, endTime, currentTime, showTrimmer]);

  useEffect(() => {
    const url = URL.createObjectURL(file);
    setAudioUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [file]);

  // 始终生成波形（无论是否显示裁剪器）
  useEffect(() => {
    if (audioUrl) {
      generateWaveform(audioUrl);
    }
  }, [audioUrl, generateWaveform]);

  // 动画绘制波形
  useEffect(() => {
    if (waveformData.length > 0) {
      const animate = () => {
        drawWaveform();
        animationFrameRef.current = requestAnimationFrame(animate);
      };
      animate();

      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };
    }
    return undefined;
  }, [waveformData, drawWaveform]);

  // 时间转位置
  const timeToPosition = (time: number) => {
    if (!waveformContainerRef.current || duration === 0) return 0;
    return (time / duration) * waveformContainerRef.current.offsetWidth;
  };

  // 位置转时间
  const positionToTime = (position: number) => {
    if (!waveformContainerRef.current || duration === 0) return 0;
    const ratio = position / waveformContainerRef.current.offsetWidth;
    return Math.max(0, Math.min(duration, ratio * duration));
  };

  // 点击音轨跳转
  const handleWaveformClick = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (isDraggingProgress || isDraggingStart || isDraggingEnd) return;

    // 如果刚刚完成拖动，忽略这次点击
    if (justFinishedDraggingRef.current) {
      justFinishedDraggingRef.current = false;
      return;
    }

    const container = waveformContainerRef.current;
    if (!container || !audioRef.current) return;

    const rect = container.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const x = clientX - rect.left;
    let newTime = positionToTime(x);

    // 如果开启裁剪模式，限制在裁剪区域内
    if (showTrimmer) {
      newTime = Math.max(startTime, Math.min(endTime, newTime));
    }

    audioRef.current.currentTime = newTime;
  };

  // 进度指示器拖动
  const handleProgressHandleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    e.preventDefault();
    document.body.style.userSelect = 'none';
    setIsDraggingProgress(true);
  };

  const handleProgressDragMove = useCallback(
    (e: MouseEvent | TouchEvent) => {
      e.preventDefault();
      if (!waveformContainerRef.current || !audioRef.current) return;

      const rect = waveformContainerRef.current.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const x = clientX - rect.left;
      let newTime = positionToTime(x);

      // 如果开启裁剪模式，限制在裁剪区域内
      if (showTrimmer) {
        newTime = Math.max(startTime, Math.min(endTime, newTime));
      }

      audioRef.current.currentTime = newTime;
    },
    [positionToTime, showTrimmer, startTime, endTime],
  );

  const handleProgressDragEnd = useCallback(() => {
    setIsDraggingProgress(false);
    document.body.style.userSelect = '';
    justFinishedDraggingRef.current = true;
    setTimeout(() => {
      justFinishedDraggingRef.current = false;
    }, 50);
  }, []);

  // 裁剪边界器拖动
  const handleTrimBoundaryMouseDown = (type: 'start' | 'end') => (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    e.preventDefault();
    document.body.style.userSelect = 'none';
    if (type === 'start') {
      setIsDraggingStart(true);
    } else {
      setIsDraggingEnd(true);
    }
  };

  const handleTrimDragMove = useCallback(
    (e: MouseEvent | TouchEvent) => {
      e.preventDefault();
      if (!waveformContainerRef.current) return;

      const rect = waveformContainerRef.current.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const x = clientX - rect.left;
      const time = positionToTime(x);

      if (isDraggingStart) {
        const newStartTime = Math.min(time, endTime - 0.1);
        setStartTime(newStartTime);
        const trimmedDuration = endTime - newStartTime;
        onTrimChange?.(newStartTime, endTime);
        onDurationChange?.(trimmedDuration);
        audioContext?.setAudioDuration?.(trimmedDuration);
      } else if (isDraggingEnd) {
        const newEndTime = Math.max(time, startTime + 0.1);
        setEndTime(newEndTime);
        const trimmedDuration = newEndTime - startTime;
        onTrimChange?.(startTime, newEndTime);
        onDurationChange?.(trimmedDuration);
        audioContext?.setAudioDuration?.(newEndTime - startTime);
      }
    },
    [isDraggingStart, isDraggingEnd, startTime, endTime, onTrimChange, onDurationChange, audioContext, positionToTime],
  );

  const handleTrimDragEnd = useCallback(() => {
    setIsDraggingStart(false);
    setIsDraggingEnd(false);
    document.body.style.userSelect = '';
    justFinishedDraggingRef.current = true;
    setTimeout(() => {
      justFinishedDraggingRef.current = false;
    }, 50);
  }, []);

  const handlePlayPause = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        // 如果显示裁剪器且当前进度在裁剪范围外，跳转到开始位置
        if (showTrimmer && (currentTime < startTime || currentTime >= endTime)) {
          audioRef.current.currentTime = startTime;
        }
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onDelete();
  };

  // 切换裁剪模式
  const handleToggleTrimmer = () => {
    const newShowTrimmer = !showTrimmer;
    setShowTrimmer(newShowTrimmer);

    // 切换到裁剪模式时，通知父组件裁剪范围
    if (newShowTrimmer) {
      onTrimChange?.(startTime, endTime);
      const trimmedDuration = endTime - startTime;
      onDurationChange?.(trimmedDuration);
      audioContext?.setAudioDuration?.(trimmedDuration);
    } else {
      // 切换回完整模式时，重置为完整时长
      onTrimChange?.(0, duration);
      onDurationChange?.(duration);
      audioContext?.setAudioDuration?.(duration);
    }
  };

  const formatTime = (time: number, ceilSeconds = false) => {
    const totalSeconds = ceilSeconds ? Math.ceil(time) : Math.floor(time);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // 音频事件监听
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !audioUrl) return undefined;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      // 如果显示裁剪器且播放到结束位置，跳转到开始位置
      if (showTrimmer && audio.currentTime >= endTime) {
        audio.pause();
        audio.currentTime = startTime;
        setIsPlaying(false);
      }
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setEndTime(audio.duration);
      // 初始化时使用完整时长
      if (!showTrimmer) {
        onDurationChange?.(audio.duration);
        audioContext?.setAudioDuration?.(audio.duration);
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      if (showTrimmer) {
        audio.currentTime = startTime;
      } else {
        setCurrentTime(0);
      }
    };

    const handlePause = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('pause', handlePause);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('pause', handlePause);
    };
  }, [audioUrl, showTrimmer, startTime, endTime, onDurationChange, audioContext]);

  // 进度指示器拖动监听
  useEffect(() => {
    if (!isDraggingProgress) return undefined;

    document.addEventListener('mousemove', handleProgressDragMove);
    document.addEventListener('mouseup', handleProgressDragEnd);
    document.addEventListener('touchmove', handleProgressDragMove, { passive: false });
    document.addEventListener('touchend', handleProgressDragEnd);

    return () => {
      document.removeEventListener('mousemove', handleProgressDragMove);
      document.removeEventListener('mouseup', handleProgressDragEnd);
      document.removeEventListener('touchmove', handleProgressDragMove);
      document.removeEventListener('touchend', handleProgressDragEnd);
    };
  }, [isDraggingProgress, handleProgressDragMove, handleProgressDragEnd]);

  // 裁剪边界器拖动监听
  useEffect(() => {
    if (!isDraggingStart && !isDraggingEnd) return undefined;

    document.addEventListener('mousemove', handleTrimDragMove);
    document.addEventListener('mouseup', handleTrimDragEnd);
    document.addEventListener('touchmove', handleTrimDragMove, { passive: false });
    document.addEventListener('touchend', handleTrimDragEnd);

    return () => {
      document.removeEventListener('mousemove', handleTrimDragMove);
      document.removeEventListener('mouseup', handleTrimDragEnd);
      document.removeEventListener('touchmove', handleTrimDragMove);
      document.removeEventListener('touchend', handleTrimDragEnd);
    };
  }, [isDraggingStart, isDraggingEnd, handleTrimDragMove, handleTrimDragEnd]);

  const progressPosition = timeToPosition(currentTime);

  return (
    <div className='group relative rounded-xl border border-white/10 bg-[#232528] p-2.5 transition-all hover:border-[#427cf1]/50'>
      <div className='flex items-center gap-2.5'>
        <button
          type='button'
          onClick={handlePlayPause}
          className={cn(
            'flex size-11 shrink-0 items-center justify-center rounded-full transition-all',
            isPlaying ? 'bg-[#427cf1] text-white' : 'bg-white/5 text-white/60 hover:bg-white/10',
          )}
        >
          {isPlaying ? <Pause className='size-5 fill-current' /> : <Play className='size-5 fill-current' />}
        </button>
        <div className='flex min-w-0 flex-1 flex-col items-start gap-1.5'>
          <div className='flex w-full items-center justify-between gap-2'>
            <p className='line-clamp-1 text-sm font-medium text-white'>{file.name}</p>
            <div className='flex shrink-0 items-center gap-2'>
              <button
                type='button'
                onClick={handleToggleTrimmer}
                className={cn(
                  'text-white/40 transition-colors hover:text-[#427cf1]',
                  showTrimmer && 'text-[#427cf1]',
                )}
                title={showTrimmer ? t('hide-trim') : t('show-trim')}
              >
                <Scissors className='size-4' />
              </button>
              <button
                type='button'
                onClick={handleDelete}
                className='text-white/40 transition-colors hover:text-white/60'
              >
                <Trash2 className='size-4' />
              </button>
            </div>
          </div>

          {/* 波形 + 进度指示器 + 裁剪边界器 */}
          <div className='w-full space-y-1'>
            <span className='text-xs text-white/40'>
              {formatTime(currentTime)}/{formatTime(duration, true)}
            </span>

            <div
              ref={waveformContainerRef}
              role='button'
              tabIndex={0}
              className='relative h-20 w-full cursor-pointer'
              onClick={handleWaveformClick}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleWaveformClick(e as any);
                }
              }}
            >
              {isGeneratingWaveform ? (
                <div className='flex h-full w-full items-center justify-center rounded-md bg-white/5'>
                  <Loader2 className='size-6 animate-spin text-[#427cf1]' />
                </div>
              ) : (
                <>
                  {/* 波形 Canvas */}
                  <canvas ref={canvasRef} className='h-full w-full rounded-md' />

                  {/* 裁剪边界器 - 仅在 showTrimmer 时显示 */}
                  {showTrimmer && (
                    <>
                      {/* 左边界 */}
                      <div
                        role='slider'
                        tabIndex={0}
                        aria-label={t('start-time')}
                        aria-valuemin={0}
                        aria-valuemax={duration}
                        aria-valuenow={startTime}
                        className='absolute top-0 z-20 h-full w-0.5 cursor-ew-resize bg-[#427cf1]'
                        style={{ left: `${timeToPosition(startTime)}px` }}
                        onMouseDown={handleTrimBoundaryMouseDown('start')}
                        onTouchStart={handleTrimBoundaryMouseDown('start')}
                        onKeyDown={(e) => {
                          if (e.key === 'ArrowLeft') {
                            e.preventDefault();
                            const newStartTime = Math.max(0, startTime - 0.1);
                            setStartTime(newStartTime);
                            onTrimChange?.(newStartTime, endTime);
                            onDurationChange?.(endTime - newStartTime);
                          } else if (e.key === 'ArrowRight') {
                            e.preventDefault();
                            const newStartTime = Math.min(endTime - 0.1, startTime + 0.1);
                            setStartTime(newStartTime);
                            onTrimChange?.(newStartTime, endTime);
                            onDurationChange?.(endTime - newStartTime);
                          }
                        }}
                      >
                        <div className='absolute left-1/2 top-1/2 flex size-5 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#427cf1] shadow-md'>
                          <div className='h-2.5 w-0.5 bg-white' />
                        </div>
                      </div>

                      {/* 右边界 */}
                      <div
                        role='slider'
                        tabIndex={0}
                        aria-label={t('end-time')}
                        aria-valuemin={0}
                        aria-valuemax={duration}
                        aria-valuenow={endTime}
                        className='absolute top-0 z-20 h-full w-0.5 cursor-ew-resize bg-[#427cf1]'
                        style={{ left: `${timeToPosition(endTime)}px` }}
                        onMouseDown={handleTrimBoundaryMouseDown('end')}
                        onTouchStart={handleTrimBoundaryMouseDown('end')}
                        onKeyDown={(e) => {
                          if (e.key === 'ArrowLeft') {
                            e.preventDefault();
                            const newEndTime = Math.max(startTime + 0.1, endTime - 0.1);
                            setEndTime(newEndTime);
                            onTrimChange?.(startTime, newEndTime);
                            onDurationChange?.(newEndTime - startTime);
                          } else if (e.key === 'ArrowRight') {
                            e.preventDefault();
                            const newEndTime = Math.min(duration, endTime + 0.1);
                            setEndTime(newEndTime);
                            onTrimChange?.(startTime, newEndTime);
                            onDurationChange?.(newEndTime - startTime);
                          }
                        }}
                      >
                        <div className='absolute left-1/2 top-1/2 flex size-5 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#427cf1] shadow-md'>
                          <div className='h-2.5 w-0.5 bg-white' />
                        </div>
                      </div>
                    </>
                  )}

                  {/* 进度指示器 - 始终显示 */}
                  <div
                    className='pointer-events-none absolute top-0 z-30 h-full w-0.5 bg-[#427cf1]'
                    style={{ left: `${progressPosition}px` }}
                  >
                    {/* 顶部圆形拖动手柄 */}
                    <div
                      role='slider'
                      tabIndex={0}
                      aria-label='播放进度'
                      aria-valuemin={0}
                      aria-valuemax={duration}
                      aria-valuenow={currentTime}
                      className={cn(
                        'pointer-events-auto absolute -left-2.5 -top-1 flex size-5 cursor-grab items-center justify-center rounded-full bg-[#427cf1] shadow-md ring-2 ring-white transition-transform active:cursor-grabbing',
                        (isProgressHandleHovered || isDraggingProgress) && 'scale-125',
                      )}
                      onMouseDown={handleProgressHandleMouseDown}
                      onTouchStart={handleProgressHandleMouseDown}
                      onMouseEnter={() => setIsProgressHandleHovered(true)}
                      onMouseLeave={() => setIsProgressHandleHovered(false)}
                      onKeyDown={(e) => {
                        if (!audioRef.current) return;
                        if (e.key === 'ArrowLeft') {
                          e.preventDefault();
                          let newTime = currentTime - 1;
                          if (showTrimmer) {
                            newTime = Math.max(startTime, newTime);
                          }
                          audioRef.current.currentTime = newTime;
                        } else if (e.key === 'ArrowRight') {
                          e.preventDefault();
                          let newTime = currentTime + 1;
                          if (showTrimmer) {
                            newTime = Math.min(endTime, newTime);
                          }
                          audioRef.current.currentTime = newTime;
                        }
                      }}
                    >
                      <div className='size-2 rounded-full bg-white' />
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* 裁剪信息 - 仅在裁剪模式显示 */}
            {showTrimmer && (
              <div className='flex items-center justify-between text-xs text-white/60'>
                <span>
                  {t('start-time')}: <span className='font-medium text-[#427cf1]'>{formatTime(startTime)}</span>
                </span>
                <span>
                  {t('end-time')}: <span className='font-medium text-[#427cf1]'>{formatTime(endTime)}</span>
                </span>
                <span>
                  {t('duration')}: <span className='font-medium text-[#427cf1]'>{formatTime(endTime - startTime, true)}</span>
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      {audioUrl && <audio ref={audioRef} src={audioUrl} preload='metadata' className='hidden' />}
    </div>
  );
}
