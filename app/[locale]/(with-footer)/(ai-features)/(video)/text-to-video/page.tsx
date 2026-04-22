import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { numberList } from '@/lib/utils/arrayUtils';
import Faq from '@/components/Faq';
import FYIItem from '@/components/fyi-item';
import CoreFeaturesCards from '@/components/home/newSections2/CoreFeaturesCards';
import VideoCarousel from '@/components/home/video-carousel';
import Heading from '@/components/internal-page/heading';

import Form from './form';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: 'Metadata.text-to-video',
  });

  return {
    title: t('title'),
    description: t('description'),
  };
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: 'text-to-video',
  });

  return (
    <div className='flex-1'>
      <div className='container-centered container-gap'>
        <div className='flex w-full flex-col gap-5'>
          <Form />
          <FYIItem mediaType='video' />
        </div>
        <Heading title={t('heading.title')} description={t('heading.description')} />
      </div>
      <VideoCarousel
        title={t('example.title')}
        description={t('example.description')}
        list={numberList(2).map((num) => ({
          id: num.toString(),
          prompt: t(`example.${num}.prompt`),
          videoSrc: `https://cdn.heydream.im/heydream/v2/text_to_video/example/example${num}.1.mp4`,
        }))}
      />
      <CoreFeaturesCards
        iconType='example'
        cardStyle='square'
        title={t('core-feature.title')}
        description={t('core-feature.description')}
        buttonHref='#'
        cardsLayout='row'
        features={numberList(3).map((num) => ({
          title: t(`core-feature.${num}.title`),
          description: t(`core-feature.${num}.description`),
        }))}
      />
      <CoreFeaturesCards
        iconType='useCase'
        title={t('advantage.title')}
        description={t('advantage.description')}
        buttonText={t('advantage.try-now')}
        buttonHref='#'
        cardsLayout='grid'
        features={numberList(4).map((num) => ({
          title: t(`advantage.${num}.title`),
          description: t(`advantage.${num}.description`),
        }))}
      />
      <CoreFeaturesCards
        iconType='manual'
        title={t('manual.title')}
        description={t('manual.content')}
        buttonHref='#'
        cardsLayout='row'
        features={numberList(3).map((num) => ({
          title: t(`manual.${num}.title`),
          description: t(`manual.${num}.description`),
        }))}
      />

      <Faq
        title={t('faq.title')}
        faqList={numberList(6).map((num) => ({
          id: num,
          question: t(`faq.${num}.question`),
          answer: t(`faq.${num}.answer`),
        }))}
        className='py-[60px] lg:py-[120px]'
      />
    </div>
  );
}
