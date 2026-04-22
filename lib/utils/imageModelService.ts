import type { ImageModel, ImageGenerationType, ResolutionOption, RatioOption } from '@/lib/constants/image/types';

/**
 * 检查模型是否支持特定的生成类型
 */
export function supportsGenerationType(model: ImageModel, generationType: ImageGenerationType): boolean {
  return (
    model.generationType === generationType ||
    (model.supportedTypes?.includes(generationType) ?? false)
  );
}

/**
 * 获取分辨率选项
 */
export function getResolutionOptions(model: ImageModel): ResolutionOption[] {
  return model.options.resolution || [];
}

/**
 * 获取比例选项
 */
export function getRatioOptions(model: ImageModel): RatioOption[] {
  return model.options.ratio || [];
}

/**
 * 获取模型的图片输入要求
 */
export function getImageInputRequirements(model: ImageModel) {
  return model.options.imageInput || { required: false, isSupported: false };
}
