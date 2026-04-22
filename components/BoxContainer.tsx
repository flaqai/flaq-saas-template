import { cn } from '@/lib/utils';

export default function BoxContainer({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        'mt-1 w-full overflow-hidden rounded-2xl rounded-tl-none border-2 border-[#2C2D36] bg-[#1F1D25]',
        className,
      )}
    >
      {children}
    </div>
  );
}
