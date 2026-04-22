'use client';

import VideoForm from '@/components/video-ui-form/video-form';
import { useTranslations } from 'next-intl';

export default function Form() {
  const t = useTranslations('image-to-video');

  return (
    <VideoForm
      submitBtnId='image-to-video-submit-btn'
      videoType='Image-to-video'
      formTitle={t('form.title')}
      showAllVideoHistory={true}
      defaultValues={{
        modelVersion: 'veo3.1-image-to-video',
        ratio: '16:9',
        enableEndFrame: true,
      }}
    />
  );
}
