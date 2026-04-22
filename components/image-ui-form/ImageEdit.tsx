'use client';

import { useState } from 'react';
import useImageFormStore from '@/store/form/useImageFormStore';
import { EllipsisVertical } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import ImageToPrompt from '@/components/svg/form/image-to-prompt';
import RemoveBg from '@/components/svg/form/remove-bg';
import Vip from '@/components/svg/Vip';

function Btn({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      type='button'
      onClick={onClick}
      className='text-light-yellow flex h-10 items-center gap-1.5 rounded px-2 text-left hover:bg-white/10'
    >
      {children}
    </button>
  );
}

export default function ImageEdit({
  imageSrc,
  showImageToImage = true,
}: {
  imageSrc: string;
  showImageToImage?: boolean;
}) {
  const t = useTranslations('image-form.image-edit');
  const setUploadImageObj = useImageFormStore((state) => state.setUploadImageObj);

  const [openPopover, setOpenPopover] = useState(false);

  const closePopover = () => {
    setOpenPopover(false);
  };

  const removeBg = () => {
    console.log('removeBg');
    closePopover();
  };

  const imageToPrompt = () => {
    console.log('imageToPrompt');
    closePopover();
  };

  const imageToImage = () => {
    setUploadImageObj({ src: imageSrc });
    closePopover();
  };

  return (
    <Popover open={openPopover} onOpenChange={setOpenPopover}>
      <PopoverTrigger asChild>
        <button
          type='button'
          className='border-light-yellow text-light-yellow mr-auto flex h-9 w-full items-center justify-center gap-1 rounded-lg border px-2 text-sm hover:opacity-80 lg:w-fit'
        >
          <span>{t('title')}</span>
          <EllipsisVertical className='size-4' />
        </button>
      </PopoverTrigger>
      <PopoverContent
        side='top'
        align='start'
        className='border-light-yellow flex w-fit flex-col gap-2 bg-card-black p-2'
      >
        <Btn onClick={removeBg}>
          <RemoveBg />
          {t('removeBg')}
        </Btn>
        <Btn onClick={imageToPrompt}>
          <ImageToPrompt />
          {t('imageToPrompt')}
        </Btn>
        {showImageToImage && (
          <Btn onClick={imageToImage}>
            <Vip /> {t('imageToImage')}
          </Btn>
        )}
      </PopoverContent>
    </Popover>
  );
}
