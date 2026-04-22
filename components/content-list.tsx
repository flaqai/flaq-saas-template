import { cn } from '@/lib/utils';

export default function ContentList({
  list,
  itemClassName,
  colCount = 3,
  className,
}: {
  list: { title: string; content: React.ReactNode }[];
  itemClassName?: string;
  colCount?: number;
  className?: string;
}) {
  const remainder = list.length % colCount;
  const placeholdersNeeded = remainder ? colCount - remainder : 0;

  const filledList = [...list, ...Array(placeholdersNeeded).fill({ title: '', content: '' })];

  return (
    <div
      className={cn(
        'grid w-full grid-cols-1 gap-px overflow-hidden rounded-xl bg-color-10 p-px lg:grid-cols-3',
        className,
      )}
    >
      {filledList.map((item, idx) => (
        <div
          // eslint-disable-next-line react/no-array-index-key
          key={idx}
          className={cn(
            'flex h-12 items-center justify-between gap-2 bg-color-5 px-5 text-white/70',
            item.title === '' && 'hidden lg:block',
            itemClassName,
          )}
        >
          <div className='truncate text-white/40'>{item.title}</div>
          <div className='shrink-0'>{item.content}</div>
        </div>
      ))}
    </div>
  );
}
