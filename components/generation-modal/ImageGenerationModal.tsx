'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';

import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import ImageForm from '@/components/image-ui-form/image-form';
import ImageHistoryMasonry from '@/components/history/ImageHistoryMasonry';
import ModalImageDisplay from '@/components/generation-modal/ModalImageDisplay';
import ImageHistoryTitle from '@/components/image-ui-form/image-history-title';
import ImageHistory from '@/components/image-ui-form/image-history';
import { ScrollRef } from '@/components/image-ui-form/shared/scroll';

import {
  NANO_BANANA_PROVIDER,
  SEEDREAM_PROVIDER,
  type ImageModelVersionConfig,
} from '@/lib/constants/image';
import useImageFormStore from '@/store/form/useImageFormStore';
import useUserImageHistory from '@/network/image/history';

const ALL_AVAILABLE_VERSIONS: ImageModelVersionConfig[] = [
  ...SEEDREAM_PROVIDER.versions,
  ...NANO_BANANA_PROVIDER.versions,
];

interface ImageGenerationModalProps {
  // 以下三个属性通过 cloneElement 注入，因此标记为可选
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onImageSelect?: (imageUrl: string) => void;
  generateTabTitle: string;
  historyTabTitle: string;
  confirmButtonText?: string;
  // 条件显示控制
  showMultiImageUpload?: boolean;
  showAspectRatio?: boolean;
  showResolution?: boolean;
  useBottomActionArea?: boolean;
  requireImageUpload?: boolean;
  // 默认值配置
  defaultAspectRatio?: string;
  // Slot props
  customUploadSection?: React.ReactNode;
  customHintsSection?: React.ReactNode;
  // 支持首尾帧独立轮询状态
  imageObjContext?: 'default' | 'start-frame' | 'end-frame';
}

export default function ImageGenerationModal({
  open,
  onOpenChange,
  onImageSelect,
  generateTabTitle,
  historyTabTitle,
  confirmButtonText,
  showMultiImageUpload = true,
  showAspectRatio = true,
  showResolution = true,
  useBottomActionArea = false,
  requireImageUpload = false,
  defaultAspectRatio,
  customUploadSection,
  customHintsSection,
  imageObjContext = 'default',
}: ImageGenerationModalProps) {
  const t = useTranslations('components.image-form');

  const [activeTab, setActiveTab] = useState<'generate' | 'history'>('generate');
  const [pageNum, setPageNum] = useState(1);
  const [scrollLeft, setScrollLeft] = useState(0);
  const scrollRef = useRef<ScrollRef>(null);

  const { data: imageHistory, total: imageHistoryTotal, isLoading } = useUserImageHistory(pageNum, 30);
  const updateImageObj = useImageFormStore((state) => state.updateImageObj);

  // 默认使用 Nano Banana Pro (Gemini 3 Pro Image Preview)
  const defaultVersion = NANO_BANANA_PROVIDER.versions.find((v) => v.modelVersion === 'gemini-3-pro-image-preview') || NANO_BANANA_PROVIDER.versions[0];

  // 当 modal 关闭时重置 tab，但保留 imageObj 以便轮询完成后能保存结果
  useEffect(() => {
    if (!open) {
      setActiveTab('generate');
      // 不重置 imageObj，允许后台轮询继续并保存结果
    }
  }, [open]);

  const handleImageSelect = (imageUrl: string) => {
    onImageSelect?.(imageUrl);
    onOpenChange?.(false);
  };

  const showBackToStart = scrollLeft > 200;

  const handleBackToStart = () => {
    scrollRef.current?.scrollToStart();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className='flex h-[90vh] w-full max-w-5xl flex-col gap-0 overflow-hidden bg-[#0f1011] p-0 sm:h-[85vh] sm:max-w-5xl md:h-[90vh]'
        overlayClassName='bg-black/50'
        onEscapeKeyDown={(e) => e.preventDefault()}
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        <DialogHeader className='border-b border-white/10 px-3 pt-2.5 sm:px-4 sm:pt-3 md:px-6 md:pt-4'>
          <DialogTitle className='flex flex-row items-center gap-2 text-base font-normal sm:gap-3 sm:text-lg md:gap-4'>
            <button
              type='button'
              onClick={() => setActiveTab('generate')}
              className={cn(
                'cursor-pointer whitespace-nowrap transition-all',
                activeTab === 'generate'
                  ? 'text-color-main'
                  : 'text-white/40 hover:text-white/60',
              )}
            >
              {generateTabTitle}
            </button>
            <button
              type='button'
              onClick={() => setActiveTab('history')}
              className={cn(
                'cursor-pointer whitespace-nowrap transition-all',
                activeTab === 'history'
                  ? 'text-color-main'
                  : 'text-white/40 hover:text-white/60',
              )}
            >
              {historyTabTitle}
            </button>
          </DialogTitle>
          <DialogDescription className='sr-only'>{generateTabTitle}</DialogDescription>
        </DialogHeader>

        <div className={cn('flex flex-1 flex-col overflow-auto p-2 sm:p-3 md:overflow-hidden', activeTab !== 'generate' && 'hidden')}>
          <div className='h-full w-full md:[&>div]:!h-full'>
            <ImageForm
            imageFormType='text-to-image'
            customVersionList={ALL_AVAILABLE_VERSIONS}
            imageObjContext={imageObjContext}
            defaultValuePriority={{
              aspectRatio: ['9:16', 'auto', '1:1'],
              resolution: ['2k'],
            }}
            defaultValues={{
              modelVersion: defaultVersion?.modelVersion || 'gemini-3-pro-image-preview',
              aspectRatio: defaultAspectRatio || defaultVersion?.options?.ratio?.[0]?.value || '9:16',
              resolution: '2k',
            }}
            showRatio={showAspectRatio}
            imageUploadMode={showMultiImageUpload ? 'auto' : 'none'}
            requireImageUpload={requireImageUpload}
            submitBtnId='text-to-image-modal-submitBtnId'
            slotNodeAfterModel={
              customUploadSection ? (
                <>
                  {customUploadSection}
                  {customHintsSection}
                </>
              ) : customHintsSection ? (
                customHintsSection
              ) : undefined
            }
            customRightContent={
              <div className='flex min-h-[400px] w-full flex-1 flex-col gap-3 overflow-hidden lg:h-full'>
                <ModalImageDisplay imageObjContext={imageObjContext} onImageSelect={handleImageSelect} />
                <ImageHistoryTitle showBackToStart={showBackToStart} onBackToStart={handleBackToStart} />
                <ImageHistory ref={scrollRef} imageObjContext={imageObjContext} onScrollChange={setScrollLeft} />
              </div>
            }
          />
          </div>
        </div>

        <div className={cn('flex flex-1 flex-col overflow-hidden rounded-xl p-2 sm:p-3', activeTab !== 'history' && 'hidden')}>
          <ImageHistoryMasonry
            imageHistory={imageHistory}
            total={imageHistoryTotal || 0}
            isLoading={isLoading}
            pageNum={pageNum}
            onPageChange={setPageNum}
            onImageSelect={handleImageSelect}
            confirmButtonText={confirmButtonText}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
