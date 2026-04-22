'use client';

/* eslint-disable no-spaced-func */
/* eslint-disable @typescript-eslint/indent */
import { ChangeEventHandler, useImperativeHandle, useRef, useState } from 'react';
import { Music, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useFormContext } from 'react-hook-form';
import { toast } from 'sonner';

import { FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';

import Box from './Box';

const acceptedAudioTypes = [
  'audio/mpeg', // MP3
  'audio/mp3', // MP3 (alternative)
  'audio/wav', // WAV
  'audio/wave', // WAV (alternative)
  'audio/x-wav', // WAV (alternative)
  'audio/mp4', // M4A
  'audio/m4a', // M4A
  'audio/aac', // AAC
  'audio/x-aac', // AAC (alternative)
  'audio/ogg', // OGG
  'audio/vorbis', // OGG Vorbis
];

export interface AudioUploadFormRef {
  updateFile: (file: File | Blob | null) => void;
  deleteFile: () => void;
}

export default function AudioUploadForm({
  name,
  className,
  allowUpload = true,
  allowUploadCb,
  ref,
}: {
  name: string;
  className?: string;
  allowUpload?: boolean;
  allowUploadCb?: () => void;
  ref?: React.Ref<AudioUploadFormRef>;
}) {
  const t = useTranslations('components.audio-upload-form');
  const methods = useFormContext();

  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const clearInputValue = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const updateFile = (file: File | Blob | null) => {
    if (file) {
      setFileName(file instanceof File ? file.name : 'audio file');
      methods.setValue(name, file);
    } else {
      methods.setValue(name, null);
      setFileName(null);
      clearInputValue();
    }
  };

  const localUpload = (file: File) => {
    updateFile(file);
  };

  const deleteFile = () => {
    updateFile(null);
    clearInputValue();
  };

  const inputOnChange: ChangeEventHandler<HTMLInputElement> = async (e) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      if (!acceptedAudioTypes.includes(file.type)) {
        toast.error(t('unsupported-format'));
        return;
      }

      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error(t('file-too-large'));
        return;
      }

      localUpload(file);
    }
  };

  const onClickUpload: React.MouseEventHandler<HTMLLabelElement> = (e) => {
    if (!allowUpload && allowUploadCb) {
      allowUploadCb();
      e.preventDefault();
    }
  };

  useImperativeHandle(ref, () => ({
    updateFile,
    deleteFile,
  }));

  return (
    <div className={className}>
      <Box className='group relative flex h-[87px] justify-start gap-3 rounded p-1 hover:border-color-main'>
        <FormField
          control={methods.control}
          name={name}
          render={() => (
            <FormItem className='relative size-full space-y-0 bg-white/5'>
              <div className='flex size-full items-center gap-1'>
                <FormLabel className='flex w-full cursor-pointer items-center gap-3' onClick={onClickUpload}>
                  <div className='flex size-20 shrink-0 items-center justify-center rounded-sm bg-color-bg'>
                    <Music className='size-5 group-hover:text-color-main' />
                  </div>
                  <div className='flex-1 whitespace-pre-line text-xs opacity-70'>
                    {t('upload-audio')}
                    <br />
                    <span className='text-[10px]'>{t('supported-formats')}</span>
                  </div>
                </FormLabel>
              </div>
              <FormControl>
                <input
                  type='file'
                  ref={fileInputRef}
                  accept={acceptedAudioTypes.join(',')}
                  className='hidden'
                  required={false}
                  onChange={inputOnChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </Box>
      {fileName && (
        <div className='mt-2 flex items-center justify-between rounded bg-black/5 p-2'>
          <div className='flex items-center gap-2'>
            <Music className='size-5 text-color-main' />
            <span className='text-xs font-medium text-black/80'>{fileName}</span>
          </div>
          <button
            type='button'
            onClick={deleteFile}
            className='flex size-6 shrink-0 items-center justify-center rounded-full bg-black/40 transition-colors hover:bg-black/60'
          >
            <X className='size-3 text-white' />
          </button>
        </div>
      )}
    </div>
  );
}
