import { languages } from '@/i18n/languages';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';

import { IMAGE_CHILDREN_LIST, VIDEO_CHILDREN_LIST } from '@/lib/constants';
import BusinessButton from './BusinessButton';
import Github from '../svg/footer/Github';

function InfoList({
  title,
  dataList,
  prefetch = true,
}: {
  title: string;
  dataList: Array<{
    title: string;
    href?: string;
    target?: React.HTMLAttributeAnchorTarget;
    type?: string;
    isBusinessButton?: boolean;
  }>;
  prefetch?: boolean;
}) {
  return (
    <div className='flex flex-col items-center gap-3 lg:items-start'>
      <p className='text-white/40'>{title}</p>
      <ul className='flex flex-col items-center gap-3 lg:items-start'>
        {dataList.map((el, index) => (
          <li key={el.href || index}>
            {el.isBusinessButton ? (
              <BusinessButton className='flex items-center gap-1 text-xs text-nowrap hover:underline lg:text-sm'>
                {el.title}
              </BusinessButton>
            ) : (
              <Link
                href={el.href!}
                title={el.title}
                className='flex items-center gap-1 text-xs text-nowrap hover:underline lg:text-sm'
                target={el.target}
                type={el.type}
                prefetch={prefetch}
              >
                {el.title}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  const t = useTranslations('Footer');

  const FEATURE_LINK = [...VIDEO_CHILDREN_LIST, ...IMAGE_CHILDREN_LIST]
    .filter((r) => !r.hideInFooter)
    .map((r) => ({ title: t(`feature.${r.code}`), href: r.href }));

  const INFO_LIST = [
    {
      title: t('docs'),
      href: 'https://flaq.ai/docs',
      target: '_blank' as const,
    },
    {
      title: t('flaq'),
      href: 'https://flaq.ai',
      target: '_blank' as const,
    },
    {
      title: t('business'),
      isBusinessButton: true,
    },
    {
      title: t('privacy'),
      href: '/privacy-policy',
    },
    {
      title: t('termsConditions'),
      href: '/terms-of-service',
    },
    {
      title: t('refundPolicy'),
      href: '/refund-policy',
    },
  ];

  return (
    <footer className='w-full bg-black'>
      <div className='max-w-pc mx-auto flex min-h-[252px] flex-col items-center justify-between p-10 pb-5 lg:flex-row lg:px-0 lg:pb-10'>
        <div className='flex flex-col items-center space-y-3 lg:items-stretch'>
          <p className='text-xl font-bold text-white lg:h-8 lg:text-[32px]'>{t('title')}</p>
          <p className='text-xs'>{t('subTitle')}</p>
        </div>
        <div className='mt-5 flex flex-col items-center gap-y-5 lg:mt-0 lg:flex-row lg:items-stretch lg:gap-x-10'>
          <InfoList title={t('feature-link')} dataList={FEATURE_LINK} />
          <InfoList
            title={t('support')}
            dataList={[
              ...INFO_LIST,
              {
                title: t('contactUs'),
                href: `mailto:${process.env.NEXT_PUBLIC_CONTACT_US_EMAIL}`,
                type: 'email',
              },
            ]}
          />
        </div>
      </div>
      <div className='h-px w-full bg-white/20' />
      <div className='max-w-pc mx-auto flex w-full flex-col items-center justify-between gap-5 py-10 lg:h-16 lg:flex-row lg:py-0'>
        <div className='flex flex-col items-center gap-3 lg:flex-row'>
          <img
            src='/images/logo.png'
            alt='logo'
            className='size-10'
            fetchPriority='low'
            loading='lazy'
            decoding='async'
          />
          <div className='flex flex-col items-center lg:flex-row'>
            © 2026 Flaq AI - <span className='text-wrap'>6677 Tech Limited</span>
          </div>
        </div>
        <div className='flex items-center gap-4'>
          <a
            href='https://flaq.ai'
            target='_blank'
            rel='noopener noreferrer'
            className='flex items-center gap-2 text-white/70 transition-colors hover:text-white'
            title='Flaq AI'
          >
            <img
              src='/images/flaq-logo.svg'
              alt='Flaq AI'
              className='size-8'
              loading='lazy'
              decoding='async'
            />
          </a>
          <a
            href='https://github.com/flaqai/flaq-saas-template'
            target='_blank'
            rel='noopener noreferrer'
            className='text-white/70 transition-colors hover:text-white'
            title='GitHub Repository'
          >
            <Github className='size-8' />
          </a>
        </div>
      </div>
      <div className='h-px w-full bg-white/20' />
      <div className='max-w-pc mx-auto grid w-full grid-cols-3 items-center justify-center gap-5 p-5 lg:flex lg:h-16 lg:p-0'>
        {languages.map((language) => (
          <Link
            href={`${process.env.NEXT_PUBLIC_SITE_URL}/${language.lang}/`}
            key={language.code}
            className='hover:underline'
            prefetch={false}
          >
            {language.label}
          </Link>
        ))}
      </div>
    </footer>
  );
}
