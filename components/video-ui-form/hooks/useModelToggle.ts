/**
 * 模型切换逻辑 Hook
 *
 * 封装尾帧开关的模型切换逻辑：
 * 1. 检查当前模型是否支持目标功能
 * 2. 如果不支持，自动切换到支持的模型
 *
 * @example
 * ```tsx
 * const { handleEndFrameToggle } = useModelToggle({
 *   form,
 *   videoType,
 *   t,
 * });
 * ```
 */

import { useCallback } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { VideoModelService } from '../utils/modelService';
import type { VideoModel } from '@/lib/constants/video/';
import type { VideoFormData } from '../types';

/**
 * useModelToggle 的参数
 */
interface UseModelToggleOptions {
  form: UseFormReturn<VideoFormData>;
  t: (key: string) => string;
}

/**
 * 模型切换逻辑 Hook
 */
export default function useModelToggle(options: UseModelToggleOptions) {
  const { form, t } = options;

  /**
   * 能力判断工具
   */
  const modelSupportsAudio = useCallback(
    (model: VideoModel | undefined) => VideoModelService.modelSupportsAudio(model),
    [],
  );

  const modelSupportsEndFrame = useCallback(
    (model: VideoModel | undefined) => VideoModelService.modelSupportsEndFrame(model),
    [],
  );

  /**
   * 根据音频/尾帧需求查找合适的模型版本
   */
  const pickModelVersion = useCallback(
    (opts: { audio?: boolean; endFrame?: boolean }) => {
      // 根据 startFrame 是否有值判断 hasImages
      const startFrame = form.getValues('startFrame');
      const hasImages = !!(startFrame && (startFrame instanceof File || typeof startFrame === 'string'));

      return VideoModelService.pickModelVersion({
        ...opts,
        currentModelVersion: form.getValues('modelVersion'),
        hasImages,
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  /**
   * 开关尾帧
   * @returns 返回最终的开关状态（true 表示开启，false 表示关闭）
   */
  const handleEndFrameToggle = useCallback(
    (enabled: boolean): boolean => {
      const formData = form.getValues();
      const currentModelVersion = formData.modelVersion;

      // 如果要关闭尾帧，直接关闭即可
      if (!enabled) {
        return false;
      }

      // 检查当前版本是否支持尾帧（使用版本级配置，而不是具体模型）
      const versionConfig = VideoModelService.getVersionConfig(currentModelVersion);
      const versionSupportsEndFrame = !!versionConfig?.options.endFrame?.isSupported;

      if (versionSupportsEndFrame) {
        // 当前版本支持，直接开启
        return true;
      }

      // 当前版本不支持尾帧，尝试找到支持的版本
      const newModelVersion = pickModelVersion({ endFrame: true });

      if (newModelVersion) {
        // 找到了支持的版本，切换过去
        form.setValue('modelVersion', newModelVersion);
        return true;
      } else {
        // 找不到支持尾帧的版本，保持开关关闭
        return false;
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pickModelVersion],
  );

  /**
   * 开关音频：优先保证音频，必要时降级关闭尾帧
   * @deprecated 不再使用音频控制功能，保留此函数仅为兼容性
   */
  const handleAudioToggle = useCallback(
    (enabled: boolean) => {
      // 音频控制已废弃，不执行任何操作
      console.warn('handleAudioToggle is deprecated and should not be used');
    },
    [],
  );

  return {
    handleAudioToggle,
    handleEndFrameToggle,
    // 也导出能力判断工具，以便在其他地方使用
    modelSupportsAudio,
    modelSupportsEndFrame,
  };
}
