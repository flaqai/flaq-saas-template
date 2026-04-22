'use client';

import { Link } from '@/i18n/navigation';
import useUserInfoStore from '@/store/useUserInfoStore';
import { ChevronRight } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function VideoHistoryTitle({
  showBackToStart,
  onBackToStart,
}: {
  showBackToStart?: boolean;
  onBackToStart?: () => void;
}) {
  const t = useTranslations('components.video-form.history');
  const userInfo = useUserInfoStore((state) => state.userInfo);

  return (
    <div className='flex items-center gap-2 text-sm text-[#e1e1e1]'>
      <div>{t('title')}</div>
      {userInfo && (
        <>
          <div className='h-4 w-px rounded-full bg-[#2a2b2f]' />
          <Link href='/profile/video-history'>
            <div className='flex items-center gap-0.5 text-[#e1e1e1] hover:text-[#1677ff]'>
              {t('check-all')}
              <ChevronRight className='size-4' />
            </div>
          </Link>
        </>
      )}
      {showBackToStart && onBackToStart && (
        <>
          <div className='h-4 w-px rounded-full bg-[#2a2b2f]' />
          <button
            type='button'
            onClick={onBackToStart}
            className='text-[#e1e1e1] hover:text-[#1677ff] cursor-pointer'
          >
            {t('backToStart')}
          </button>
        </>
      )}
    </div>
  );
}
