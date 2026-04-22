'use client';

// import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { cn } from '@/lib/utils';
import { useRouter } from '@/i18n/navigation';

export default function GobackBtn({
  className,
  handleGoBack,
  children,
}: {
  className?: string;
  handleGoBack?: () => void;
  children?: React.ReactNode;
}) {
  const t = useTranslations();
  const router = useRouter();

  function goback() {
    if (handleGoBack) {
      handleGoBack();
      return;
    }
    router.back();
  }
  return (
    <button
      type='button'
      onClick={goback}
      className={cn(
        'flex h-10 w-10 items-center justify-center rounded-[14px] border border-white bg-transparent hover:cursor-pointer hover:opacity-70',
        className,
      )}
    >
      <span className='sr-only'>{t('Common.back')}</span>
      {children || <ArrowLeft className='h-4 w-4' />}
    </button>
  );
}
