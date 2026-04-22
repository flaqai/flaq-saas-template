'use client';

import { useTranslations } from 'next-intl';

interface AudioSupportFieldProps {
  show?: boolean;
  translationNamespace?: 'components.video-form' | 'components.image-form';
}

/**
 * 音频支持提示组件（纯展示）
 * 显示模型支持音频的提示信息
 */
export default function AudioSupportField({
  show = false,
  translationNamespace = 'components.video-form',
}: AudioSupportFieldProps) {
  const t = useTranslations(translationNamespace);

  if (!show) return null;

  return (
    <div className='flex w-full flex-row items-center gap-1 rounded-xl border border-color-b1 bg-color-c2 p-3'>
      <div className='text-sm font-medium text-color-main'>{t('audio')}</div>
      <div className='text-xs text-white/40'>{t('audio-support')}</div>
    </div>
  );
}
