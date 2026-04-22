import { useMemo } from 'react';
import type { ImageModelVersionConfig, ImageModel } from '@/lib/constants/image/types';
import { ALL_IMAGE_PROVIDERS } from '@/lib/constants/image';
import { supportsGenerationType } from '@/lib/utils/imageModelService';

/**
 * 模型配置解析 Hook
 *
 * 职责：
 * 1. 根据 modelVersion 获取版本配置
 * 2. 提供 UI 配置（ratio/resolution 选项）
 * 3. 提供模型选择函数（供提交时使用）
 */
export function useModelConfig(params: {
  selectedModelVersion?: string;
  customVersionList?: ImageModelVersionConfig[];
}) {
  const { selectedModelVersion, customVersionList } = params;

  // 1. 获取版本配置
  const versionConfig = useMemo(() => {
    if (!selectedModelVersion) return null;

    // 优先从 customVersionList 中查找
    if (customVersionList) {
      const config = customVersionList.find(v => v.modelVersion === selectedModelVersion);
      return config || null;
    }

    // 否则从 ALL_IMAGE_PROVIDERS 中查找
    const config = ALL_IMAGE_PROVIDERS
      .flatMap(p => p.versions)
      .find(v => v.modelVersion === selectedModelVersion);

    return config || null;
  }, [selectedModelVersion, customVersionList]);

  // 2. UI 配置（来自 version 级别，不受内部模型切换影响）
  const uiConfig = useMemo(() => {
    if (!versionConfig) {
      return {
        ratioOptions: [],
        resolutionOptions: [],
        supportsImageInput: false,
        maxImages: 0,
      };
    }

    const supportsImageInput = versionConfig.models.some(
      m => m.options?.imageInput?.isSupported
    );

    const editModel = versionConfig.models.find(
      m => m.options?.imageInput?.isSupported
    );
    const maxImages = editModel?.options?.imageInput?.max || 5;

    const config = {
      ratioOptions: versionConfig.options?.ratio || [],
      resolutionOptions: versionConfig.options?.resolution || [],
      supportsImageInput,
      maxImages,
    };

    return config;
  }, [versionConfig]);

  // 3. 模型选择函数（根据是否有图片选择具体模型）
  const selectModel = useMemo(() => {
    return (hasImages: boolean): ImageModel | null => {
      if (!versionConfig) return null;

      if (hasImages) {
        return versionConfig.models.find(
          m => supportsGenerationType(m, 'image-edit') ||
               supportsGenerationType(m, 'multi-image-to-image')
        ) || versionConfig.models[0];
      } else {
        return versionConfig.models.find(
          m => m.generationType === 'text-to-image'
        ) || versionConfig.models[0];
      }
    };
  }, [versionConfig]);

  return {
    versionConfig,
    uiConfig,
    selectModel,
  };
}
