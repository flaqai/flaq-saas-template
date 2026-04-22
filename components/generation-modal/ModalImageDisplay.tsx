'use client';

import { useEffect, useState } from 'react';
import useImageFormStore from '@/store/form/useImageFormStore';
import { ChevronDown, Download, ImageIcon, X } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { cn } from '@/lib/utils';
import { detectImageFormat } from '@/lib/utils/fileUtils';
import useImageConverter, { ImageType, imageTypesList } from '@/hooks/useImageConverter';
import { useImageContext } from '@/components/image-ui-form/image-context-provider';
import Loading from '@/components/image-ui-form/shared/loading';
import Spinning from '@/components/Spinning';
import Box from '@/components/form/Box';

interface ModalImageDisplayProps {
  onImageSelect?: (imageUrl: string, imageName: string) => void;
  imageObjContext?: 'default' | 'start-frame' | 'end-frame';
}

export default function ModalImageDisplay({ onImageSelect, imageObjContext = 'default' }: ModalImageDisplayProps) {
  const t = useTranslations('components.image-form.display');

  const formType = useImageContext();

  // 根据 imageObjContext 选择对应的 imageObj 和 updateImageObj
  const imageObj = useImageFormStore((state) => {
    if (imageObjContext === 'start-frame') return state.startFrameImageObj;
    if (imageObjContext === 'end-frame') return state.endFrameImageObj;
    return state.imageObj;
  });

  const updateImageObj = useImageFormStore((state) => {
    if (imageObjContext === 'start-frame') return state.updateStartFrameImageObj;
    if (imageObjContext === 'end-frame') return state.updateEndFrameImageObj;
    return state.updateImageObj;
  });

  const isPolling = useImageFormStore((state) => {
    if (imageObjContext === 'start-frame') return state.isStartFramePolling;
    if (imageObjContext === 'end-frame') return state.isEndFramePolling;
    return state.isPolling;
  });

  const { convertAndDownload, isLoading } = useImageConverter();
  const [imageType, setImageType] = useState<ImageType>(imageTypesList[0]);
  const [showFormatMenu, setShowFormatMenu] = useState(false);

  // 检测图片真实格式并设为默认
  useEffect(() => {
    if (!imageObj || typeof imageObj !== 'object' || !imageObj.src) return;

    detectImageFormat(imageObj.src).then((format) => {
      if (format) {
        const formatMap: Record<string, ImageType> = {
          WEBP: 'webp',
          PNG: 'png',
          JPG: 'jpg',
        };
        const detectedType = formatMap[format];
        if (detectedType) setImageType(detectedType);
      }
    });
  }, [imageObj]);

  const imageHasData = !!imageObj && typeof imageObj === 'object';

  let previewImgSrc = '';
  let mode: 'preview' | 'fallback' = 'fallback';

  if (typeof imageObj === 'object' && imageObj?.mediaList) {
    const fallbackMedia = imageObj.mediaList.find((item) => item.formType === formType);

    if (fallbackMedia) {
      mode = 'fallback';
      previewImgSrc = fallbackMedia.imgSrc;
    }
  }

  if (typeof imageObj === 'object' && imageObj?.src) {
    mode = 'preview';
    previewImgSrc = imageObj.src;
  }

  // 按钮显示条件：有图片且不是 fallback
  const shouldShowButtons = imageObj && mode !== 'fallback';

  const onDownload = async () => {
    if (!!imageObj && typeof imageObj === 'object' && imageObj.src && imageObj.name) {
      convertAndDownload({ imageUrl: imageObj.src, type: imageType, imageName: imageObj.name });
    }
  };

  const handleImageSelect = () => {
    if (imageObj && typeof imageObj === 'object' && imageObj.src && imageObj.name && onImageSelect) {
      onImageSelect(imageObj.src, imageObj.name);
    }
  };

  return (
    <div id='ModalImageDisplay' className='flex h-[440px] w-full flex-col overflow-hidden rounded-2xl lg:flex-1'>
      <div className='relative flex size-full flex-col rounded-2xl bg-[#1c1d20]'>
        <div className='relative flex flex-1 items-center justify-center overflow-hidden p-5'>
          {previewImgSrc && (
            <>
              <img
                key={previewImgSrc}
                src={previewImgSrc}
                alt='img'
                data-mode={mode}
                loading='eager'
                decoding='async'
                className='max-h-full max-w-full rounded object-contain'
              />

              <button
                type='button'
                onClick={() => updateImageObj(null)}
                className='absolute right-3 top-3 z-10 flex size-8 items-center justify-center rounded-lg bg-black/20 text-white/70 backdrop-blur'
              >
                <X className='size-4' />
              </button>
            </>
          )}
          {!imageHasData && !isPolling && (
            <div className='flex flex-col items-center gap-3 text-white/60'>
              <ImageIcon className='size-10' />
              {t('noImage')}
            </div>
          )}
          {isPolling && !imageHasData && (
            <div className='flex items-center justify-center'>
              <Loading />
            </div>
          )}
        </div>
        {shouldShowButtons && (
          <div className='relative flex flex-none flex-wrap justify-end gap-2 rounded-b-xl bg-[#1c1d20] p-2 lg:items-center lg:gap-3'>
            {/* Use this image */}
            <Box className='order-3 w-full gap-1 rounded-lg bg-gradient-main p-1 lg:order-none lg:w-auto'>
              <button
                type='button'
                onClick={handleImageSelect}
                className='flex w-full items-center justify-center gap-1 rounded-lg p-1 px-2 text-[#e2e2e2] transition-opacity hover:opacity-70 cursor-pointer lg:w-auto'
              >
                {t('useImage')}
              </button>
            </Box>

            {/* 下载按钮 + 格式选择 */}
            <Box className='order-2 gap-1 rounded-lg p-1 lg:order-none'>
              <div className='relative flex h-full items-center rounded-lg bg-[#1c1d20]'>
                <button
                  type='button'
                  onClick={onDownload}
                  disabled={isLoading}
                  className='flex items-center justify-center rounded-l-lg px-3 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50'
                >
                  {isLoading ? <Spinning className='h-5 w-5 text-white' /> : <Download className='h-5 w-5 text-white' />}
                </button>
                <div className='h-full w-px bg-[#34353b]' />
                <button
                  type='button'
                  onClick={() => setShowFormatMenu(!showFormatMenu)}
                  className='flex items-center gap-1 rounded-r-lg px-3 cursor-pointer'
                >
                  <span className='text-sm uppercase text-white'>{imageType}</span>
                  <ChevronDown className='h-3.5 w-3.5 text-white' />
                </button>

                {/* Format Menu */}
                {showFormatMenu && (
                  <div className='absolute bottom-full right-0 z-50 mb-2 flex flex-col gap-1 rounded-lg bg-[#1c1d20] p-1 shadow-lg'>
                    {imageTypesList.map((type) => (
                      <button
                        key={type}
                        type='button'
                        onClick={() => {
                          setImageType(type);
                          setShowFormatMenu(false);
                        }}
                        className='rounded px-3 py-1.5 text-sm uppercase text-white transition-colors hover:bg-white/10'
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </Box>
          </div>
        )}
      </div>
    </div>
  );
}
