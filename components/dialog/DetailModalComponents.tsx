'use client';

import { useState } from 'react';
import { Check, Copy, Download, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

import useCopyToClipboard from '@/hooks/useCopyToClipboard';
import { ImageToVideoIcon } from '@/components/svg/button/common';
import ImageExpiredIcon from '@/components/svg/image/ImageExpiredIcon';

// 图片过期占位符组件
export function ImageExpiredPlaceholder({
  className = '',
  iconClassName = 'h-6 w-6',
  textClassName = 'text-xs',
  translationKey = 'Profile.image-history.detail',
}: {
  className?: string;
  iconClassName?: string;
  textClassName?: string;
  translationKey?: string;
}) {
  const t = useTranslations(translationKey);

  return (
    <div className={`flex h-full w-full flex-col items-center justify-center gap-1 px-2 ${className}`}>
      <ImageExpiredIcon className={`text-[#777] ${iconClassName}`} />
      <span className={`text-center text-[#777] ${textClassName}`}>{t('expiredImage')}</span>
    </div>
  );
}

// 元数据参数项类型
export interface MetadataItem {
  label: string;
  value: string | number;
}

// 元数据行组件
export function MetadataRow({ items }: { items: MetadataItem[] }) {
  return (
    <div className='flex flex-wrap items-center gap-2 text-sm leading-[22px]'>
      {items.map((item, index) => (
        <span key={index}>
          <span className='text-[#777]'>{item.label}：</span>
          <span className='text-[#cfcfcf]'>{item.value}</span>
        </span>
      ))}
    </div>
  );
}

// 模型标签组件
export function ModelTag({ modelName }: { modelName?: string }) {
  if (!modelName) return null;

  return (
    <div className='inline-flex w-fit items-center rounded-lg border border-[#34353b] bg-[#191a20] p-2'>
      <span className='rounded bg-black/10 text-sm capitalize leading-[22px] text-[#cfcfcf]'>
        {modelName}
      </span>
    </div>
  );
}

// 提示词区域组件
export function PromptSection({ prompt, translationKey = 'Profile.image-history.detail' }: { prompt?: string; translationKey?: string }) {
  const { isCopied, copyToClipboard } = useCopyToClipboard();
  const t = useTranslations(translationKey);

  if (!prompt) return null;

  return (
    <div className='flex flex-col gap-3 custom-scrollbar'>
      <div className='flex items-center gap-2'>
        <p className='text-base leading-6 text-white'>{t('prompt')}</p>
        <button
          type='button'
          onClick={() => copyToClipboard(prompt)}
          className='flex h-6 w-6 cursor-pointer items-center justify-center rounded transition-colors hover:bg-white/10'
          title={isCopied ? t('copied') : t('copyPrompt')}
        >
          {isCopied ? <Check className='h-4 w-4 text-white/70' /> : <Copy className='h-4 w-4 text-white/70' />}
        </button>
      </div>
      <div className='rounded-lg border border-[#34353b] bg-[#111214] p-2'>
        <p className='text-sm leading-[22px] text-[#cfcfcf]'>{prompt}</p>
      </div>
    </div>
  );
}

// 版权说明组件
export function CopyrightText({ translationKey = 'Profile.image-history.detail' }: { translationKey?: string }) {
  const t = useTranslations(translationKey);
  return <p className='text-sm leading-[22px] text-[#777]'>{t('copyright')}</p>;
}

// 底部操作按钮容器
export function ModalActions({ children }: { children: React.ReactNode }) {
  return (
    <div className='flex shrink-0 items-center gap-2 border-t border-[#34353b] p-3'>
      {children}
    </div>
  );
}

// 操作按钮组（左侧）
export function ActionButtonGroup({ children }: { children: React.ReactNode }) {
  return <div className='flex shrink-0 gap-2'>{children}</div>;
}

// 下载按钮
export function DownloadButton({ onClick, disabled = false }: { onClick: () => void; disabled?: boolean }) {
  return (
    <button
      type='button'
      onClick={onClick}
      disabled={disabled}
      className='flex aspect-square h-[42px] items-center justify-center rounded-lg bg-[#1c1d23] transition-colors hover:bg-[#252629] disabled:cursor-not-allowed disabled:opacity-50'
    >
      <Download className='h-5 w-5 text-white' />
    </button>
  );
}

// 删除按钮
export function DeleteButton({
  onClick,
  disabled = false,
}: {
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type='button'
      onClick={onClick}
      disabled={disabled}
      className='group flex aspect-square h-[42px] cursor-pointer items-center justify-center rounded-lg bg-[#1c1d23] transition-colors hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50'
    >
      <Trash2 className='h-[18px] w-4 text-white transition-colors group-hover:text-red-500' />
    </button>
  );
}

// Remix 按钮
export function RemixButton({ onClick, translationKey = 'Profile.image-history.detail' }: { onClick?: () => void; translationKey?: string }) {
  const t = useTranslations(translationKey);
  return (
    <button
      type='button'
      onClick={onClick}
      className='flex h-[42px] flex-1 cursor-pointer items-center justify-center rounded-lg bg-[#1677ff] py-1.5 text-base leading-6 text-white transition-opacity hover:opacity-90'
    >
      {t('remix')}
    </button>
  );
}

// Image to Video 按钮
export function ImageToVideoButton({ onClick, translationKey = 'Profile.image-history.detail' }: { onClick?: () => void; translationKey?: string }) {
  const t = useTranslations(translationKey);
  return (
    <button
      type='button'
      onClick={onClick}
      className='flex h-[42px] flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#1c1d23] py-1.5 text-base leading-6 text-white transition-colors hover:bg-[#252629]'
    >
      <ImageToVideoIcon className='h-6 w-6' />
      {t('imageToVideo')}
    </button>
  );
}

// 模态框头部
export function ModalHeader({ title, onClose }: { title: string; onClose: () => void }) {
  return (
    <div className='flex shrink-0 items-center justify-between border-b border-[#34353b] p-3'>
      <h2 className='text-2xl font-medium capitalize leading-8 text-white'>{title}</h2>
      <button
        type='button'
        onClick={onClose}
        className='flex h-9 w-9 items-center justify-center rounded-[3px] transition-colors hover:bg-white/10'
      >
        <svg className='h-5 w-5 text-white' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
        </svg>
      </button>
    </div>
  );
}

// 滚动内容区域
export function ScrollableContent({ children }: { children: React.ReactNode }) {
  return <div className='flex flex-1 flex-col gap-3 overflow-y-auto p-3 custom-scrollbar'>{children}</div>;
}

// 媒体网格组件（用于 Images 和 Frames）
export function MediaGrid({
  title,
  mediaUrls,
  expiredIndices = [],
  onDownloadAll,
  downloadButtonTitle,
  columns = 5,
  itemHeight = 'h-20',
  translationKey = 'Profile.image-history.detail',
}: {
  title: string;
  mediaUrls: (string | null)[];
  expiredIndices?: number[];
  onDownloadAll?: () => void;
  downloadButtonTitle?: string;
  columns?: number;
  itemHeight?: string;
  translationKey?: string;
}) {
  const t = useTranslations(translationKey);
  const [failedIndices, setFailedIndices] = useState<number[]>([]);

  const handleImageError = (index: number) => {
    setFailedIndices((prev) => {
      if (!prev.includes(index)) {
        return [...prev, index];
      }
      return prev;
    });
  };

  if (!mediaUrls || mediaUrls.length === 0) return null;

  const getGridColsClass = () => {
    switch (columns) {
      case 2: return 'grid-cols-2';
      case 3: return 'grid-cols-3';
      case 4: return 'grid-cols-4';
      case 5: return 'grid-cols-5';
      default: return 'grid-cols-5';
    }
  };

  return (
    <div className='flex flex-col gap-2'>
      <div className='flex items-center gap-2'>
        <p className='text-base leading-6 text-white'>{title}</p>
        {onDownloadAll && (
          <button
            type='button'
            onClick={onDownloadAll}
            className='flex h-6 w-6 cursor-pointer items-center justify-center rounded transition-colors hover:bg-white/10'
            title={downloadButtonTitle}
          >
            <Download className='h-4 w-4 text-white/70' />
          </button>
        )}
      </div>
      <div className={`grid ${getGridColsClass()} gap-2`}>
        {mediaUrls.map((url, index) => {
          const isExpired = !url || expiredIndices.includes(index) || failedIndices.includes(index);
          const widthClass = itemHeight.includes('aspect-square') ? '' : 'w-full';

          return (
            <div key={index} className={`relative ${itemHeight} ${widthClass} overflow-hidden rounded bg-[#111214]`}>
              {isExpired ? (
                <ImageExpiredPlaceholder translationKey={translationKey} />
              ) : (
                <img
                  src={url!}
                  alt={`${title} ${index + 1}`}
                  className='h-full w-full object-contain'
                  draggable={false}
                  onDragStart={(e) => e.preventDefault()}
                  onError={() => handleImageError(index)}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
