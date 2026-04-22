import { useTranslations } from 'next-intl';

import 'driver.js/dist/driver.css';
import './driver.css';

import useImageToVideoStore from '@/store/video/useImageToVideoStore';
import { driver } from 'driver.js';

export const stepIdList = ['start-frame', 'end-frame', 'image-form', 'choose-image', 'video-form'];

const useVideoTutorial = () => {
  const t = useTranslations('flux-video-ai.tutorial');
  const setImageGenerateFormName = useImageToVideoStore((state) => state.setImageGenerateFormName);

  const driverObj = driver({
    popoverClass: 'driverjs',
    showProgress: true,
    doneBtnText: t('doneBtnText'),
    prevBtnText: `&larr; ${t('prevBtnText')}`,
    nextBtnText: `${t('nextBtnText')} &rarr;`,
    steps: stepIdList.map((el, idx) => ({
      element: `#${el}`,
      popover: { title: t(`${idx + 1}.title`), description: t(`${idx + 1}.description`), side: 'bottom' },
    })),
    onDestroyed: () => {
      setImageGenerateFormName(null);
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    },
  });

  return () => {
    setImageGenerateFormName('startFrame');
    driverObj.drive();
  };
};

export default useVideoTutorial;
