/**
 * 视频模型服务
 *
 * 封装所有模型选择、查找、验证相关的业务逻辑
 * 从 video-form.tsx 中抽取，提高代码可维护性和可测试性
 */

import {
  getFilteredProviders,
  getFilteredVisibleProviders,
  getVideoProviderByModelVersion,
  versionSupportsImageToVideo,
  versionSupportsTextToVideo,
  selectVideoModelByGenerationType,
  type VideoModel,
} from '@/lib/constants/video/';
import useUserInfoStore from '@/store/useUserInfoStore';
import { getUserAllowedStatus } from '@/lib/access-control';

/**
 * 视频模型服务类
 *
 * 提供模型查找、筛选、验证等功能
 */
export class VideoModelService {
  /**
   * 获取模型版本配置
   *
   * @param modelVersionStr - 模型版本字符串 (如 'kling-v3-0-std-audio')
   * @returns 版本配置对象，如果未找到则返回 undefined
   */
  static getVersionConfig(modelVersionStr?: string) {
    if (!modelVersionStr) return undefined;

    const userInfo = useUserInfoStore.getState().userInfo;
    const isAllowed = getUserAllowedStatus(userInfo);
    const providers = getFilteredProviders(isAllowed);

    return providers.flatMap((provider) => provider.versions).find(
      (v) => v.modelVersion === modelVersionStr,
    );
  }

  /**
   * 根据模型版本和参数获取匹配的模型
   *
   * @param modelVersionStr - 模型版本字符串 (如 'wan-v2-5')
   * @param duration - 时长 (如 '5s', '10s')
   * @param resolution - 分辨率 (如 '480p', '720p')
   * @param hasImages - 是否有图片上传（用于判断生成类型）
   * @param enableAudio - 是否开启音频（用于选择 audio/non-audio 模型）
   * @returns 匹配的模型，如果未找到则返回 undefined
   */
  static getCurrentModel(
    modelVersionStr?: string,
    duration?: string,
    resolution?: string,
    hasImages?: boolean,
    enableAudio?: boolean,
  ): VideoModel | undefined {
    const userInfo = useUserInfoStore.getState().userInfo;
    const isAllowed = getUserAllowedStatus(userInfo);
    const filteredProviders = getFilteredProviders(isAllowed);

    if (!filteredProviders || filteredProviders.length === 0) {
      return undefined;
    }

    // 查找模型版本配置
    const foundVersion = filteredProviders.flatMap((provider) => provider.versions).find(
      (v) => v.modelVersion === modelVersionStr,
    );

    if (!foundVersion) {
      // 兜底：返回第一个可用版本的模型
      const fallbackVersion = filteredProviders[0]?.versions[0];
      return selectVideoModelByGenerationType(fallbackVersion, !!hasImages, duration, resolution, enableAudio) ?? undefined;
    }

    // 使用统一的 selectVideoModelByGenerationType 函数（支持模板配置）
    return selectVideoModelByGenerationType(foundVersion, !!hasImages, duration, resolution, enableAudio) ?? undefined;
  }

  /**
   * 获取默认模型版本
   *
   * @returns 默认模型的 modelVersion
   */
  static getDefaultModel(): string {
    const userInfo = useUserInfoStore.getState().userInfo;
    const isAllowed = getUserAllowedStatus(userInfo);
    const providers = getFilteredProviders(isAllowed);

    if (providers && providers.length > 0 && providers[0].versions.length > 0) {
      return providers[0].versions[0].modelVersion;
    }
    return '';
  }

  /**
   * 判断模型是否支持音频
   *
   * @param model - 视频模型
   * @returns true 表示支持音频
   */
  static modelSupportsAudio(model: VideoModel | undefined): boolean {
    return !!(model && model.options.audio);
  }

  /**
   * 判断模型是否支持尾帧
   *
   * @param model - 视频模型
   * @returns true 表示支持尾帧
   */
  static modelSupportsEndFrame(model: VideoModel | undefined): boolean {
    return !!model?.options.endFrame?.isSupported;
  }

  /**
   * 根据音频/尾帧需求查找合适的模型版本
   *
   * 优先查找与当前模型同品牌的模型，如果找不到则查找任意满足条件的模型
   *
   * @param options - 查找选项
   * @param options.audio - 是否需要音频支持
   * @param options.endFrame - 是否需要尾帧支持
   * @param options.currentModelVersion - 当前模型版本（用于品牌优先）
   * @param options.hasImages - 是否有图片上传（用于过滤支持的模型）
   * @returns 匹配的模型版本字符串，如果未找到返回 undefined
   */
  static pickModelVersion(options: {
    audio?: boolean;
    endFrame?: boolean;
    currentModelVersion: string;
    hasImages?: boolean;
  }): string | undefined {
    const { audio, endFrame, currentModelVersion, hasImages } = options;

    const userInfo = useUserInfoStore.getState().userInfo;
    const isAllowed = getUserAllowedStatus(userInfo);

    // 使用可见的 provider 列表，根据 hasImages 过滤版本
    const versions = getFilteredVisibleProviders(isAllowed).flatMap((provider) => provider.versions).filter(
      (version) => {
        if (hasImages) {
          return versionSupportsImageToVideo(version);
        }
        return versionSupportsTextToVideo(version);
      },
    );

    // 检查版本是否满足音频/尾帧需求（使用版本级 options）
    const versionMatchesRequirements = (version: (typeof versions)[0]) => {
      if (audio && !version.options.audio) return false;
      if (endFrame && !version.options.endFrame?.isSupported) return false;
      return true;
    };

    // 优先查找与当前模型同品牌的版本
    const currentProvider = getVideoProviderByModelVersion(currentModelVersion);

    // 第一轮：查找同品牌且满足条件的版本
    if (currentProvider) {
      const sameBrandVersion = versions.find(
        (v) => v.provider === currentProvider && versionMatchesRequirements(v),
      );
      if (sameBrandVersion) {
        return sameBrandVersion.modelVersion;
      }
    }

    // 第二轮：查找任意满足条件的版本
    const foundVersion = versions.find(versionMatchesRequirements);

    return foundVersion?.modelVersion;
  }
}

/**
 * 便捷导出：直接使用函数而不是类方法
 */
export const {
  getVersionConfig,
  getCurrentModel,
  getDefaultModel,
  modelSupportsAudio,
  modelSupportsEndFrame,
  pickModelVersion,
} = VideoModelService;
