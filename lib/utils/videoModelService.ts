import type { VideoModel, VideoGenerationType } from '@/lib/constants/video/types';
import {
  getFilteredProviders,
  getFilteredVisibleProviders,
  getVideoProviderByModelVersion,
  versionSupportsImageToVideo,
  versionSupportsTextToVideo,
  selectVideoModelByGenerationType,
} from '@/lib/constants/video/';

/**
 * 检查模型是否支持特定的生成类型
 */
export function supportsGenerationType(model: VideoModel, generationType: VideoGenerationType): boolean {
  return model.generationType === generationType;
}

/**
 * 根据模型配置和用户选择的参数，计算实际需要的 credit
 */
export function calculateVideoCredit(
  model: VideoModel,
  _params: {
    generationType?: VideoGenerationType;
    duration?: number;
    resolution?: string;
  }
): number {
  // Video 模型目前通常是固定 credit
  // 如果未来需要动态 credit，可以在这里扩展
  return model.credit;
}

/**
 * 获取模型的首帧配置
 */
export function getStartFrameConfig(model: VideoModel) {
  return model.options.startFrame;
}

/**
 * 获取模型的尾帧配置
 */
export function getEndFrameConfig(model: VideoModel) {
  return model.options.endFrame;
}

/**
 * 检查模型是否需要图片输入
 */
export function requiresImageInput(model: VideoModel): boolean {
  return model.options.startFrame?.required === true;
}

/**
 * 检查模型是否支持图片输入
 */
export function supportsImageInput(model: VideoModel): boolean {
  return model.options.startFrame?.isSupported === true || model.options.endFrame?.isSupported === true;
}

/**
 * 获取模型版本配置
 */
export function getVersionConfig(modelVersionStr?: string) {
  if (!modelVersionStr) return undefined;
  const providers = getFilteredProviders(true);

  return providers.flatMap((provider) => provider.versions).find(
    (v) => v.modelVersion === modelVersionStr,
  );
}

/**
 * 根据模型版本和参数获取匹配的模型
 */
export function getCurrentModel(
  modelVersionStr?: string,
  duration?: string,
  resolution?: string,
  hasImages?: boolean,
  enableAudio?: boolean,
): VideoModel | undefined {
  const filteredProviders = getFilteredProviders(true);

  if (!filteredProviders || filteredProviders.length === 0) {
    return undefined;
  }

  const foundVersion = filteredProviders.flatMap((provider) => provider.versions).find(
    (v) => v.modelVersion === modelVersionStr,
  );

  if (!foundVersion) {
    const fallbackVersion = filteredProviders[0]?.versions[0];
    return selectVideoModelByGenerationType(fallbackVersion, !!hasImages, duration, resolution, enableAudio) ?? undefined;
  }

  return selectVideoModelByGenerationType(foundVersion, !!hasImages, duration, resolution, enableAudio) ?? undefined;
}

/**
 * 获取默认模型版本
 */
export function getDefaultModel(): string {
  const providers = getFilteredProviders(true);

  if (providers && providers.length > 0 && providers[0].versions.length > 0) {
    return providers[0].versions[0].modelVersion;
  }
  return '';
}

/**
 * 判断模型是否支持音频
 */
export function modelSupportsAudio(model: VideoModel | undefined): boolean {
  return !!(model && model.options.audio);
}

/**
 * 判断模型是否支持尾帧
 */
export function modelSupportsEndFrame(model: VideoModel | undefined): boolean {
  return !!model?.options.endFrame?.isSupported;
}

/**
 * 根据音频/尾帧需求查找合适的模型版本
 */
export function pickModelVersion(options: {
  audio?: boolean;
  endFrame?: boolean;
  currentModelVersion: string;
  hasImages?: boolean;
}): string | undefined {
  const { audio, endFrame, currentModelVersion, hasImages } = options;

  const versions = getFilteredVisibleProviders(true).flatMap((provider) => provider.versions).filter(
    (version) => {
      if (hasImages) {
        return versionSupportsImageToVideo(version);
      }
      return versionSupportsTextToVideo(version);
    },
  );

  const versionMatchesRequirements = (version: (typeof versions)[0]) => {
    if (audio && !version.options.audio) return false;
    if (endFrame && !version.options.endFrame?.isSupported) return false;
    return true;
  };

  const currentProvider = getVideoProviderByModelVersion(currentModelVersion);

  if (currentProvider) {
    const sameBrandVersion = versions.find(
      (v) => v.provider === currentProvider && versionMatchesRequirements(v),
    );
    if (sameBrandVersion) {
      return sameBrandVersion.modelVersion;
    }
  }

  const foundVersion = versions.find(versionMatchesRequirements);

  return foundVersion?.modelVersion;
}
