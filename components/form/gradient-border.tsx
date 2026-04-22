import { cn } from '@/lib/utils';

export default function GradientBorder({
  children,
  active = true,
  className,
  outerClassName,
}: {
  children: React.ReactNode;
  active?: boolean;
  className?: string;
  outerClassName?: string;
}) {
  return (
    <div className={cn('flex rounded-lg p-px', active && 'bg-color-main', outerClassName)}>
      <div
        className={cn(
          'box-border flex flex-1 items-center justify-center gap-1 rounded-inherit px-5 py-3 font-semibold',
          active && 'bg-[#2C2C2D]',
          className,
        )}
      >
        {children}
      </div>
    </div>
  );
}
