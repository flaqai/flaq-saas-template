'use client';

import { useFormContext } from 'react-hook-form';
import Image from 'next/image';
import { cn } from '@/lib/utils';

import type { ImageModelVersionConfig } from '@/lib/constants/image/types';
import { getModelIcon } from '@/lib/utils/modelIcons';
import { FormField, FormItem, FormControl } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import SubHeading from '@/components/form/SubHeading';
import { useTranslations } from 'next-intl';

export interface ModelVersionFieldProps {
  title?: string;
  name: string;
  versions: ImageModelVersionConfig[];
  onChange?: (value: string) => void;
}

export default function ModelVersionField({ title, name, versions, onChange }: ModelVersionFieldProps) {
  const form = useFormContext();
  const tCommon = useTranslations('Common');

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <SubHeading>{title || tCommon('selectModel')}</SubHeading>
          <FormControl>
            <Select
              value={field.value}
              onValueChange={(value) => {
                field.onChange(value);
                onChange?.(value);
              }}
            >
              <SelectTrigger className='h-11 w-full rounded-xl border border-[#303030] bg-[#1f1f1f] text-sm font-medium text-white'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className='border border-[#303030] bg-[#1f1f1f] rounded-xl'>
                {versions.map((version) => {
                  const iconSrc = getModelIcon(version.modelVersion);
                  const isDisabled = version.isComingSoon;
                  return (
                    <SelectItem
                      key={version.modelVersion}
                      value={version.modelVersion}
                      disabled={isDisabled}
                      className={cn(
                        'p-2 w-full cursor-pointer rounded text-white hover:bg-white/10 focus:bg-white/10 [&>span:first-child]:hidden [&>span:last-child]:w-full',
                        isDisabled && 'opacity-50 cursor-not-allowed hover:bg-transparent',
                      )}
                    >
                      <div className='flex items-center justify-between gap-2 w-full'>
                        <div className='flex items-center gap-2'>
                          {iconSrc && (
                            <Image
                              src={iconSrc}
                              alt={version.name}
                              width={16}
                              height={16}
                              className='shrink-0'
                            />
                          )}
                          <span>{version.name}</span>
                        </div>
                        {version.isComingSoon && (
                          <span className='text-xs text-color-main bg-[#f3eeff] px-2 py-0.5 rounded'>
                            Coming Soon
                          </span>
                        )}
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </FormControl>
        </FormItem>
      )}
    />
  );
}
