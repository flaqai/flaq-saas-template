import { cn } from '@/lib/utils';
import { Link } from '@/i18n/navigation';

export default function LinkBtn({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        'flex items-center justify-center rounded-lg bg-color-main px-8 py-2.5 font-semibold backdrop-blur-sm hover:cursor-pointer hover:opacity-80',
        className,
      )}
    >
      {children}
    </Link>
  );
}
