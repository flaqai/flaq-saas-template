import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { createLocalizedMetadata } from '@/lib/seo/metadata';

import ReferenceToVideoForm from './_components/ReferenceToVideoForm';
import ReferenceToVideoPublicSections from './_components/ReferenceToVideoPublicSections';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: 'Metadata.reference-to-video',
  });

  return createLocalizedMetadata({
    locale,
    pathname: '/reference-to-video',
    title: t('title'),
    description: t('description'),
  });
}

export default function Page() {
  return (
    <div className='relative w-full flex-1'>
      <div className='p-3'>
        <ReferenceToVideoForm />
      </div>
      <ReferenceToVideoPublicSections />
    </div>
  );
}
