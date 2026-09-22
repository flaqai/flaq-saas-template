import { getNavigationIcon, isNavigationIconImage } from '@/lib/constants/navigation-icons';
import { cn } from '@/lib/utils';

export default function NavigationIcon({ code, href, isActive }: { code: string; href: string; isActive: boolean }) {
  const icon = getNavigationIcon(code, href);

  if (!icon) return null;

  if (isNavigationIconImage(icon)) {
    return (
      <span className='mt-0.5 flex size-5 shrink-0 items-center justify-center' aria-hidden='true'>
        <img src={icon.off} alt='' className='size-full object-contain group-hover:hidden' loading='lazy' decoding='async' />
        <img src={icon.on} alt='' className='hidden size-full object-contain group-hover:block' loading='lazy' decoding='async' />
      </span>
    );
  }

  const Icon = icon;

  return (
    <span className='mt-0.5 flex size-5 shrink-0 items-center justify-center' aria-hidden='true'>
      <Icon className={cn('size-full text-[#CFCFCF] transition-colors group-hover:text-color-main', isActive && 'text-color-main')} />
    </span>
  );
}
