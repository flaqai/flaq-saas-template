'use client';

import { useFormContext } from 'react-hook-form';

import { cn } from '@/lib/utils';
import { FormField, FormItem } from '@/components/ui/form';

type Option = {
  id: string;
  imgSrc: string;
  label: string;
  value: string;
};

export default function SingleSelectForm({
  name,
  options,
  onChange,
}: {
  name: string;
  options: Option[];
  onChange?: (value: string) => void;
}) {
  const methods = useFormContext<{ [key: string]: string }>();

  const handleChange = (value: string) => {
    if (onChange) {
      onChange(value);
      return;
    }
    methods.setValue(name, value);
  };

  return (
    <FormField
      control={methods.control}
      name={name}
      render={({ field }) => (
        <FormItem className='grid grid-cols-2 gap-2.5 space-y-0'>
          {options.map((el) => (
            <button
              type='button'
              key={el.id}
              onClick={() => handleChange(el.value)}
              className={cn(
                'flex gap-1 rounded border border-transparent bg-white/5 p-1 text-left text-sm text-white/40 hover:opacity-70',
                field.value === el.value && 'border-main-yellow',
              )}
            >
              <img src={el.imgSrc} alt={el.label} className='size-10 rounded-sm bg-black' fetchPriority='low' />
              <span className='line-clamp-2'>{el.label}</span>
            </button>
          ))}
        </FormItem>
      )}
    />
  );
}
