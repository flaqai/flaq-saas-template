'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { getLanguagePaths } from '@/i18n/languages';
import { Link } from '@/i18n/navigation';
import { useLocale, useTranslations } from 'next-intl';

import { NAV_LINKS } from '@/lib/constants';
import { cn } from '@/lib/utils';

import LocaleSwitcher from '../LocaleSwitcher';
import MenuBtn from './MenuBtn';
import NavigationDrawer from './NavigationDrawer';
import NavPopover from './NavPopover';

export default function Navigation() {
  const t = useTranslations('Navigation');
  const pathname = usePathname();
  const locale = useLocale();

  const [open, setOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const languagePaths = getLanguagePaths();
    if (!languagePaths.includes(pathname)) {
      setIsScrolled(true);
      return;
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 70);
    };

    window.addEventListener('scroll', handleScroll);
    // eslint-disable-next-line consistent-return
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [pathname]);

  const NavLinks = NAV_LINKS.map((item) => ({
    ...item,
    label: t(`${item.code}`),
    children:
      item.children &&
      item.children
        ?.filter((el) => el.code !== 'dream-ai-video')
        .map((child) => ({
          ...child,
          label: t(`${child.code}`),
          description: t(`${child.code}-content`),
        })),
  }));

  return (
    <>
      <header
        className={cn(
          'sticky top-0 left-0 z-50 flex h-[64px] w-full bg-transparent px-3 lg:px-10',
          isScrolled && 'backdrop-blur-md',
        )}
      >
        <nav className='relative flex w-full flex-1 items-center justify-center gap-3'>
          <div className='absolute left-0'>
            <Link className='shrink-0 hover:opacity-80' href='/' title={t('title')}>
              <img src='/images/logo.png' alt={t('title')} title={t('title')} className='size-12 md:size-16' />
            </Link>
          </div>
          {/* pc */}
          <div className='hidden h-10 items-center gap-3 lg:flex'>
            {NavLinks.map((item) => (
              <div key={item.code}>
                {item.children ? (
                  // 客户端挂载后才渲染 Radix Popover，避免 hydration id 不一致
                  mounted ? (
                    <NavPopover label={item.label} isHighLight={false} navDataList={item.children} />
                  ) : (
                    <button
                      type='button'
                      className='flex h-10 min-h-10 items-center gap-1 rounded-lg px-1 text-white/70 hover:bg-white/15'
                    >
                      <span className='text-base font-semibold'>{item.label}</span>
                    </button>
                  )
                ) : (
                  <Link
                    key={item.code}
                    href={item.href as string}
                    className={cn(
                      'flex h-10 items-center justify-center rounded-lg px-1.5 font-semibold text-white/70 hover:bg-white/15',
                      pathname === item.href && 'text-color-main',
                      pathname.startsWith(item.href as string) && item.href !== '/' && 'text-color-main',
                      pathname.startsWith(`/${locale}${item.href}`) && item.href !== '/' && 'text-color-main',
                    )}
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
          </div>
          <div className='absolute right-0 flex items-center'>
            <div className='bg-color-5 flex items-center gap-x-1 rounded lg:gap-x-3'>
              {mounted ? (
                <LocaleSwitcher />
              ) : (
                <div className='flex h-8 w-[80px] items-center gap-1 rounded-lg px-2 text-white/40 lg:h-11' />
              )}
            </div>
            {/* mobile */}
            <div className='mx-2 flex items-center gap-x-4 lg:hidden'>
              <MenuBtn open={open} onClick={() => setOpen(!open)} />
            </div>
          </div>
        </nav>
      </header>
      <NavigationDrawer open={open} setOpen={setOpen} />
    </>
  );
}
