'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { Copy, Sparkles, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import Spinning from '@/components/Spinning';
import { useRouter } from '@/i18n/navigation';
import useDefaultModalStore from '@/store/useDefaultModalStore';

interface PromptDisplayProps {
  prompt: string;
  isLoading?: boolean;
  onPromptChange?: (prompt: string) => void;
  onCopyPrompt?: () => void;
  onGenerateImage?: () => void;
}

export default function PromptDisplay({
  prompt,
  isLoading,
  onPromptChange,
  onCopyPrompt,
  onGenerateImage,
}: PromptDisplayProps) {
  const t = useTranslations('image-to-prompt');
  const router = useRouter();
  const [isCopying, setIsCopying] = useState(false);
  const updateDefaultStore = useDefaultModalStore((state) => state.updateDefaultStore);

  const handleCopy = async () => {
    if (!prompt) {
      toast.error(t('form.no-prompt-to-copy'));
      return;
    }

    try {
      setIsCopying(true);
      await navigator.clipboard.writeText(prompt);
      toast.success(t('form.prompt-copied'));
      if (onCopyPrompt) {
        onCopyPrompt();
      }
    } catch (error) {
      toast.error(t('form.copy-failed'));
    } finally {
      setIsCopying(false);
    }
  };

  const handleGenerateImage = () => {
    if (!prompt) {
      toast.error(t('form.no-prompt-to-generate'));
      return;
    }

    if (onGenerateImage) {
      onGenerateImage();
    }

    updateDefaultStore({ prompt });
    router.push('/text-to-image');
  };

  const handleClear = () => {
    if (onPromptChange) {
      onPromptChange('');
    }
  };

  return (
    <div className='flex h-full flex-col rounded-3xl bg-[#1a1a1a] p-3'>
      <div className='mb-4 text-lg font-medium text-white'>{t('form.generated-prompt')}</div>

      <div className='relative flex-1'>
        <textarea
          name='generated-prompt'
          value={isLoading ? t('form.generating-prompt') : prompt}
          onChange={(e) => onPromptChange?.(e.target.value)}
          readOnly={isLoading}
          placeholder={t('form.prompt-placeholder')}
          className={cn(
            'h-full w-full min-h-[300px] resize-none rounded-xl border border-white/10 bg-[#232528] p-4',
            'text-[14px] leading-[22px] text-white',
            'focus:border-white/30 focus:ring-1 focus:ring-white/30 focus:outline-none',
            'placeholder:text-white/40',
            isLoading && 'animate-pulse',
          )}
        />
        {isLoading && (
          <div className='absolute inset-0 flex items-center justify-center'>
            <Spinning className='size-8' />
          </div>
        )}
      </div>

      <div className='mt-4 flex flex-wrap justify-end gap-2'>
        <button
          type='button'
          onClick={handleClear}
          disabled={!prompt || isLoading}
          className={cn(
            'flex items-center justify-center rounded-lg border border-white/10 bg-[#232528] p-2',
            'transition-all duration-300',
            'hover:bg-white/5 hover:cursor-pointer',
            'disabled:cursor-not-allowed disabled:opacity-50',
          )}
          title='Clear prompt'
        >
          <Trash2 className='size-4 text-white/60 hover:text-red-500' />
        </button>

        <button
          type='button'
          onClick={handleCopy}
          disabled={!prompt || isLoading || isCopying}
          className={cn(
            'flex items-center justify-center gap-1.5 rounded-lg border border-white/10 bg-[#232528] px-3 py-2',
            'text-xs font-medium whitespace-nowrap',
            'transition-all duration-300',
            'hover:bg-white/5 hover:cursor-pointer',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'lg:px-4 lg:text-sm',
          )}
        >
          {isCopying ? (
            <Spinning className='size-3.5' />
          ) : (
            <Copy className='size-3.5 text-white/60' />
          )}
          <span className='bg-gradient-main bg-clip-text text-transparent'>
            {t('form.copy-prompt')}
          </span>
        </button>

        <button
          type='button'
          onClick={handleGenerateImage}
          disabled={!prompt || isLoading}
          className={cn(
            'flex items-center justify-center gap-1.5 rounded-lg bg-color-main px-3 py-2',
            'text-xs font-semibold text-white whitespace-nowrap',
            'transition-all duration-300',
            'hover:bg-color-main/80 hover:cursor-pointer',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'lg:px-4 lg:text-sm',
          )}
        >
          <Sparkles className='size-3.5' />
          {t('form.generate-image')}
        </button>
      </div>
    </div>
  );
}
