import { useTranslations } from 'next-intl';

// import { cn } from '@/lib/utils';

import Spinning from './Spinning';

// import BaseImage from './image/BaseImage';

export default function Loading({ className }: { className?: string }) {
  const t = useTranslations('Common');

  return (
    <div role='status' className='flex flex-col items-center gap-1'>
      <Spinning className={className} />
      {/* <BaseImage
        className={cn('h-[100px] w-[100px] animate-spin object-contain', className)}
        src='/images/loading.svg'
        width={100}
        height={100}
        title={t('loading')}
        alt={t('loading')}
      /> */}
      <span className='text-xs'>{t('loading')}</span>
    </div>
  );
}
