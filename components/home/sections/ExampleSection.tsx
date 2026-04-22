'use client';

import React from 'react';
import useDefaultModalStore from '@/store/useDefaultModalStore';
import { ArrowRight } from 'lucide-react';

import { cn } from '@/lib/utils';
import { useRouter } from '@/i18n/navigation';

import LinkBtn from '../new-section/link-btn';

type BaseCardType = {
  prompt: string;
  isWide: boolean;
};

type TextCardType = BaseCardType & {
  texts: Array<{ title: string; description: string }>;
};

type ButtonCardType = BaseCardType & {
  texts: Array<{ title: string; description: string }>;
  btnText: string;
  btnLink: string;
};

type ImageCardType = BaseCardType & {
  bgImage: string;
};

type CardType = TextCardType | ButtonCardType | ImageCardType;

export type ExampleSectionProps = {
  promptTitle: string;
  title: string;
  subtitle: string;
  imageClickLink: string;
  sections: CardType[];
};

export default function ExampleSection({
  title,
  subtitle,
  promptTitle,
  imageClickLink,
  sections,
}: ExampleSectionProps) {
  const router = useRouter();
  const { updateDefaultStore } = useDefaultModalStore();
  const handleClick = (link: string, prompt: string) => {
    router.push(link);
    updateDefaultStore({ prompt });
  };
  return (
    <div className='container-centered container-py'>
      <div className='mb-4 md:mb-8'>
        <h2 className='text-center text-[32px] font-semibold capitalize leading-[36px] tracking-[0.06em] text-white md:text-[48px] md:leading-[54px] md:tracking-[0.04em]'>
          {title}
        </h2>
        <p className='mt-1 text-center text-base font-normal capitalize leading-6 tracking-[0.04em] text-[#b8b8b8] md:text-center md:text-base md:capitalize md:leading-6 md:tracking-[0.04em]'>
          {subtitle}
        </p>
      </div>

      <div className='grid grid-cols-1 gap-5 md:grid-cols-3'>
        {sections.map((section, index) => (
          <div
            key={index}
            className={cn(
              'relative aspect-square overflow-hidden rounded-[10px]',
              section.isWide && 'md:col-span-2 md:aspect-auto',
              section.isWide && 'bgImage' in section && 'aspect-[2/1.1]',
              !section.isWide && 'texts' in section && 'aspect-auto pt-8 md:aspect-square md:pt-0',
              section.isWide && 'texts' in section && 'aspect-[2/1.6]',
              'group cursor-pointer',
            )}
          >
            {'bgImage' in section && (
              <div
                className='absolute inset-0 cursor-pointer bg-cover bg-center outline-hidden transition-all duration-300 group-hover:scale-110'
                style={{ backgroundImage: `url(${section.bgImage})` }}
              />
            )}

            {'texts' in section && (
              <div
                className={cn(
                  'flex flex-col space-y-4 lg:space-y-8',
                  'btnText' in section ? 'justify-start' : 'justify-end',
                )}
              >
                {section.texts.map((text, i) => (
                  <div className={cn('flex gap-1.5', 'btnText' in section ? 'flex-col' : 'flex-col-reverse')} key={i}>
                    <h3 className='text-[24px] font-semibold capitalize leading-tight text-[#b8b8b8] lg:text-[32px]'>
                      {text.title}
                    </h3>
                    <p className='line-clamp-3 text-sm font-normal capitalize leading-tight text-[#b8b8b8] lg:text-base'>
                      {text.description}
                    </p>
                  </div>
                ))}
                {'btnText' in section && (
                  <LinkBtn href={section.btnLink} className='mt-auto! w-fit gap-1'>
                    {section.btnText} <ArrowRight className='size-5' />
                  </LinkBtn>
                )}
              </div>
            )}
            {'bgImage' in section && (
              <div
                role='button'
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleClick(imageClickLink, section.prompt);
                }}
                onClick={() => handleClick(imageClickLink, section.prompt)}
                className='pointer-events-none absolute inset-0 flex cursor-pointer flex-col justify-end bg-black/70 p-4 opacity-0 transition-opacity duration-300 hover:pointer-events-auto group-hover:opacity-100'
              >
                <p className='text-[32px] font-semibold capitalize leading-[48px] tracking-[0.02em] text-white'>
                  {promptTitle}
                </p>
                <p className='line-clamp-4 text-base font-bold capitalize leading-6 tracking-[0.04em] text-white'>
                  {section.prompt}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
