'use client';

import { useFormContext } from 'react-hook-form';

import { cn } from '@/lib/utils';
import { FormField, FormItem } from '@/components/ui/form';

import GradientBorder from './gradient-border';

type Option = {
  id: string;
  title: string;
  value: string;
};

export default function SelectItemForm({
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
        <FormItem className='flex flex-wrap gap-2.5 space-y-0'>
          {options.map((el) => (
            <button type='button' key={el.id} onClick={() => handleChange(el.value)}>
              <GradientBorder
                active={field.value === el.value}
                outerClassName={cn(
                  'rounded',
                  field.value === el.value ? 'text-white' : 'outline-1 outline-solid outline-white/10 text-white/70',
                )}
              >
                <span className='text-nowrap'>{el.title}</span>
              </GradientBorder>
            </button>
          ))}
        </FormItem>
      )}
    />
  );
}
