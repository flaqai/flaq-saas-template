'use client';

/* eslint-disable react/function-component-definition */
/* eslint-disable @typescript-eslint/indent */
import { forwardRef, ForwardRefRenderFunction, useEffect, useImperativeHandle, useRef, useState } from 'react';
import useImageFormStore from '@/store/form/useImageFormStore';
import { Trash2, Upload } from 'lucide-react';
import { useFormContext } from 'react-hook-form';

import { cn } from '@/lib/utils';
import { getFileByUrl } from '@/lib/utils/fileUtils';
import { FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';

const acceptedImageTypes = ['image/jpg', 'image/jpeg', 'image/png', 'image/webp'];

// eslint-disable-next-line prefer-arrow-callback
const ImageUploadForm: ForwardRefRenderFunction<
  { removeImage: () => void; previewImage: (file: File | null | string) => Promise<void> },
  {
    name: string;
    afterSetImage?: () => void;
    label?: string;
    onImagePreview?: (imgSrc: string) => void;
    onDelete?: () => void;
    showRightSlot?: boolean;
    rightSlot?: React.ReactNode;
    className?: string;
  }
> = ({ name, afterSetImage, label, onImagePreview, onDelete, showRightSlot = true, rightSlot, className }, ref) => {
  const methods = useFormContext<{ [key: string]: File | null | string }>();

  const setUploadImageObj = useImageFormStore((state) => state.setUploadImageObj);
  const imageFormSrc = useImageFormStore((state) => state.imageFormSrc);
  const setImageFormSrc = useImageFormStore((state) => state.setImageFormSrc);

  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const previewImage = async (file: File | null | string) => {
    if (file) {
      if (typeof file === 'string') {
        setImageUrl(file);
        if (onImagePreview) {
          onImagePreview(file);
        }
        methods.setValue(name, file);
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
        if (onImagePreview) {
          onImagePreview(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
      if (afterSetImage) {
        afterSetImage();
      }
    } else {
      setImageUrl(null);
      methods.setValue(name, null);
    }
  };

  const removeImage = () => {
    setImageUrl(null);
    setUploadImageObj(null);
    methods.setValue(name, null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (onDelete) {
      onDelete();
    }
  };

  const onRemoveButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    removeImage();
  };

  const inputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      previewImage(file);
      methods.setValue(name, file);
    }
  };

  useEffect(() => {
    if (imageFormSrc) {
      (async () => {
        setImageUrl(imageFormSrc);
        methods.setValue(name, await getFileByUrl(imageFormSrc));
        if (afterSetImage) {
          afterSetImage();
        }

        if (imageFormSrc) {
          setImageFormSrc(null);
        }
      })();
    }

    return () => {};
  }, [name, methods, setImageUrl, afterSetImage, imageFormSrc, setImageFormSrc]);

  useImperativeHandle(
    ref,
    () => ({
      removeImage,
      previewImage,
    }),
    [],
  );

  return (
    <FormField
      control={methods.control}
      name={name}
      render={() => (
        <FormItem
          className={cn('flex h-[170px] min-h-[170px] w-full space-y-0 rounded-xl bg-color-bg-light p-1', className)}
        >
          <div className='flex w-full flex-1 rounded-lg bg-color-bg p-1'>
            {imageUrl && (
              <div className='flex flex-1 gap-2'>
                <div className='relative flex aspect-square h-full shrink-0 items-center justify-center overflow-hidden rounded-lg border border-color-text/5'>
                  <button
                    type='button'
                    onClick={onRemoveButtonClick}
                    className='absolute left-1 top-1 rounded-lg bg-color-text/20 p-1 backdrop-blur-md'
                  >
                    <Trash2 className='size-5 text-color-text-inverse/70' />
                  </button>
                  <img src={imageUrl} alt='Upload' className='max-h-full max-w-full' />
                </div>
                {/* eslint-disable-next-line react/jsx-no-useless-fragment */}
                {showRightSlot && <>{rightSlot}</>}
              </div>
            )}
            {!imageUrl && (
              <FormLabel className='flex flex-1 cursor-pointer rounded-lg'>
                <div className='flex flex-1 flex-col items-center justify-center gap-2'>
                  <div className='whitespace-pre-line text-center text-sm text-color-text/40'>{label}</div>
                  <Upload className='size-6 text-color-text/40' />
                </div>
              </FormLabel>
            )}
          </div>
          <FormControl>
            <input
              type='file'
              accept={acceptedImageTypes.join(',')}
              className='hidden'
              ref={fileInputRef}
              required={false}
              onChange={inputChange}
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
};

export default forwardRef(ImageUploadForm);
