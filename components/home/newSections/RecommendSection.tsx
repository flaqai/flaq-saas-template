/* eslint-disable @typescript-eslint/indent */
/* eslint-disable react/jsx-indent */
import { Link } from '@/i18n/navigation';
import { ArrowUpRight } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { formatDate } from '@/lib/utils/timeUtils';

type BlogData = {
  id: string;
  title: string;
  content: string;
  tagsList?: string[] | string;
};
export function LinkItem({
  title,
  content,
  href,
  tagsList,
  createTime,
}: {
  title: string;
  content: string;
  href: string;
  tagsList?: string[] | string;
  createTime?: number;
}) {
  const t = useTranslations('Common');
  const hasTags = tagsList && tagsList?.length > 0;

  return (
    <Link href={href}>
      <div className='flex w-full flex-col border-b border-[#1677FF] pb-3 hover:opacity-70'>
        <div className='flex flex-col gap-2'>

          {/* 创建时间 */}
          {createTime && (
            <div className='text-sm text-[#1677FF]'>
              {formatDate(createTime)}
            </div>
          )}

          {/* 标题 + 内容 */}
          <p className='line-clamp-1 text-lg font-semibold'>{title}</p>
          <p className='line-clamp-2 text-sm text-white/70'>{content}</p>
          
          {/* 模型标签列表 */}
          {hasTags && (
            <ul className='no-scrollbar flex items-center gap-2 overflow-x-auto mb-2'>
              {Array.isArray(tagsList)
                ? tagsList?.map((tag) => (
                    <li
                      key={tag}
                      className='shrink-0 rounded border border-[#424242] px-2 py-1 text-xs text-white/70'
                    >
                      {tag}
                    </li>
                  ))
                : tagsList?.split(',').map((tag) => (
                    <li
                      key={tag}
                      className='shrink-0 rounded border border-[#424242] px-2 py-1 text-xs text-white/70'
                    >
                      {tag}
                    </li>
                  ))}
            </ul>
          )}
        </div>
        
        {/* 阅读更多按钮 */}
        <div className='mt-auto flex items-center gap-1 text-sm'>
          <span className="underline underline-offset-4">{t('read-more')}</span>
          <ArrowUpRight className='size-4' />
        </div>
      </div>
    </Link>
  );
}

export default function RecommendSection({ blogData, title }: { blogData: BlogData[]; title: string }) {
  return (
    <div className='max-w-pc mx-auto flex w-full flex-col items-center gap-4 px-2 lg:px-0'>
      <h2 className='text-xl font-semibold lg:text-2xl'>{title}</h2>
      <div className='grid grid-cols-1 gap-[18px] lg:w-auto lg:grid-cols-2 lg:flex-row'>
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

export function RecommendSectionContainer({
  code,
  blogData,
  title,
}: {
  code: string;
  blogData: BlogData[];
  title?: string;
}) {
  const t = useTranslations(code);
  return <RecommendSection blogData={blogData} title={title || t('RecommendSection.title')} />;
}
