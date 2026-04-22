import { cn } from '@/lib/utils';

export default function Box({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('w-full bg-[#1F1D25] px-3 py-4', className)}>{children}</div>;
}
