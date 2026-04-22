'use client';

import { useFormContext } from 'react-hook-form';

import { cn } from '@/lib/utils';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

import Box from './Box';

interface RadioOption {
  value: string;
  name: string;
  icon?: React.ReactNode;
}

export default function FormRadioGroup({
  name,
  options,
  onChange,
  disabled,
  itemClassName,
}: {
  name: string;
  options: RadioOption[];
  onChange?: (val: string) => void;
  disabled?: boolean;
  itemClassName?: string;
}) {
  const { control } = useFormContext<{ [key: string]: string }>();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem key={field.name} className='flex w-full gap-3 space-y-0'>
          <FormLabel htmlFor={field.name} className='sr-only'>
            {name}
          </FormLabel>
          <FormControl className='grid w-full grid-cols-2'>
            <RadioGroup onValueChange={onChange || field.onChange} value={field.value} disabled={disabled}>
              {options.map((item) => (
                <FormItem key={item.value} className='space-y-0'>
                  <FormControl>
                    <RadioGroupItem className='hidden' value={item.value} />
                  </FormControl>
                  <FormLabel>
                    <Box
                      className={cn(
                        'flex cursor-pointer flex-row gap-1 hover:bg-white/20',
                        item.value === field.value && 'bg-white/20',
                        disabled && 'cursor-not-allowed opacity-40',
                        itemClassName,
                      )}
                    >
                      {item?.icon}
                      <span className='truncate'>{item.name}</span>
                    </Box>
                  </FormLabel>
                </FormItem>
              ))}
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
