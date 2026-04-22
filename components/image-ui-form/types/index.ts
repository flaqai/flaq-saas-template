import type { UseFormReturn } from 'react-hook-form';
import type { z } from 'zod';
import type { ImageModel, ImageModelVersionConfig } from '@/lib/constants/image/types';
import type { RadioButtonOption } from '@/components/form-fields/display/RadioButtonGroup';
import type { MotionOption } from '@/components/form-fields/display/MotionField';
import type { ImageFormType } from '../image-context-provider';

/**
 * 图片表单数据类型
 */
export interface ImageFormData {
  prompt?: string;
  images: (File | string)[];
  modelVersion?: string;
  aspectRatio?: string;
  resolution?: string;
  [key: string]: any;
}

/**
 * 图片表单 Props
 */
export interface ImageFormProps {
  className?: string;

  formTitle?: string;
  submitBtnId: string;
  promptTitle?: string;
  uploadImagesTitle?: string;

  // 自定义模型列表
  customModelList?: ImageModel[];
  customVersionList?: ImageModelVersionConfig[];

  // Display control
  showPromptInput?: boolean;
  showRatio?: boolean;
  showModelVersion?: boolean;

  // Template Selector
  showTemplateSelector?: boolean;
  imageTemplateList?: {
    key: string;
    imageUrl: string;
    prompt: string;
  }[];
  translationNamespace?: string;

  /**
   * 图片上传模式
   * - `'none'` - 不显示上传组件
   * - `'single'` - 强制单图上传（maxImages=1）
   * - `'auto'` - 根据模型配置自动决定（默认）
   */
  imageUploadMode?: 'none' | 'single' | 'auto';

  /**
   * 是否必须上传图片才能生成
   * 设置为 true 时，提交表单前会验证是否已上传图片
   */
  requireImageUpload?: boolean;

  // Motion Field
  showMotionField?: boolean;
  motionFieldOptions?: MotionOption[];
  motionFieldLabel?: string;
  currentMotionId?: string;
  onMotionChange?: (value: string) => void;

  // RadioButtonGroup
  showRadioButtonGroup?: boolean;
  radioButtonGroupOptions?: RadioButtonOption[];
  radioButtonGroupFieldName?: string;
  radioButtonGroupLabel?: string;
  radioButtonGroupTranslationNamespace?: string;
  onRadioButtonGroupChange?: (value: string) => void;

  // 表单值优先级配置
  defaultValuePriority?: {
    aspectRatio?: string[];
    resolution?: string[];
  };

  // Custom nodes
  slotNode?: React.ReactNode;
  slotNodeFunc?: (form: UseFormReturn<any>) => React.ReactNode;
  slotNodeAfterModel?: React.ReactNode;
  slotNodeFuncAfterInput?: (form: UseFormReturn<any>) => React.ReactNode;
  slotNodeAfter?: React.ReactNode;
  customRightContent?: React.ReactNode;

  // 支持首尾帧独立轮询状态
  imageObjContext?: 'default' | 'start-frame' | 'end-frame';

  // Schema & defaults
  imageFormType: ImageFormType;
  moreFormSchema?: z.ZodObject<any>;
  defaultValues?: Partial<ImageFormData>;

  // Callbacks
  onResetAll?: () => void;
  formatPrompt?: (prompt: string) => string;
  styleName?: string;
}

/**
 * 表单验证结果
 */
export interface FormValidationResult {
  valid: boolean;
  error?: 'noPromptInput' | 'noImageUpload';
}

/**
 * 宽高比解析结果
 */
export interface AspectRatioParseResult {
  width: number;
  height: number;
  isAutoRatio: boolean;
}
