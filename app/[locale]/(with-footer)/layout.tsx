import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import WithFooterLayoutShell from '@/components/home/WithFooterLayoutShell';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Metadata.home');

  return {
    title: t('title'),
    description: t('description'),
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <WithFooterLayoutShell>{children}</WithFooterLayoutShell>;
}
