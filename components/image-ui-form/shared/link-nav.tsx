import { Link } from '@/i18n/navigation';
import { ChevronRight } from 'lucide-react';

export default function LinkNav({ children, href }: { children: React.ReactNode; href: string }) {
  return (
    <Link
      href={href}
      className='flex items-center justify-between gap-2 rounded-xl border border-[var(--c-light-light-gray2)] px-5 py-3 text-sm hover:border-gradient-main hover:text-gradient-main'
    >
      <span className='truncate'>{children}</span>
      <ChevronRight className='size-5' />
    </Link>
  );
}
