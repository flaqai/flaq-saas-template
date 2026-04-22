import type { ImageModel, ImageModelVersionConfig } from '@/lib/constants/image/types';

/**
 * 将 ImageModel 数组转换为 ImageModelVersionConfig 数组
 * 用于将自定义模型列表转换为版本配置格式
 */
export function convertModelsToVersionConfigs(models: ImageModel[]): ImageModelVersionConfig[] {
  return models.map((model) => ({
    provider: model.provider,
    modelVersion: model.modelVersion,
    name: model.name,
    baseCredit: model.baseCredit,
    platformType: model.platformType,
    isPaid: model.isPaid,
    pricingType: model.pricingType,
    isComingSoon: model.isComingSoon,
    options: {
      resolution: model.options?.resolution,
      ratio: model.options?.ratio,
    },
    models: [model], // 将单个模型包装成数组，保留完整的模型配置（包括 imageInput）
  }));
}
