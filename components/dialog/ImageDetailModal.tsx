'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { deleteImageById } from '@/network/image/client';
import { refreshImageHistory } from '@/network/image/history';
import { ChevronDown, Download, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { getImageModelVersionName } from '@/lib/constants/image';
import { detectImageFormat } from '@/lib/utils/fileUtils';
import { Dialog, DialogContent, DialogPortal } from '@/components/ui/dialog';
import {
  CopyrightText,
  DeleteButton,
  MediaGrid,
  MetadataRow,
  type MetadataItem,
  ModelTag,
  PromptSection,
} from './DetailModalComponents';

const ConfirmDialog = dynamic(() => import('@/components/dialog/ConfirmDialog'), { ssr: false });

interface ImageDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete?: () => void;
  image: {
    id: string;
    url: string;
    title?: string;
    prompt?: string;
    createTime?: number;
    width?: number;
    height?: number;
    resolution?: string;
    modelName?: string;
    userImageUrlList?: string[];
    size?: number;
  };
}

export default function ImageDetailModal({ open, onOpenChange, onDelete, image }: ImageDetailModalProps) {
  const t = useTranslations('Profile.image-history.detail');
  const tHistory = useTranslations('Profile.image-history');

  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState('WEBP');
  const [showFormatMenu, setShowFormatMenu] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // 检测图片真实格式并设为默认
  useEffect(() => {
    if (!open || !image.url) return;

    detectImageFormat(image.url).then((format) => {
      if (format) setSelectedFormat(format);
    });
  }, [open, image.url]);

  const handleDownload = async () => {
    if (!image.url) return;

    try {
      // 使用代理 API 避免 CORS 问题
      const proxyUrl = `/api/proxy-image?url=${encodeURIComponent(image.url)}`;
      const response = await fetch(proxyUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const ext = selectedFormat.toLowerCase();
      link.download = `image-${image.id}.${ext}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      toast.error('Download failed');
    }
  };

  const getResolution = () => {
    if (image.resolution) {
      return image.resolution;
    }
    if (image.width && image.height) {
      return `${image.width}x${image.height}`;
    }
    return '';
  };

  const getAspectRatio = () => {
    const resolution = getResolution();
    if (!resolution) return '';

    const [width, height] = resolution.split('x').map(Number);
    if (!width || !height) return '';

    const aspectRatio = width / height;

    // 定义常见比例及其容差
    const commonRatios = [
      { ratio: 16 / 9, display: '16:9' },
      { ratio: 4 / 3, display: '4:3' },
      { ratio: 3 / 2, display: '3:2' },
      { ratio: 1 / 1, display: '1:1' },
      { ratio: 21 / 9, display: '21:9' },
      { ratio: 9 / 16, display: '9:16' },
      { ratio: 3 / 4, display: '3:4' },
      { ratio: 2 / 3, display: '2:3' },
      { ratio: 9 / 21, display: '9:21' },
    ];

    // 查找最接近的常见比例（容差 3%）
    const tolerance = 0.03;
    for (const { ratio, display } of commonRatios) {
      if (Math.abs(aspectRatio - ratio) / ratio < tolerance) {
        return display;
      }
    }

    // 如果没有匹配的常见比例，使用 GCD 简化
    const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
    const divisor = gcd(width, height);
    const ratioW = width / divisor;
    const ratioH = height / divisor;

    // 如果简化后的比例数字仍然很大，不显示比例
    if (ratioW > 50 || ratioH > 50) {
      return '';
    }

    return `${ratioW}:${ratioH}`;
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleDelete = async () => {
    if (isDeleting) return;

    setIsDeleting(true);
    try {
      const res = await deleteImageById(image.id);
      if (res.code === 200) {
        refreshImageHistory();
        toast.success(res.msg || tHistory('delete-success'));
        onDelete?.();
        onOpenChange(false);
      } else {
        toast.error(res.msg || tHistory('delete-fail'));
      }
    } catch (error: any) {
      toast.error(error.message || tHistory('delete-fail'));
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (timestamp?: number) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const formatBytes = (bytes?: number) => {
    if (!bytes || bytes <= 0) return '';
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let value = bytes;
    let unitIndex = 0;
    while (value >= 1024 && unitIndex < units.length - 1) {
      value /= 1024;
      unitIndex += 1;
    }
    const fixed = unitIndex === 0 ? 0 : value < 10 ? 1 : 0;
    return `${value.toFixed(fixed)} ${units[unitIndex]}`;
  };

  // 构建元数据项（构建顺序决定参数展示排序）
  const getMetadataItems = (): MetadataItem[] => {
    const items: MetadataItem[] = [];

    const resolution = getResolution();
    if (resolution) {
      items.push({ label: t('resolution'), value: resolution });
    }

    const aspectRatio = getAspectRatio();
    if (aspectRatio) {
      items.push({ label: t('ratio'), value: aspectRatio });
    }
    
    const sizeText = formatBytes(image.size);
    if (sizeText) {
      items.push({ label: t('size'), value: sizeText });
    }

    if (image.createTime) {
      items.push({ label: t('generatedTime'), value: formatDate(image.createTime) });
    }

    return items;
  };

  // 获取模型版本名称
  const getModelVersionName = () => {
    if (!image.modelName) return undefined;
    return getImageModelVersionName(image.modelName) || image.modelName;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogContent
          className='h-[calc(100vh-24px)] max-h-[700px] w-[calc(100vw-16px)] max-w-[1453px] border-none bg-transparent p-0 shadow-none sm:max-w-[1453px]'
          showCloseButton={false}
          overlayClassName='bg-black/80'
          hiddenTitle={t('title')}
        >
          <div className='flex h-full w-full flex-col overflow-hidden rounded-lg shadow-lg lg:flex-row'>
            {/* Left: Image Section */}
            <div className='flex h-full w-full flex-1 items-center justify-center bg-[#111214] p-3 lg:h-[700px] lg:p-6'>
              <img
                src={image.url}
                alt={image.title || 'Image'}
                className='max-h-[576px] max-w-full rounded object-contain'
              />
            </div>

            {/* Right: Info Panel */}
            <div className='flex h-full w-full flex-col bg-[#16171b] lg:h-[700px] lg:w-[450px] lg:shrink-0'>
              {/* Header - Fixed */}
              <div className='flex shrink-0 items-center justify-between border-b border-[#34353b] p-3'>
                <h2 className='text-2xl font-medium capitalize leading-8 text-white'>{t('title')}</h2>
                <button
                  type='button'
                  onClick={() => onOpenChange(false)}
                  className='flex h-9 w-9 cursor-pointer items-center justify-center rounded-[3px] transition-colors hover:bg-white/10'
                >
                  <X className='h-5 w-5 text-white' />
                </button>
              </div>

              {/* Scrollable Content Section */}
              <div className='flex flex-1 flex-col gap-3 overflow-y-auto p-3 custom-scrollbar'>

                {/* Images Section */}
                <MediaGrid
                  title={t('images')}
                  mediaUrls={image.userImageUrlList || []}
                  columns={5}
                  itemHeight='h-20 aspect-square'
                />

                {/* Prompt Section */}
                <PromptSection prompt={image.prompt} />

                {/* Model Version Tag */}
                <ModelTag modelName={getModelVersionName()} />

                {/* Metadata - Integrated */}
                <MetadataRow items={getMetadataItems()} />

                {/* Copyright */}
                <CopyrightText />
              </div>

              {/* Bottom Actions - Fixed */}
              <div className='flex shrink-0 flex-col gap-2 border-t border-[#34353b] p-3'>
                {/* Row 1: Download + Delete */}
                <div className='flex items-center gap-2'>
                  {/* Download Button with Format Selector */}
                  <div className='relative flex h-[42px] cursor-pointer rounded-lg bg-[#1c1d23] transition-colors hover:bg-[#252629]'>
                    {/* Download Icon Button */}
                    <button
                      type='button'
                      onClick={handleDownload}
                      className='flex cursor-pointer items-center justify-center px-3'
                    >
                      <Download className='h-5 w-5 text-white' />
                    </button>

                    {/* Divider */}
                    <div className='w-px bg-[#34353b]' />

                    {/* Format Selector */}
                    <button
                      type='button'
                      onClick={() => setShowFormatMenu(!showFormatMenu)}
                      className='flex cursor-pointer items-center gap-1 px-3'
                    >
                      <span className='text-sm capitalize text-white'>{selectedFormat}</span>
                      <ChevronDown className='h-3.5 w-3.5 rotate-180 scale-y-[-1] text-white' />
                    </button>

                    {/* Format Menu */}
                    {showFormatMenu && (
                      <div className='absolute bottom-full right-0 mb-1 flex flex-col gap-1 rounded-lg bg-[#1c1d23] p-1 shadow-lg'>
                        {['WEBP', 'PNG', 'JPG'].map((format) => (
                          <button
                            key={format}
                            type='button'
                            onClick={() => {
                              setSelectedFormat(format);
                              setShowFormatMenu(false);
                            }}
                            className='cursor-pointer rounded px-3 py-1.5 text-sm capitalize text-white transition-colors hover:bg-white/10'
                          >
                            {format}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Delete Button */}
                  <DeleteButton onClick={handleDeleteClick} disabled={isDeleting} />
                </div>

              </div>
            </div>
          </div>
        </DialogContent>
      </DialogPortal>
      <ConfirmDialog open={showDeleteConfirm} setOpen={setShowDeleteConfirm} callback={handleDelete} />
    </Dialog>
  );
}
