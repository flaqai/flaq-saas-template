import useImageFormStore from '@/store/form/useImageFormStore';
import { useTranslations } from 'next-intl';

function ImgItem({ src, name }: { src: string; name: string }) {
  return (
    <div className='flex h-full rounded-lg bg-black text-xs'>
      <div className='rounded-inherit flex h-full flex-1 flex-col items-center border border-white/10 bg-white/5 px-1'>
        <img src={src} alt={name} className='max-h-20 max-w-20 rounded-md' />
        <div className='mt-auto text-white/70'>{name}</div>
      </div>
    </div>
  );
}

export default function ImageInfo() {
  const t = useTranslations('components.image-form');
  const imageObj = useImageFormStore((s) => s.imageObj);

  if (imageObj === 'loading' || !imageObj) return null;

  return (
    <div className='absolute bottom-1 left-0 z-50 flex h-24 w-full items-center gap-1 px-1'>
      {!!imageObj.originalImg && <ImgItem src={imageObj.originalImg} name={t('display.original-img')} />}
      <div className='h-full flex-1 overflow-auto rounded-lg border border-main-gray bg-card-black p-2 text-sm text-white/70'>
        {imageObj.prompt}
      </div>
    </div>
  );
}
