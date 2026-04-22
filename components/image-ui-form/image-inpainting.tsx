'use client';

import useImageFormStore from '@/store/form/useImageFormStore';

import InpaintingCanvas from '@/components/image/inpainting-canvas';

export default function ImageInpainting({ imgSrc }: { imgSrc: string }) {
  const setLayerMaskDataUrl = useImageFormStore((state) => state.setLayerMaskDataUrl);

  const onMaskGenerated = async (maskDataUrl: string) => {
    setLayerMaskDataUrl(maskDataUrl);
  };

  return (
    <div className='flex max-h-full flex-1 grow flex-col'>
      <div className='relative flex size-full items-center justify-center rounded-lg border border-main-gray bg-black/40 p-3 lg:h-[calc(100%-48px)] lg:p-5'>
        <InpaintingCanvas
          image={imgSrc}
          onMaskGenerated={onMaskGenerated}
          className='size-full max-h-full max-w-full'
        />
      </div>
    </div>
  );
}
