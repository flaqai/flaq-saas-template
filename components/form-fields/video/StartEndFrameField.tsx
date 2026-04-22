'use client';

import { forwardRef } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import ImageUploadField from '@/components/form-fields/upload/ImageUploadField';
import type { ImageUploadFieldRef } from '@/components/form-fields/upload/ImageUploadField';
import type { VideoModel } from '@/lib/constants/video/';

interface StartEndFrameFieldProps {
  currentModel: VideoModel | undefined;
  showStartFrame?: boolean;
  showEndFrame?: boolean;
  onEndFrameToggle: (enabled: boolean) => boolean;
  uploadImageTitle?: string;
  supportsImageInput?: boolean;
  supportsEndFrameFromConfig?: boolean;
}

const StartEndFrameField = forwardRef<ImageUploadFieldRef, StartEndFrameFieldProps>(
  ({ currentModel, showStartFrame = false, showEndFrame = false, onEndFrameToggle, uploadImageTitle, supportsImageInput, supportsEndFrameFromConfig }, ref) => {
    const { control } = useFormContext();
    const t = useTranslations('components.video-form');

    // 优先使用从 uiConfig 传入的配置（版本级并集），否则回退到 currentModel（单个模型）
    const supportsStartFrame = supportsImageInput ?? currentModel?.options?.startFrame?.isSupported;
    const supportsEndFrame = supportsEndFrameFromConfig ?? currentModel?.options?.endFrame?.isSupported;

    // 决定是否显示起始帧和结束帧
    // 如果模型支持 startFrame，就显示（不管是文生还是图生）
    // 如果模型支持 endFrame，就显示
    const shouldShowStartFrame = showStartFrame && supportsStartFrame;
    const shouldShowEndFrame = showEndFrame && supportsEndFrame;

    // 如果两者都不显示，不渲染该组件
    if (!shouldShowStartFrame && !shouldShowEndFrame) {
      return null;
    }

    return (
      <FormField
        control={control}
        name='enableEndFrame'
        render={({ field }) => (
          <FormItem className='flex w-full flex-col gap-2.5 space-y-0'>
            {/* 标题区域 */}
            <div className='flex items-center justify-between'>
              <FormLabel className='cursor-pointer text-sm font-normal'>
                {/* 如果有结束帧开关，显示 "Start Frame / End Frame" */}
                {shouldShowEndFrame ? (
                  <>
                    {shouldShowStartFrame && (
                      <>
                        <span className='text-white/70'>{t('startFrame')}</span>
                        <span className='mx-2 text-white/20'>/</span>
                      </>
                    )}
                    <span className='text-white/70'>{t('endFrame')}</span>
                  </>
                ) : (
                  /* 如果只有起始帧，显示自定义标题或默认 "Upload Image" */
                  <span className='text-white/70'>{uploadImageTitle || t('image')}</span>
                )}
              </FormLabel>
              {/* 只有在显示结束帧时才显示开关 */}
              {shouldShowEndFrame && (
                <FormControl>
                  <Switch
                    className={cn(
                      'h-[16px] w-[28px] rounded border border-[#2a2b2f] !bg-transparent focus:ring-0 data-[state=checked]:border-color-main',
                    )}
                    thumbClassName={cn(
                      'h-3 w-3 rounded-[2px] bg-white/20 data-[state=unchecked]:translate-x-[1px] data-[state=checked]:translate-x-[12px] data-[state=checked]:bg-gradient-main',
                    )}
                    checked={!!field.value}
                    onCheckedChange={(checked) => {
                      const finalValue = onEndFrameToggle(checked);
                      field.onChange(finalValue);
                    }}
                  />
                </FormControl>
              )}
            </div>

            {/* 起始/结束帧布局 */}
            <div className='flex w-full flex-col gap-2.5 lg:flex-row'>
              {/* 起始帧 */}
              {shouldShowStartFrame && (
                <div className='flex-1'>
                  <ImageUploadField name='startFrame' ref={ref} label={t('startFrame')} />
                </div>
              )}
              {/* 结束帧（仅在开关打开时显示） */}
              {shouldShowEndFrame && field.value && (
                <div className='flex-1'>
                  <ImageUploadField name='endFrame' label={t('endFrame')} />
                </div>
              )}
            </div>
          </FormItem>
        )}
      />
    );
  },
);

StartEndFrameField.displayName = 'StartEndFrameField';

export default StartEndFrameField;
export type { ImageUploadFieldRef as StartEndFrameFieldRef };
