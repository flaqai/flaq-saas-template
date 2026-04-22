import { cn } from '@/lib/utils';

export default function LoadingDots({ className }: { className?: string }) {
  return (
    <div className='flex items-center justify-center gap-1.5'>
      <div className={cn('size-1.5 animate-bounce rounded-full bg-white [animation-delay:-0.3s]', className)} />
      <div className={cn('size-1.5 animate-bounce rounded-full bg-white [animation-delay:-0.15s]', className)} />
      <div className={cn('size-1.5 animate-bounce rounded-full bg-white', className)} />
    </div>
  );
}
