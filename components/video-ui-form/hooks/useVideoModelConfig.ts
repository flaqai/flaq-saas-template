/**
 * 视频模型配置解析 Hook
 *
 * 对标 image-form 的 useModelConfig，职责：
 * 1. 根据 modelVersion 获取版本配置
 * 2. 根据 hasImages 动态计算 UI 配置（ratio/resolution/duration 选项）
 * 3. 提供模型选择函数（供提交时使用）
 *
 * @example
 * ```tsx
 * const { versionConfig, uiConfig, selectModel } = useVideoModelConfig({
 *   selectedModelVersion: 'wan-v2-5',
 *   hasImages: false,
 * });
 * ```
 */

import { useMemo } from 'react';
import {
  getVersionConfig,
  computeUIOptionsForVersion,
  selectVideoModelByGenerationType,
  versionSupportsImageToVideo,
  versionSupportsTextToVideo,
  type VideoModel,
  type ModelVersionConfig,
  type RatioConfig,
} from '@/lib/constants/video';

export interface VideoModelConfigParams {
  selectedModelVersion?: string;
  hasImages: boolean;
}

export interface VideoUIConfig {
  durationOptions: { name: string; value: string }[];
  resolutionOptions: { name: string; value: string }[];
  ratioOptions: RatioConfig[];
  supportsImageInput: boolean;
  supportsEndFrame: boolean;
  supportsAudio: boolean;
  supportsAudioUrl: boolean;
  supportsOptionalAudio: boolean;
  multiImageMaxImages: number;
}

export interface UseVideoModelConfigResult {
  versionConfig: ModelVersionConfig | undefined;
  uiConfig: VideoUIConfig;
  selectModel: (hasImagesAtSubmit: boolean, duration?: string, resolution?: string, enableAudio?: boolean) => VideoModel | null;
  supportedTypes: ('text-to-video' | 'image-to-video')[];
}

/**
 * 视频模型配置解析 Hook
 */
export function useVideoModelConfig(params: VideoModelConfigParams): UseVideoModelConfigResult {
  const { selectedModelVersion, hasImages } = params;

  // 1. 获取版本配置
  const versionConfig = useMemo(() => {
    if (!selectedModelVersion) return undefined;
    return getVersionConfig(selectedModelVersion);
  }, [selectedModelVersion]);

  // 2. 计算支持的生成类型
  const supportedTypes = useMemo(() => {
    if (!versionConfig) return [];
    const types: ('text-to-video' | 'image-to-video')[] = [];
    if (versionSupportsTextToVideo(versionConfig)) {
      types.push('text-to-video');
    }
    if (versionSupportsImageToVideo(versionConfig)) {
      types.push('image-to-video');
    }
    return types;
  }, [versionConfig]);

  // 3. UI 配置（根据 hasImages 动态计算）
  const uiConfig = useMemo(() => {
    return computeUIOptionsForVersion(versionConfig, hasImages);
  }, [versionConfig, hasImages]);

  // 4. 模型选择函数（供提交时使用）
  const selectModel = useMemo(() => {
    return (hasImagesAtSubmit: boolean, duration?: string, resolution?: string, enableAudio?: boolean): VideoModel | null => {
      return selectVideoModelByGenerationType(versionConfig, hasImagesAtSubmit, duration, resolution, enableAudio);
    };
  }, [versionConfig]);

  return {
    versionConfig,
    uiConfig,
    selectModel,
    supportedTypes,
  };
}

export default useVideoModelConfig;
