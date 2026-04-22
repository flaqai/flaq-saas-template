'use client';

import { Link } from '@/i18n/navigation';
import useUserInfoStore from '@/store/useUserInfoStore';
import { ChevronRight } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function ImageHistoryTitle({
  showBackToStart,
  onBackToStart,
}: {
  showBackToStart?: boolean;
  onBackToStart?: () => void;
}) {
  const t = useTranslations('components.image-form.history');
  const userInfo = useUserInfoStore((state) => state.userInfo);

  return (
    <div className='flex items-center gap-2 text-sm text-white'>
      <div>{t('title')}</div>
      {userInfo && (
        <>
          <div className='h-4 w-px rounded-full bg-[#9999A3]' />
          <Link href='/profile/image-history'>
            <div className='flex items-center gap-0.5 text-white/80 hover:text-color-main'>
              {t('check-all')}
              <ChevronRight className='size-4' />
            </div>
          </Link>
        </>
      )}
      {showBackToStart && onBackToStart && (
        <>
          <div className='h-4 w-px rounded-full bg-[#9999A3]' />
          <button
            type='button'
            onClick={onBackToStart}
            className='text-white/80 hover:text-color-main cursor-pointer'
          >
            {t('backToStart')}
          </button>
        </>
      )}
    </div>
  );
}
