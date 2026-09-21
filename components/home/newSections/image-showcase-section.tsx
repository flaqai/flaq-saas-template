'use client';

import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';

import CopyBtn from '@/components/CopyBtn';
import { ExampleIcon } from '@/components/svg/section/common';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import SubHeading from '../../internal-page/sub-heading';

interface ShowcaseItem {
  id: string;
  imgSrc: string;
  imgAlt: string;
  isPrompt?: boolean;
  promptContent?: string;
}

function Showcase({ title, dataList }: { title: string; dataList: ShowcaseItem[] }) {
  const t = useTranslations('Common');
  const imgCount = dataList.length;

  return (
    <div className='flex w-full flex-col gap-3 rounded-xl border border-[#2f2f2f] bg-[#141516] p-3 md:p-4'>
      <h3 className='text-base font-semibold leading-6 text-white/70 md:text-lg'>{title}</h3>
      <div
        className={cn(
          'grid grid-cols-1 gap-3',
          imgCount === 1 && 'lg:grid-cols-1',
          imgCount === 2 && 'lg:grid-cols-2',
          imgCount === 3 && 'lg:grid-cols-3',
        )}
      >
        {dataList.map((el) => (
          <div key={el.id} className='flex flex-col gap-2'>
            <div className='overflow-hidden rounded-lg'>
              <img src={el.imgSrc} alt={el.imgAlt} className='h-auto w-full' />
            </div>
            {el.isPrompt ? (
              <div className='flex flex-col gap-1.5'>
                <div className='flex items-center gap-2'>
                  <span className='text-sm font-medium text-white/70'>
                    {el.promptContent ? (el.imgAlt ? `${el.imgAlt} (${t('prompt')})` : t('prompt')) : t('prompt')}
                  </span>
                  <CopyBtn content={el.promptContent || el.imgAlt} className='text-white/70' />
                </div>
                {(el.promptContent || el.imgAlt) && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <p className='line-clamp-5 cursor-help whitespace-pre-line text-sm font-normal leading-5 text-white/70'>
                          {el.promptContent || el.imgAlt}
                        </p>
                      </TooltipTrigger>
                      <TooltipContent className='max-w-md break-words'>
                        <p className='whitespace-pre-line text-sm'>{el.promptContent || el.imgAlt}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
            ) : (
              <p className='line-clamp-5 text-sm font-normal leading-5 text-white/70'>{el.imgAlt}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

interface ImageShowcaseSectionProps {
  title: string;
  description: string;
  dataList: {
    title: string;
    imgList: ShowcaseItem[];
  }[];
}

export default function ImageShowcaseSection({ title, description, dataList }: ImageShowcaseSectionProps) {
  return (
    <div className='container-py container-centered space-y-3'>
      <SubHeading className='mb-5' icon={<ExampleIcon className='hidden lg:block' />} title={title} description={description} />
      {dataList.map((el) => (
        <Showcase key={el.title} title={el.title} dataList={el.imgList} />
      ))}
    </div>
  );
}
