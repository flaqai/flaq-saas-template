'use client';

import { useRef } from 'react';
import { useTranslations } from 'next-intl';
import { useFormContext } from 'react-hook-form';

import { GEMINI_PROVIDER, SEEDREAM_PROVIDER } from '@/lib/constants/image';
import type { ImageModelVersionConfig } from '@/lib/constants/image';
import { useModelConfig } from '@/components/image-ui-form/hooks';
import ImageForm from '@/components/image-ui-form/image-form';
import TryOnUploadSection, {
  TryOnUploadSectionRef,
} from '@/components/generation-modal/TryOnUploadSection';
import HintsPresets from '@/components/generation-modal/HintsPresets';
import type { HintPreset } from '@/components/generation-modal/HintsPresets';

const TRY_ON_PROMPT =
  "Dress the person from the first image in the clothing from the second image. Exactly maintain the clothing's original proportions, length, and design. Preserve the character's identical pose and body shape. The outfit must flatter the figure — subtly slimming and contouring the body for a more elegant silhouette — while staying slim, lightweight, and non-bulky. No excessive volume, no puffiness, realistic fabric behavior and natural folds, photorealistic integration.";

const ALLOWED_VERSIONS = new Set([
  'gemini-3-pro-image-preview',   // Nano Banana Pro
  'gemini-3-1-flash-image-preview', // Nano Banana 2
  'seedream-v5-0',                 // Seedream 5.0
  'seedream-v4-5',                 // Seedream 4.5
]);

const TRYON_VERSION_LIST: ImageModelVersionConfig[] = [
  ...GEMINI_PROVIDER.versions,
  ...SEEDREAM_PROVIDER.versions,
].filter((v) => ALLOWED_VERSIONS.has(v.modelVersion));

interface FormProps {
  hintsPresets?: HintPreset[];
}

function TryOnModalContent({
  hintsPresets,
}: {
  hintsPresets?: HintPreset[];
}) {
  const t = useTranslations('virtual-try-on.form');
  const tryOnRef = useRef<TryOnUploadSectionRef>(null);
  const methods = useFormContext();

  const selectedModelVersion = methods.watch('modelVersion');
  const { uiConfig } = useModelConfig({
    selectedModelVersion,
    customVersionList: TRYON_VERSION_LIST,
  });
  const maxObjectImages = uiConfig.maxImages || 4;

  const handlePresetClick = (preset: HintPreset) => {
    tryOnRef.current?.setSubjectImage(preset.subject);
    const objectUrls = Array.isArray(preset.object) ? preset.object : [preset.object];
    tryOnRef.current?.setObjectImages(objectUrls);
    methods.setValue('prompt', TRY_ON_PROMPT);
  };

  return (
    <TryOnUploadSection
      ref={tryOnRef}
      title={t('upload-images-title')}
      subjectLabel={t('upload-subject-label')}
      objectLabel={t('upload-object-label')}
      maxObjectImages={maxObjectImages}
      hintsSection={
        hintsPresets ? (
          <HintsPresets
            title={t('hints-title')}
            subjectLabel={t('subject-label')}
            objectLabel={t('object-label')}
            aiGenerationLabel={t('ai-generation-label')}
            presets={hintsPresets}
            onPresetClick={handlePresetClick}
          />
        ) : undefined
      }
    />
  );
}

export default function Form({ hintsPresets }: FormProps) {
  const t = useTranslations('virtual-try-on.form');

  return (
    <ImageForm
      imageFormType='virtual-try-on'
      formTitle={t('title')}
      submitBtnId='virtual-try-on-submit-btn'
      requireImageUpload
      imageUploadMode='none'
      customVersionList={TRYON_VERSION_LIST}
      defaultValues={{
        prompt: '',
        images: [],
        modelVersion: 'gemini-3-pro-image-preview',
        aspectRatio: '-',
        resolution: '2k',
      }}
      slotNodeAfterModel={<TryOnModalContent hintsPresets={hintsPresets} />}
    />
  );
}
