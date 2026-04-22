import dynamic from 'next/dynamic';
import { ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Link } from '@/i18n/navigation';

const InViewPlayVideo = dynamic(() => import('@/components/video/InViewPlayVideo'), { ssr: true });

export default function ToolMediaCard({
  href,
  title,
  content,
  imageSrc,
  videoSrc,
  videoPosterSrc,
  tags,
}: {
  href: string;
  title: string;
  content: string;
  imageSrc: string;
  videoSrc?: string;
  videoPosterSrc?: string;
  tags: string[];
}) {
  const t = useTranslations('Home.tools');

  return (
    <Link
      href={href}
      className='group flex min-h-[347px] flex-col justify-between gap-3 overflow-hidden rounded-xl border border-main-gray bg-card-black hover:shadow-[0px_0px_23.6px_0px_rgba(245,90,172,0.50)] lg:min-h-full'
    >
      <div className='relative grow space-y-2 p-3'>
        <h3 className='group-hover:text-gradient-main text-lg font-medium text-white lg:text-2xl'>{title}</h3>
        <p className='line-clamp-2'>{content}</p>
        <div className='relative flex flex-wrap gap-2'>
          {tags.map((tag) => (
            <div
              key={tag}
              className='flex min-h-5 items-center justify-center rounded border border-white/40 px-2 py-1 text-xs text-white/40'
            >
              {tag}
            </div>
          ))}
        </div>
        <ArrowRight className='absolute right-3 top-2 rotate-0 text-white/40 transition group-hover:-rotate-45 group-hover:text-white lg:bottom-3' />
      </div>
      <div className='relative h-[136px] min-h-[136px] w-full shrink-0 lg:h-[255px] lg:min-h-[255px]'>
        {videoSrc ? (
          <>
            <InViewPlayVideo src={videoSrc} className='size-full' poster={videoPosterSrc} />
            <img
              src={imageSrc}
              alt={title}
              loading='lazy'
              decoding='async'
              fetchPriority='low'
              className='absolute bottom-1 left-1 w-[85px] rounded lg:w-[160px]'
            />
          </>
        ) : (
          <img src={imageSrc} alt={title} className='size-full' loading='lazy' decoding='async' fetchPriority='low' />
        )}
        <div className='absolute bottom-3 right-3 rounded-lg border border-white bg-white/40 px-3 py-1 backdrop-blur-sm transition duration-200'>
          {t('start')}
        </div>
      </div>
    </Link>
  );
}
