import { useTranslations } from 'next-intl';

import { numberList } from '@/lib/utils/arrayUtils';

export const metadata = {
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function Page() {
  const t = useTranslations('FooterNavigation.refundPolicy');

  return (
    <div className='prose mx-auto py-[60px] text-gray-200 prose-headings:text-gray-200 lg:py-[120px]'>
      <h1>{t('title')}</h1>
      {numberList(6).map((num) => (
        <div key={num}>
          <h2 className='text-2xl font-bold'>{t(`${num}.title`)}</h2>
          <p className='whitespace-pre-line'>{t(`${num}.description`)}</p>
        </div>
      ))}
    </div>
  );
}
