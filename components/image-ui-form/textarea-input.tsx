'use client';

import { CircleX } from 'lucide-react';
import { useFormContext } from 'react-hook-form';

import { cn } from '@/lib/utils';
import { FormField, FormItem } from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import CopyBtn from '@/components/CopyBtn';

const MAX_PROMPT_LENGTH = 2000;

export default function TextareaInput({
  name,
  placeholder,
  className,
  showBtns = true,
}: {
  name: string;
  placeholder?: string;
  className?: string;
  showBtns?: boolean;
}) {
  const methods = useFormContext<{ [key: string]: string }>();

  return (
    <FormField
      control={methods.control}
      name={name}
      render={({ field }) => (
        <FormItem className='space-y-0'>
          <div className='relative w-full contain-inline-size'>
            <Textarea
              onChange={field.onChange}
              value={field.value}
              placeholder={placeholder}
              maxLength={MAX_PROMPT_LENGTH}
              className={cn(
                'h-[160px] resize-none rounded-lg border border-[#303030] bg-[#080808] p-3 text-[#b8b8b8] placeholder:text-[#b8b8b8]',
                className,
              )}
            />
            <div className='absolute right-1 top-1 text-xs text-[#b8b8b8]'>
              {field.value?.length || 0}/{MAX_PROMPT_LENGTH}
            </div>
            {showBtns && (
              <div className='absolute right-1 bottom-1 flex h-8 items-center gap-2.5 rounded px-2 py-1.5'>
                <CopyBtn content={field.value} className='text-[#b8b8b8]' />
                <Separator orientation='vertical' className='h-full w-px bg-[#b8b8b8]' />
                {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                <button type='button' onClick={() => field.onChange('')}>
                  <CircleX className='size-5 text-[#b8b8b8]' />
                </button>
              </div>
            )}
          </div>
        </FormItem>
      )}
    />
  );
}
