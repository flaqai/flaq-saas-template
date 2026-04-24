import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { numberList } from '@/lib/utils/arrayUtils';
import Faq from '@/components/Faq';
import ImageShowcaseSection from '@/components/home/newSections/image-showcase-section';
import CoreFeaturesCards from '@/components/home/newSections2/CoreFeaturesCards';
import ImageForm from '@/components/image-ui-form/image-form';
import Heading from '@/components/internal-page/heading';

const DEFAULT_PRIORITY = {
  aspectRatio: ['16:9', '1:1'],
  resolution: ['2k'],
};

const DEFAULT_VALUES = {
  prompt: '',
  images: [],
  modelVersion: 'nano-banana-pro-edit',
  aspectRatio: '16:9',
  resolution: '2k',
};

const EXAMPLE_IMAGE_LIST = [
  [
    '/flaqai_saas_asserts/image_to_image/feature/1_1.webp',
    '/flaqai_saas_asserts/image_to_image/feature/1_2.webp',
  ],
  [
    '/flaqai_saas_asserts/image_to_image/feature/2_1.webp',
    '/flaqai_saas_asserts/image_to_image/feature/2_2.webp',
  ],
  [
    '/flaqai_saas_asserts/image_to_image/feature/3_1.webp',
    '/flaqai_saas_asserts/image_to_image/feature/3_2.webp',
  ],
];

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Metadata.image-to-image');

  return {
    title: t('title'),
    description: t('description'),
  };
}

export default async function Page() {
  const t = await getTranslations('image-to-image');

  return (
    <div className='flex-1'>
      <div className='container-centered container-gap'>
        <div className='flex w-full flex-col gap-5'>
          <ImageForm
            imageFormType='image-to-image'
            formTitle={t('form.title')}
            submitBtnId='image-to-image-submit'
            defaultValuePriority={DEFAULT_PRIORITY}
            defaultValues={DEFAULT_VALUES}
          />
        </div>
        <Heading title={t('heading.title')} description={t('heading.description')} />
      </div>
      <ImageShowcaseSection
        title={t('examples.title')}
        description={t('examples.description')}
        dataList={EXAMPLE_IMAGE_LIST.map((imgList, idx) => ({
          title: t(`examples.${idx + 1}.title`),
          imgList: imgList.map((imgSrc, imgIdx) => ({
            id: imgIdx.toString(),
            imgSrc,
            imgAlt: t(`examples.${idx + 1}.${imgIdx + 1}.title`),
            isPrompt: imgIdx === 1,
          })),
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
        faqList={numberList(5).map((num) => ({
          id: num,
          question: t(`faq.${num}.question`),
          answer: t(`faq.${num}.answer`),
        }))}
        className='py-[60px] lg:py-[120px]'
      />
    </div>
  );
}
