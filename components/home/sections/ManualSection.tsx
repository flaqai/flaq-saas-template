import { cn } from '@/lib/utils';
import TriArrow from '@/components/svg/home/TriArrow';

export default function ManualSection({
  title,
  content,
  stepList,
  className,
  subTitle,
}: {
  title: string;
  content: string;
  stepList: { title: string; description?: string }[];
  className?: string;
  subTitle?: string;
}) {
  return (
    <section className={cn('mx-auto flex w-full flex-col items-center gap-5 text-center lg:max-w-[681px]', className)}>
      <div className='text-center'>
        <h2 className='text-4xl font-semibold'>{title}</h2>
        <p className='text-balance text-white/70'>{content}</p>
      </div>
      <div className='flex w-full flex-col items-center gap-3 rounded-xl border border-[#2f2f2f] bg-[#141516] py-10'>
        {subTitle && (
          <div className='text-center text-lg leading-7 font-semibold tracking-[0.06em] text-white capitalize lg:text-xl lg:leading-9'>
            {subTitle}
          </div>
        )}
        <div className='border-color-main size-4 rounded-full border border-solid' />
        {stepList.map((el, idx, list) => (
          <div key={el.title} className='flex flex-col items-center gap-3 text-white/70'>
            <div className='flex flex-col items-center gap-px text-lg'>
              <p className='font-semibold whitespace-pre-line'>{el.title}</p>
              {!!el.description && <div className='text-sm text-white/50'>{el.description}</div>}
            </div>
            {idx < list.length - 1 && <TriArrow />}
          </div>
        ))}
      </div>
    </section>
  );
}
