'use client';

import type { ReactNode } from 'react';
import { useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import Image from 'next/image';
import { ImageIcon, Scaling } from 'lucide-react';
import { cn } from '@/lib/utils';

import type { ImageModelVersionConfig } from '@/lib/constants/image/types';
import { getModelIcon } from '@/lib/utils/modelIcons';
import { FormField, FormItem, FormControl } from '@/components/ui/form';
import SubHeading from '@/components/form/SubHeading';
import { useTranslations } from 'next-intl';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/video-ui-form/ModelSelectContainer';

export interface ModelVersionFieldProps {
  title?: string;
  name: string;
  versions: ImageModelVersionConfig[];
  onChange?: (value: string) => void;
  displayMode?: 'model' | 'label' | 'both';
}

export default function ModelVersionField({
  title,
  name,
  versions,
  onChange,
  displayMode = 'model',
}: ModelVersionFieldProps) {
  const form = useFormContext();
  const tCommon = useTranslations('Common');
  const selectedModelVersion = form.watch(name);

  const sortedVersions = useMemo(() => {
    if (!selectedModelVersion || !versions.length) return versions;

    const currentVersion = versions.find((version) => version.modelVersion === selectedModelVersion);
    if (!currentVersion) return versions;

    const sameProviderVersions = versions.filter(
      (version) =>
        version.provider === currentVersion.provider &&
        version.modelVersion !== selectedModelVersion,
    );
    const otherProviderVersions = versions.filter(
      (version) => version.provider !== currentVersion.provider,
    );

    return [currentVersion, ...sameProviderVersions, ...otherProviderVersions];
  }, [versions, selectedModelVersion]);

  const selectedVersion = sortedVersions.find((version) => version.modelVersion === selectedModelVersion);

  const getDisplayText = (version: ImageModelVersionConfig) => {
    if (displayMode === 'label') return version.name;
    if (displayMode === 'both') return `${version.modelVersion} / ${version.name}`;
    return version.modelVersion;
  };

  const formatResolutionRange = (version: ImageModelVersionConfig) => {
    const values = version.options.resolution?.map((item) => item.value.toUpperCase()) || [];
    if (!values.length) return null;

    const normalized = [...new Set(values)]
      .map((value) => ({
        raw: value,
        order: parseInt(value.replace(/\D/g, ''), 10),
      }))
      .filter((item) => !Number.isNaN(item.order))
      .sort((a, b) => a.order - b.order);

    if (!normalized.length) return values[0] || null;
    if (normalized.length === 1) return normalized[0].raw;

    return `${normalized[0].raw}-${normalized[normalized.length - 1].raw}`;
  };

  const getVersionTags = (version: ImageModelVersionConfig) => {
    const tags: Array<{ icon: ReactNode; label: string }> = [];
    const editModel = version.models.find((model) => model.options?.imageInput?.isSupported);

    if (editModel?.options.imageInput?.isSupported) {
      const maxImages = editModel.options.imageInput.max || 1;
      tags.push({
        icon: <ImageIcon className='h-3.5 w-3.5' />,
        label: maxImages > 1 ? `Multi images ${maxImages}` : 'Image 1',
      });
    }

    const resolutionRange = formatResolutionRange(version);
    if (resolutionRange) {
      tags.push({
        icon: <Scaling className='h-3.5 w-3.5' />,
        label: resolutionRange,
      });
    }

    return tags;
  };

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
                <div className='flex min-w-0 items-center gap-2'>
                  {selectedVersion && getModelIcon(selectedVersion.modelVersion) ? (
                    <Image
                      src={getModelIcon(selectedVersion.modelVersion)}
                      alt={selectedVersion.name}
                      width={16}
                      height={16}
                      className='shrink-0'
                    />
                  ) : (
                    <div className='h-4 w-4 shrink-0' />
                  )}
                  <SelectValue placeholder='Select model version'>
                    {selectedVersion ? getDisplayText(selectedVersion) : 'Select model version'}
                  </SelectValue>
                </div>
              </SelectTrigger>
              <SelectContent className='w-[var(--radix-select-trigger-width)] min-w-[var(--radix-select-trigger-width)] max-w-[var(--radix-select-trigger-width)] rounded-xl border border-[#303030] bg-[#1f1f1f]'>
                {sortedVersions.map((version) => {
                  const iconSrc = getModelIcon(version.modelVersion);
                  const isDisabled = version.isComingSoon;
                  const isSelected = field.value === version.modelVersion;
                  const tags = getVersionTags(version);
                  return (
                    <SelectItem
                      key={version.modelVersion}
                      value={version.modelVersion}
                      disabled={isDisabled}
                      className={cn(
                        'p-0 w-full cursor-pointer rounded-none text-white hover:bg-white/10 focus:bg-white/10 [&>span:first-child]:hidden [&>span:last-child]:w-full',
                        isDisabled && 'opacity-50 cursor-not-allowed hover:bg-transparent',
                      )}
                    >
                      <div
                        className={cn(
                          'flex w-full min-w-full max-w-full cursor-pointer flex-col gap-3 border-b border-white/10 p-2 box-border last:border-b-0',
                          isSelected && 'bg-white/5',
                        )}
                      >
                        <div className='flex items-start justify-between gap-3'>
                          <div className='flex min-w-0 flex-1 items-center gap-2'>
                            {iconSrc ? (
                              <Image
                                src={iconSrc}
                                alt={version.name}
                                width={20}
                                height={20}
                                className='shrink-0'
                              />
                            ) : (
                              <div className='h-5 w-5 shrink-0' />
                            )}
                            <span className='truncate text-base font-medium text-white'>
                              {getDisplayText(version)}
                            </span>
                          </div>
                          <div className='flex shrink-0 items-center gap-2'>
                            {version.isComingSoon && (
                              <span className='rounded bg-[#f3eeff] px-2 py-0.5 text-xs text-color-main'>
                                Coming Soon
                              </span>
                            )}
                            {isSelected ? (
                              <div className='flex h-5 w-5 items-center justify-center rounded-full border-2 border-[#427cf1] bg-[#427cf1]'>
                                <svg
                                  xmlns='http://www.w3.org/2000/svg'
                                  width='12'
                                  height='12'
                                  viewBox='0 0 24 24'
                                  fill='none'
                                  stroke='white'
                                  strokeWidth='3'
                                  strokeLinecap='round'
                                  strokeLinejoin='round'
                                  className='lucide lucide-check'
                                >
                                  <path d='M20 6 9 17l-5-5' />
                                </svg>
                              </div>
                            ) : (
                              <div className='flex h-5 w-5 items-center justify-center rounded-full border border-white/20' />
                            )}
                          </div>
                        </div>
                        <div className='flex flex-wrap gap-2'>
                          {tags.map((tag) => (
                            <div
                              key={tag.label}
                              className='flex items-center gap-1 rounded-md border border-white/10 px-2 py-1 text-xs text-white/70'
                            >
                              {tag.icon}
                              <span>{tag.label}</span>
                            </div>
                          ))}
                        </div>
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
