import { Slot } from '@radix-ui/react-slot';

import { cn } from '@/lib/utils';

export default function ButtonBox({
  asChild = false,
  children,
  className,
}: {
  asChild?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      className={cn(
        'flex h-[45px] items-center justify-between rounded border border-[var(--c-light-light-gray2)] px-4 lg:justify-center',
        className,
      )}
    >
      {children}
    </Comp>
  );
}
