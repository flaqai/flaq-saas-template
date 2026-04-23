/* eslint-disable @typescript-eslint/naming-convention */

/**
 * 图片生成类型
 * 严格对应后端模型支持的输入输出类型
 */
export type ImageGenerationType =
  | 'text-to-image'
  | 'image-to-image'
  | 'multi-image-to-image'
  | 'image-edit'
  | 'image-variation';

/**
 * 分辨率选项类型
 */
export interface ResolutionOption {
  name: string;
  value: string;
  credit?: number;
}

/**
 * 比例选项类型
 */
export interface RatioOption {
  name: string;
  value: string;
  iconWidth: string;
  iconHeight: string;
  credit?: number;
}

/**
 * 图片模型配置
 */
export interface ImageModel {
  provider: string;
  modelVersion: string;
  model: string;
  name: string;
  platformType: number;
  baseCredit: number;
  isPaid: boolean;
  pricingType: 'image';

  // 生成类型（模型本质属性）
  generationType: ImageGenerationType;
  supportedTypes?: ImageGenerationType[];

  // 参数配置
  options: ImageModelOptions;

  previewUrl?: string;
  tag?: string;
  isComingSoon?: boolean;
}

/**
 * 图片模型参数选项
 */
export interface ImageModelOptions {
  // 图片输入配置
  imageInput?: {
    required: boolean;
    isSupported: boolean;
    min?: number;
    max?: number;
  };

  // 参数选项
  resolution?: ResolutionOption[];
  ratio?: RatioOption[];

  // 预设提示词
  prompt?: string;
}

/**
 * 模型版本配置
 */
export interface ImageModelVersionConfig {
  provider: string;
  modelVersion: string;
  name: string;
  baseCredit: number;
  platformType: number;
  isPaid: boolean;
  pricingType: 'image';
  isComingSoon?: boolean;
  options: {
    resolution?: ResolutionOption[];
    ratio?: RatioOption[];
  };
  models: ImageModel[];
}

/**
 * 提供商配置
 */
export interface ImageProviderConfig {
  provider: string;
  name: string;
  versions: ImageModelVersionConfig[];
}
