'use client';

import { useTranslations } from 'next-intl';
import Spinning from '@/components/Spinning';
import Credits from '@/components/svg/Credits';

interface SubmitButtonProps {
  isSubmitting?: boolean;
  creditCost?: number;
  submitButtonText?: string;
  translationNamespace?: 'components.video-form' | 'components.image-form';
  disabled?: boolean;
}

export default function SubmitButton({
  isSubmitting = false,
  creditCost = 0,
  submitButtonText,
  translationNamespace = 'components.video-form',
  disabled = false,
}: SubmitButtonProps) {
  const t = useTranslations(translationNamespace);

  return (
    <button
      type='submit'
      disabled={isSubmitting || disabled}
      className='flex h-9 flex-1 items-center justify-center gap-1.5 rounded-lg bg-color-main text-base font-semibold uppercase text-white disabled:cursor-not-allowed disabled:opacity-70'
    >
      {isSubmitting ? (
        <Spinning className='size-4' />
      ) : (
        <>
          {submitButtonText || t('generate')}
          {creditCost > 0 && (
            <>
              <Credits />
              {creditCost}
            </>
          )}
        </>
      )}
    </button>
  );
}
