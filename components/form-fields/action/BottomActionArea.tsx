'use client';

import { useFormContext } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { FormControl, FormField, FormItem } from '@/components/ui/form';
import FormSelect from '@/components/form/FormSelect';
import { cn } from '@/lib/utils';
import Spinning from '@/components/Spinning';
import { Clock, Square, MonitorPlay } from 'lucide-react';

interface BottomActionAreaProps {
  durationOptions?: { name: string; value: string }[];
  ratioOptions?: { name: string; value: string }[];
  resolutionOptions?: { name: string; value: string }[];
  showDuration?: boolean;
  showRatio?: boolean;
  showResolution?: boolean;
  isSubmitting?: boolean;
  submitButtonText?: string;
  ratioFieldName?: string;
  resolutionFieldName?: string;
}

export default function BottomActionArea({
  durationOptions,
  ratioOptions,
  resolutionOptions,
  showDuration = false,
  showRatio = false,
  showResolution = false,
  isSubmitting = false,
  submitButtonText,
  ratioFieldName = 'ratio',
  resolutionFieldName = 'resolution',
}: BottomActionAreaProps) {
  const t = useTranslations('components.video-form');
  const form = useFormContext();

  // 为选项添加图标
  const durationOptionsWithIcon = durationOptions?.map((opt) => ({
    ...opt,
    leftIcon: <Clock className='size-4 text-[#777777]' />,
  }));

  const ratioOptionsWithIcon = ratioOptions?.map((opt) => ({
    ...opt,
    leftIcon: <Square className='size-4 text-[#777777]' />,
  }));

  const resolutionOptionsWithIcon = resolutionOptions?.map((opt) => ({
    ...opt,
    leftIcon: <MonitorPlay className='size-4 text-[#777777]' />,
  }));

  return (
    <div className='mt-auto flex flex-col gap-1 bg-[#1c1d20]'>
      {/* 上层：表单选项集成区 */}
      <div className='flex flex-wrap items-center gap-1'>
        {/* Duration 时长 */}
        <FormField
          control={form.control}
          name='duration'
          render={({ field }) => (
            <FormItem className={cn(
              'flex-1 space-y-0',
              // 使用 CSS 隐藏而不是条件渲染，避免字段卸载导致值丢失
              (!showDuration || !durationOptionsWithIcon || durationOptionsWithIcon.length === 0) && 'hidden'
            )}>
              <FormControl>
                <FormSelect
                  options={durationOptionsWithIcon || []}
                  name='duration'
                  side='top'
                />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Ratio 比例 */}
        <FormField
          control={form.control}
          name={ratioFieldName}
          render={({ field }) => (
            <FormItem className={cn(
              'flex-1 space-y-0',
              // 使用 CSS 隐藏而不是条件渲染，避免字段卸载导致值丢失
              (!showRatio || !ratioOptionsWithIcon || ratioOptionsWithIcon.length === 0) && 'hidden'
            )}>
              <FormControl>
                <FormSelect
                  options={ratioOptionsWithIcon || []}
                  name={ratioFieldName}
                  side='top'
                />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Resolution 分辨率 */}
        <FormField
          control={form.control}
          name={resolutionFieldName}
          render={({ field }) => (
            <FormItem className={cn(
              'flex-1 space-y-0',
              // 使用 CSS 隐藏而不是条件渲染，避免字段卸载导致值丢失
              (!showResolution || !resolutionOptionsWithIcon || resolutionOptionsWithIcon.length === 0) && 'hidden'
            )}>
              <FormControl>
                <FormSelect
                  options={resolutionOptionsWithIcon || []}
                  name={resolutionFieldName}
                  side='top'
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>

      {/* 下层：生成按钮 */}
      <div className='flex items-center gap-1'>
        {/* 生成按钮 */}
        <button
          type='submit'
          disabled={isSubmitting}
          className='flex h-9 flex-1 items-center justify-center gap-1.5 rounded-lg bg-color-main text-base font-semibold uppercase text-white disabled:cursor-not-allowed hover:cursor-pointer hover:opacity-80'
        >
          {isSubmitting ? (
            <Spinning className='size-4' />
          ) : (
            <>{submitButtonText || t('generate')}</>
          )}
        </button>
      </div>
    </div>
  );
}
