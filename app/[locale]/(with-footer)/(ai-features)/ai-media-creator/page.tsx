import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { createLocalizedMetadata } from '@/lib/seo/metadata';
import CreatorHistory from '@/components/unified-generator/CreatorHistory';
import UnifiedGeneratorForm from '@/components/unified-generator/UnifiedGeneratorForm';

import AIMediaCreatorPublicSections from './_components/AIMediaCreatorPublicSections';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: 'Metadata.ai-media-creator',
  });

  return createLocalizedMetadata({
    locale,
    pathname: '/ai-media-creator',
    title: t('title'),
    description: t('description'),
  });
}

export default function Page() {
  return (
    <main className='relative w-full flex-1'>
      <div className='p-3'>
        <UnifiedGeneratorForm />
      </div>
      <div className='container-centered py-10 lg:py-14'>
        <CreatorHistory />
      </div>
      <AIMediaCreatorPublicSections />
    </main>
  );
}
