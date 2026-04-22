/**
 * 表单同步逻辑 Hook
 *
 * 封装表单字段自动同步的所有 useEffect：
 * 1. 监听模型变化，自动同步 ratio（画面比例）
 * 2. 监听模型变化，自动同步 duration 和 resolution
 * 3. 监听模型变化，自动同步 enableEndFrame
 *
 * 这些 useEffect 确保当用户切换模型或上传/删除图片时，表单字段自动适配
 *
 * @example
 * ```tsx
 * useFormSync({
 *   form,
 *   currentModel,
 *   currentVersionConfig,
 *   durationOptions,
 *   resolutionOptions,
 *   ratioOptions,
 *   modelVersion,
 *   hasImages,
 *   defaultValues,
 *   defaultValuePriority,
 * });
 * ```
 */

import { useEffect, useRef } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { type VideoModel, type ModelVersionConfig } from '@/lib/constants/video/';
import type { VideoFormData, FormOption } from '../types';

/**
 * useFormSync 的参数
 */
interface UseFormSyncOptions {
  form: UseFormReturn<VideoFormData>;
  currentModel: VideoModel | null | undefined;
  currentVersionConfig: ModelVersionConfig | undefined;
  durationOptions: FormOption[];
  ratioOptions: FormOption[];
  resolutionOptions: FormOption[];
  modelVersion: string;
  hasImages: boolean;
  defaultValues?: Partial<VideoFormData>;
  defaultValuePriority?: {
    ratio?: string[];
    duration?: string[];
    resolution?: string[];
  };
}

function isSupportedValue(
  value: string | undefined,
  options: Array<{ value: string }>,
): value is string {
  if (!value) return false;
  return options.some((opt) => opt.value === value);
}

function pickBestValue(params: {
  currentValue?: string;
  options: Array<{ value: string }>;
  priorities?: Array<string | undefined>;
}): string {
  const { currentValue, options, priorities } = params;

  if (!options || options.length === 0) return '';

  if (isSupportedValue(currentValue, options)) {
    return currentValue;
  }

  if (priorities && priorities.length > 0) {
    for (const p of priorities) {
      if (isSupportedValue(p, options)) {
        return p;
      }
    }
  }

  return options[0]?.value || '';
}

/**
 * 表单同步逻辑 Hook
 *
 * 将 useEffect 整合到一个 hook 中，使主组件更简洁
 */
export default function useFormSync(options: UseFormSyncOptions) {
  const {
    form,
    currentModel,
    currentVersionConfig,
    durationOptions,
    ratioOptions,
    resolutionOptions,
    modelVersion,
    hasImages,
    defaultValues,
    defaultValuePriority,
  } = options;

  const prevModelVersionRef = useRef<string | null>(null);

  // 检测模型是否切换（在所有 useEffect 之前计算）
  const isModelSwitch =
    prevModelVersionRef.current !== null && prevModelVersionRef.current !== modelVersion;

  // useEffect 1: ratio
  useEffect(() => {
    if (!currentModel) return;

    if (!ratioOptions || ratioOptions.length === 0) {
      form.setValue('ratio', '');
      return;
    }

    const currentRatio = isModelSwitch ? undefined : form.getValues('ratio');

    const nextRatio = pickBestValue({
      currentValue: currentRatio,
      options: ratioOptions,
      priorities: [
        defaultValues?.ratio,
        ...(defaultValuePriority?.ratio?.length ? defaultValuePriority.ratio : ['16:9', '9:16', '1:1']),
      ],
    });

    if (nextRatio && nextRatio !== form.getValues('ratio')) {
      setTimeout(() => form.setValue('ratio', nextRatio), 0);
    }
  }, [modelVersion, currentModel, ratioOptions, defaultValues?.ratio, defaultValuePriority?.ratio, isModelSwitch]);

  // useEffect 2: duration / resolution
  useEffect(() => {
    if (!currentVersionConfig) return;

    // duration
    if (!durationOptions || durationOptions.length === 0) {
      form.setValue('duration', '');
    } else {
      const currentDuration = isModelSwitch ? undefined : form.getValues('duration');
      const modelDuration = currentModel?.options?.duration ? `${currentModel.options.duration}s` : undefined;

      const nextDuration = pickBestValue({
        currentValue: currentDuration,
        options: durationOptions,
        priorities: [
          defaultValues?.duration,
          ...(defaultValuePriority?.duration?.length ? defaultValuePriority.duration : ['5s', '6s', '10s']),
          modelDuration,
        ],
      });

      if (nextDuration && nextDuration !== form.getValues('duration')) {
        setTimeout(() => form.setValue('duration', nextDuration), 0);
      }
    }

    // resolution
    if (!resolutionOptions || resolutionOptions.length === 0) {
      form.setValue('resolution', '');
    } else {
      const currentResolution = isModelSwitch ? undefined : form.getValues('resolution');
      const modelResolution = currentModel?.options?.resolution;

      const nextResolution = pickBestValue({
        currentValue: currentResolution,
        options: resolutionOptions,
        priorities: [
          defaultValues?.resolution,
          ...(defaultValuePriority?.resolution?.length ? defaultValuePriority.resolution : ['720p', '1080p']),
          modelResolution,
        ],
      });

      if (nextResolution && nextResolution !== form.getValues('resolution')) {
        setTimeout(() => form.setValue('resolution', nextResolution), 0);
      }
    }
  }, [
    modelVersion,
    currentVersionConfig,
    durationOptions,
    resolutionOptions,
    currentModel,
    hasImages,
    defaultValues?.duration,
    defaultValues?.resolution,
    defaultValuePriority?.duration,
    defaultValuePriority?.resolution,
    isModelSwitch,
  ]);

  // useEffect 3: enableEndFrame (only on model switch)
  useEffect(() => {
    if (!isModelSwitch) return;

    const supportsEndFrame = !!currentModel?.options?.endFrame?.isSupported;

    if (!supportsEndFrame && form.getValues('enableEndFrame')) {
      form.setValue('enableEndFrame', false);
    }
  }, [modelVersion, currentModel, form, isModelSwitch]);

  // 统一更新 ref（放在所有 effect 执行完后）
  useEffect(() => {
    prevModelVersionRef.current = modelVersion;
  }, [modelVersion]);
}
