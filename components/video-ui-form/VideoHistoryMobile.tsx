'use client';

import useMobileVideoHistoryButttonStore from '@/store/video/useMobileVideoHistoryButttonStore';
import { ChevronRight } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Drawer, DrawerContent } from '@/components/ui/drawer';

// import BgY from './svg/BgY';
import VideoHistory from './VideoHistory';

export default function VideoHistoryMobile() {
  const open = useMobileVideoHistoryButttonStore((state) => state.open);
  const setOpen = useMobileVideoHistoryButttonStore((state) => state.setOpen);
  const t = useTranslations('components.video-form');

  const onClickImage = () => {
    setOpen(false);
    setTimeout(() => {
      document.querySelector('#ImageDisplay')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 600);
  };

  return (
    <>
      <div className='relative isolate flex h-[62px] overflow-hidden rounded-xl p-px lg:hidden'>
        {/* <BgY className='absolute inset-0 -z-10 flex-1 rounded-inherit' /> */}
        <div className='rounded-inherit absolute inset-0 -z-10 flex-1 bg-color-main' />
        <button
          type='button'
          onClick={() => setOpen(!open)}
          className='rounded-inherit flex flex-1 items-center justify-between px-2.5 text-white'
        >
          {t('history')}
          <ChevronRight className='size-5' strokeWidth={1} />
        </button>
      </div>
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent className='h-[690px] bg-white p-3 shadow-lg' barClassName='bg-color-main mb-4 mt-2'>
          <VideoHistory itemNum={6} onClickImage={onClickImage} />
        </DrawerContent>
      </Drawer>
    </>
  );
}
