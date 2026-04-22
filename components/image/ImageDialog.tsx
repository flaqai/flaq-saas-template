'use client';

import { CircleX } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Dialog, DialogContent } from '@/components/ui/dialog';

import BaseImage from './BaseImage';

type ImageDialogProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  src: string;
  title: string;
  onClick?: () => void;
  className?: string;
};

export default function ImageDialog({ open, setOpen, src, title, onClick, className }: ImageDialogProps) {
  return (
    <Dialog open={open}>
      <DialogContent className='border-none bg-transparent' showCloseButton={false} hiddenTitle={title}>
        <div className='flex-center relative size-[w-screen] lg:size-[650px] lg:-translate-x-[20%]'>
          <button
            type='button'
            onClick={() => setOpen(false)}
            className='absolute right-0 top-0 -translate-y-10 hover:text-white lg:translate-x-10 lg:translate-y-0'
          >
            <CircleX />
            <span className='sr-only'>close</span>
          </button>
          <BaseImage
            src={src}
            title={title}
            alt={title}
            onClick={onClick}
            width={650}
            height={650}
            className={cn('size-full rounded-2xl bg-[#212D2F]', !!onClick && 'hover:cursor-pointer', className)}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
