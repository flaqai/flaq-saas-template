import { cn } from '@/lib/utils';

export default function Box({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('flex h-9 items-center justify-center rounded border border-[#2a2b2f] bg-[#1c1d20] px-3 text-sm text-[#b8b8b8]', className)}>
      {children}
    </div>
  );
}
