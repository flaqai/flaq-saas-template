'use client';

import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Drawer, DrawerContent } from '@/components/ui/drawer';

import ImageHistory from './image-history';
import BgY from './svg/BgY';

export default function ImageHistoryMobile() {
  const [openList, setOpenList] = useState(false);
  const t = useTranslations('components.image-form.history');

  const onClickImage = () => {
    setOpenList(false);
    setTimeout(() => {
      document.querySelector('#ImageDisplay')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 600);
  };

  return (
    <>
      <div className='relative isolate flex h-[62px] overflow-hidden rounded-xl p-px lg:hidden'>
        <BgY className='rounded-inherit absolute inset-0 -z-10 flex-1' />
        <button
          type='button'
          onClick={() => setOpenList(!openList)}
          className='rounded-inherit flex flex-1 items-center justify-between border-[#333333] bg-[#1A1A1A] px-2.5 text-white'
        >
          {t('title')}
          <ChevronRight className='size-5' strokeWidth={1} />
        </button>
      </div>
      <Drawer open={openList} onOpenChange={setOpenList}>
        <DrawerContent className='h-[720px] border-[#333333] bg-[#1A1A1A] p-3' barClassName='bg-white/70 mb-4 mt-2'>
          <ImageHistory imageNum={6} onClickImage={onClickImage} />
        </DrawerContent>
      </Drawer>
    </>
  );
}
