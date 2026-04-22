'use client';

import { useTranslations } from 'next-intl';
import { useFormContext } from 'react-hook-form';
import { FormControl, FormField, FormItem } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info } from 'lucide-react';

interface AudioToggleFieldProps {
  show?: boolean;
}

/**
 * 音频开启开关组件
 * 用于给用户选择是否生成带有声音的视频
 */
export default function AudioToggleField({ show = false }: AudioToggleFieldProps) {
  const t = useTranslations('components.video-form');
  const { control } = useFormContext();

  if (!show) return null;

  return (
    <FormField
      control={control}
      name="enableAudio"
      render={({ field }) => (
        <FormItem className="flex w-full flex-col gap-2.5 space-y-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Label htmlFor="enableAudio" className="cursor-pointer text-sm font-normal text-white/70">
                {t('enable-audio')}
              </Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-3.5 w-3.5 cursor-help text-white/40" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-[200px] text-xs">
                      {t('enable-audio-tip')}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <FormControl>
              <Switch
                id="enableAudio"
                className="h-[16px] w-[28px] rounded border border-white !bg-transparent focus:ring-0 data-[state=checked]:border-color-main"
                thumbClassName="h-3 w-3 rounded-[2px] bg-white data-[state=unchecked]:translate-x-[1px] data-[state=checked]:translate-x-[12px] data-[state=checked]:bg-color-main"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
          </div>
        </FormItem>
      )}
    />
  );
}
