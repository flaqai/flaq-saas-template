'use client';

import { useTranslations } from 'next-intl';

interface AudioSupportHintProps {
  show?: boolean;
  translationNamespace?: 'components.video-form' | 'components.image-form';
}

export default function AudioSupportHint({
  show = false,
  translationNamespace = 'components.video-form',
}: AudioSupportHintProps) {
  const t = useTranslations(translationNamespace);

  if (!show) return null;

  return (
    <div className='flex w-full flex-row items-center gap-1 rounded-xl border border-[#2a2b2f] bg-[#1c1d20] p-3'>
      <div className='text-sm font-medium text-gradient-main'>{t('audio')}</div>
      <div className='text-xs text-white/40'>{t('audio-support')}</div>
    </div>
  );
}
