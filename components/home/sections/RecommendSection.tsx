import { ArrowUpRight, MapPin } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Link } from '@/i18n/navigation';

type BlogData = {
  id: string;
  title: string;
  content: string;
  tagsList?: string[];
};

export const homeBlogData: BlogData[] = [
  {
    id: 'Flux-Pro-AI%3A-Revolutionizing-Image-Generation-with-Advanced-Technology-6aba6373a1d1',
    title: 'Flux Pro Art AI: Revolutionizing Image Generation with Advanced Technology',
    content:
      'Flux Pro Art AI, powered by the FLUX.1 Pro model developed by Black Forest Labs, is at the forefront of text-to-image generation technology.',
    tagsList: ['Flux AI', 'Flux.1 Pro AI', 'Flux Pro Art', 'Black Forest Labs'],
  },
  {
    id: 'Flux-1-Pro-vs-MidJourney%3A-A-Detailed-Comparison-58548bfd80eb',
    title: 'Flux.1 Pro vs MidJourney: A Detailed Comparison',
    content:
      'In the world of AI-generated imagery, two names frequently dominate the conversation: Flux.1 Pro vs MidJourney. Both are powerful models offering unique advantages, and deciding between them depends on several factors, such as image quality, speed, and user-friendliness. This article compares Flux.1 Pro vs MidJourney, highlighting which tool is best for various use cases.',
    tagsList: ['Flux AI', 'MidJourney', 'Flux 1.1 Pro', 'Black Forest Labs'],
  },
  {
    id: 'Introduction-Flux-1-1-Pro%3A-Revolutionizing-AI-Image-Generation-e52587062893',
    title: 'Introduction Flux 1.1 Pro: Revolutionizing AI Image Generation',
    content:
      'Flux 1.1 Pro introduces groundbreaking advancements in AI image generation, crafted by the visionary team at Black Forest Labs (BFL).',
    tagsList: ['Flux AI', 'Flux 1.1 Pro', 'Flux Pro Art', 'Black Forest Labs'],
  },
];

export const pricingBlogData: BlogData[] = [];
export const fluxAiImageGeneratorBlogData: BlogData[] = [];
export const landingPageFluxProNetBlogData: BlogData[] = [];

function LinkItem({
  title,
  content,
  href,
  tagsList,
}: {
  title: string;
  content: string;
  href: string;
  tagsList?: string[];
}) {
  return (
    <div className='w-full space-y-px lg:w-[682px]'>
      <Link href={href}>
        <div className='flex h-[118px] w-full justify-between gap-16 rounded-t-xl bg-color-5 p-3 hover:opacity-70'>
          <div className='flex flex-col gap-2.5'>
            <h3 className='line-clamp-1 text-2xl font-semibold'>{title}</h3>
            <p className='line-clamp-2 text-white/70'>{content}</p>
          </div>
          <div className='mt-auto shrink-0'>
            <ArrowUpRight />
          </div>
        </div>
      </Link>
      <ul className='no-scrollbar flex items-center gap-3 overflow-x-auto rounded-b-xl bg-color-5 p-3'>
        {tagsList?.map((tag) => (
          <li
            key={tag}
            className='flex shrink-0 items-center gap-1 rounded-lg border border-color-20 px-3 py-2 text-white/70'
          >
            <MapPin className='size-5' />
            {tag}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function RecommendSection({ blogData, title }: { blogData: BlogData[]; title: string }) {
  return (
    <div className='flex w-full flex-col items-center gap-5 px-3 py-[60px] lg:px-0 lg:py-[120px]'>
      <h2 className='text-2xl font-semibold lg:text-3xl'>{title}</h2>
      <div className='grid grid-cols-1 gap-3 lg:w-auto  lg:grid-cols-2 lg:flex-row'>
        {blogData.map((el) => (
          <LinkItem
            key={el.id}
            href={`/blog/detail/${el.id}`}
            title={el.title}
            content={el.content}
            tagsList={el.tagsList}
          />
        ))}
      </div>
    </div>
  );
}

export function RecommendSectionContainer({ code, blogData }: { code: string; blogData: BlogData[] }) {
  const t = useTranslations(code);
  return <RecommendSection blogData={blogData} title={t('RecommendSection.title')} />;
}
