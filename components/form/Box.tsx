import { cn } from '@/lib/utils';

export default function Box({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        'flex h-9 shrink-0 items-center justify-center rounded border border-[#2a2b2f] bg-[#1c1d20] text-sm text-white',
        className,
      )}
    >
      {children}
    </div>
  );
}
