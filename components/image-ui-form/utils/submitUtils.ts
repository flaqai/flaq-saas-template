import type { ImageFormData, FormValidationResult, AspectRatioParseResult } from '../types';
import type { ImageModel } from '@/lib/constants/image/types';
import type { CreateImageTaskRequest } from '@/network/image/client';
import { removeEmptyProperties } from '@/lib/utils/objectUtils';

/**
 * 验证图片表单
 */
export function validateImageForm(params: {
  formData: ImageFormData;
  showPromptInput: boolean;
  requireImageUpload?: boolean;
}): FormValidationResult {
  const { formData, showPromptInput, requireImageUpload } = params;

  if (showPromptInput && !formData.prompt) {
    return { valid: false, error: 'noPromptInput' };
  }

  if (requireImageUpload) {
    // 检查是否使用 product 模式（subjectImage + objectImage/objectImages）
    const isProductMode = 'subjectImage' in formData || 'objectImage' in formData || 'objectImages' in formData;

    if (isProductMode) {
      // product 模式需要 subject 和 object 都有
      const hasObjectImage = formData.objectImage ||
        (formData.objectImages && formData.objectImages.length > 0);
      if (!formData.subjectImage || !hasObjectImage) {
        return { valid: false, error: 'noImageUpload' };
      }
    } else {
      // 普通模式只需要 images 有值
      if (!formData.images || formData.images.length === 0) {
        return { valid: false, error: 'noImageUpload' };
      }
    }
  }

  return { valid: true };
}

/**
 * 解析宽高比
 */
export function parseAspectRatio(aspectRatio?: string): AspectRatioParseResult {
  if (!aspectRatio) {
    return { width: 0, height: 0, isAutoRatio: true };
  }

  const isAutoRatio = aspectRatio === '-';

  if (isAutoRatio) {
    return { width: 0, height: 0, isAutoRatio: true };
  }

  const [w, h] = aspectRatio.split(':').map(Number);
  return {
    width: w || 1,
    height: h || 1,
    isAutoRatio: false,
  };
}

/**
 * 构建图片生成请求数据
 *
 * 注意：使用 removeEmptyProperties 过滤掉空值字段（'', undefined, null）
 * 避免发送无效字段给后端导致对接问题
 */
export function buildImageGenerationRequest(params: {
  formData: ImageFormData;
  modelToUse: ImageModel;
  uploadedUrls: string[];
  finalPrompt: string;
  defaultImageFormType?: string;
}) {
  const { formData, modelToUse, uploadedUrls, finalPrompt, defaultImageFormType } = params;
  const { width, height, isAutoRatio } = parseAspectRatio(formData.aspectRatio);

  void defaultImageFormType;

  const rawRequest: CreateImageTaskRequest = {
    model_name: modelToUse.model,
    prompt: finalPrompt,
    width: isAutoRatio ? 1 : width || 1,
    height: isAutoRatio ? 1 : height || 1,
    image_url_list: uploadedUrls.length > 0 ? uploadedUrls : undefined,
    resolution: formData.resolution || undefined,
  };

  // 过滤掉空值字段（'', undefined, null）
  return removeEmptyProperties(rawRequest);
}

/**
 * 验证图片文件
 *
 * 检查项：
 * 1. 宽高比范围（0.33 - 3.0）
 * 2. 图片是否可加载
 */
export async function validateImageFile(params: {
  file: File;
  errorMessages: {
    aspectRatioOutOfRange: string;
    imageLoadFailed: string;
  };
  onError: (message: string) => void;
}): Promise<boolean> {
  const { file, errorMessages, onError } = params;

  // 检查宽高比
  const ok = await new Promise<boolean>((resolve) => {
    const img = new Image();

    img.onload = () => {
      const aspectRatio = img.width / img.height;

      if (aspectRatio < 0.33 || aspectRatio > 3.0) {
        onError(`${errorMessages.aspectRatioOutOfRange} ${aspectRatio.toFixed(2)}`);
        resolve(false);
      } else {
        resolve(true);
      }

      // 清理 URL
      URL.revokeObjectURL(img.src);
    };

    img.onerror = () => {
      onError(errorMessages.imageLoadFailed);
      URL.revokeObjectURL(img.src);
      resolve(false);
    };

    img.src = URL.createObjectURL(file);
  });

  return ok;
}
