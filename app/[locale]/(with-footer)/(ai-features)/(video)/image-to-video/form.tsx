'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import VideoForm from '@/components/video-ui-form/video-form';
import useImageFormStore from '@/store/form/useImageFormStore';
import { useTranslations } from 'next-intl';

export default function Form() {
  const t = useTranslations('image-to-video');
  const router = useRouter();
  const searchParams = useSearchParams();
  const setVideoFormImageSrc = useImageFormStore((state) => state.setVideoFormImageSrc);

  // 处理从 remix 传递过来的图片
  useEffect(() => {
    const remixImage = searchParams.get('remixImage');
    if (remixImage) {
      const decodedUrl = decodeURIComponent(remixImage);
      setVideoFormImageSrc(decodedUrl);

      // 清理 URL 参数
      router.replace('/image-to-video', { scroll: false });
    }
  }, [searchParams, setVideoFormImageSrc, router]);

  return (
    <VideoForm
      submitBtnId='image-to-video-submit-btn'
      videoType='Image-to-video'
      formTitle={t('form.title')}
      showAllVideoHistory={true}
      defaultValues={{
        modelVersion: 'seedance-2-0-fast',
        ratio: '16:9',
        enableEndFrame: true,
      }}
    />
  );
}