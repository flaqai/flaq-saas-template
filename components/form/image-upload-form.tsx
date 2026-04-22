'use client';

/* eslint-disable no-spaced-func */
/* eslint-disable @typescript-eslint/indent */
import { ChangeEventHandler, useImperativeHandle, useRef, useState } from 'react';
import { Upload, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useFormContext } from 'react-hook-form';
import { toast } from 'sonner';

import { cn } from '@/lib/utils';
import { getFileByUrl } from '@/lib/utils/fileUtils';
import { validateImagePx } from '@/lib/utils/imageUtils';
import { FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';

import Box from './Box';

const acceptedImageTypes = ['image/jpg', 'image/jpeg', 'image/png', 'image/webp'];

export interface ImageUploadFormRef {
  updateFile: (file: File | Blob | null | string) => Promise<void>;
  deleteFile: () => void;
}

export default function ImageUploadForm({
  name,
  minWidthPx = 300,
  minHeightPx = 300,
  className,
  allowUpload = true,
  allowUploadCb,
  showOverlay = false,
  ref,
}: {
  name: string;
  minWidthPx?: number;
  minHeightPx?: number;
  className?: string;
  allowUpload?: boolean;
  allowUploadCb?: () => void;
  showOverlay?: boolean;
  ref?: React.Ref<ImageUploadFormRef>;
}) {
  const t = useTranslations('components.image-upload-form');
  const methods = useFormContext();

  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const clearInputValue = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const updateFile = async (file: File | Blob | null | string) => {
    if (typeof file === 'string') {
      setFileUrl(file);
      const imageFile = await getFileByUrl(file);
      methods.setValue(name, imageFile);
      return;
    }

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const url = reader.result as string;
        setFileUrl(url);
      };
      reader.readAsDataURL(file);
      methods.setValue(name, file);
    } else {
      methods.setValue(name, null);
      setFileUrl(null);
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
      const isValid = await validateImagePx({ imageFile: file, minWidthPx, minHeightPx });
      if (!isValid) {
        toast.error(`${t('min width')} ${minWidthPx} px ${t('or')} ${t('min height')} ${minHeightPx} px`);
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
    <Box
      className={cn('group relative flex h-[87px] justify-start gap-3 rounded p-1 hover:border-color-main', className)}
    >
      {showOverlay && <div className='rounded-inherit absolute inset-0 z-10 size-full bg-black/20 backdrop-blur-sm' />}
      <FormField
        control={methods.control}
        name={name}
        render={() => (
          <FormItem className='relative size-full space-y-0 bg-white/5'>
            <div className='flex size-full items-center gap-1'>
              <FormLabel className='flex w-full cursor-pointer items-center gap-3' onClick={onClickUpload}>
                <div className='flex size-20 shrink-0 items-center justify-center rounded-sm bg-color-bg'>
                  <Upload className='size-5 group-hover:text-color-main' />
                </div>
                <div className='flex-1 whitespace-pre-line text-xs opacity-70'>{t('description')}</div>
              </FormLabel>
              {fileUrl && (
                <div className='absolute flex aspect-square h-full items-center justify-center rounded bg-white/5'>
                  <button
                    type='button'
                    onClick={deleteFile}
                    className='absolute -right-1 -top-1 z-20 flex size-5 items-center justify-center rounded-full bg-black/40'
                  >
                    <X className='size-4 text-white/70' />
                  </button>
                  <img src={fileUrl} alt={name} className='max-h-full max-w-full bg-contain' />
                </div>
              )}
            </div>
            <FormControl>
              <input
                type='file'
                ref={fileInputRef}
                accept={acceptedImageTypes.join(',')}
                className='hidden'
                required={false}
                onChange={inputOnChange}
              />
            </FormControl>
          </FormItem>
        )}
      />
    </Box>
  );
}
