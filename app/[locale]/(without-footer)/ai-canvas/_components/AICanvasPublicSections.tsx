import { getTranslations } from 'next-intl/server';

import { numberList } from '@/lib/utils/arrayUtils';
import Faq from '@/components/Faq';
import CanvasExampleSection from '@/components/infinite-canvas/integration/canvas-example-section';
import CoreFeaturesCards from '@/components/home/newSections2/CoreFeaturesCards';
import Heading from '@/components/internal-page/heading';
import ResourceEntrySections from '@/components/resource-entry/ResourceEntrySections';

export default async function AICanvasPublicSections() {
  const t = await getTranslations('InfiniteCanvas.landing');

  return (
    <div className='flex w-full flex-col items-center overflow-hidden'>
      <div className='container-centered container-py'>
        <Heading title={t('heading.title')} description={t('heading.description')} align='left' />
      </div>
      <CanvasExampleSection
        title={t('example.title')}
        description={t('example.description')}
        videoSrc='https://cdn.heydream.im/heydream/v3/hey_dream_canvas/example/1.mp4'
        posterSrc='https://cdn.heydream.im/heydream/v3/hey_dream_canvas/example/1.webp'
      />
      <ResourceEntrySections />
      <CoreFeaturesCards
        iconType='example'
        cardStyle='square'
        title={t('features.title')}
        description={t('features.description')}
        buttonHref='#'
        cardsLayout='row'
        features={numberList(4).map((num) => ({
          title: t(`features.${num}.title`),
          description: t(`features.${num}.description`),
        }))}
      />
      <CoreFeaturesCards
        iconType='useCase'
        title={t('useCases.title')}
        description={t('useCases.description')}
        buttonText={t('useCases.tryNow')}
        buttonHref='#'
        cardsLayout='grid'
        features={numberList(4).map((num) => ({
          title: t(`useCases.${num}.title`),
          description: t(`useCases.${num}.description`),
        }))}
      />
      <CoreFeaturesCards
        iconType='manual'
        title={t('manual.title')}
        description={t('manual.description')}
        buttonText={t('manual.tryNow')}
        buttonHref='#'
        cardsLayout='row'
        features={numberList(3).map((num) => ({
          title: t(`manual.${num}.title`),
          description: t(`manual.${num}.description`),
        }))}
      />
      <Faq
        title={t('faq.title')}
        faqList={numberList(7).map((num) => ({
          id: num,
          question: t(`faq.${num}.question`),
          answer: t(`faq.${num}.answer`),
        }))}
        className='py-[60px] lg:py-[120px]'
      />
    </div>
  );
}
