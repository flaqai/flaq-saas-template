/**
 * 图片表单提交逻辑 Hook
 *
 * 封装表单提交的完整流程：
 * 1. 表单验证（必填字段）
 * 2. 文件上传处理
 * 3. API 调用
 * 4. 成功/失败处理
 *
 * @example
 * ```tsx
 * const { handleSubmit, isSubmitting } = useImageFormSubmit({
 *   imageFormType: 'ai-image-generator',
 *   selectModel,
 *   showPromptInput: true,
 *   requireImageUpload: false,
 *   formatPrompt,
 *   submitBtnId: 'submit-btn',
 *   t,
 * });
 * ```
 */

import { useCallback, useState } from 'react';
import { toast } from 'sonner';

import { generateImageAsyncApi, ImageGeneratorRequest } from '@/network/generation/client';
import { refreshImageHistory } from '@/network/profile/useUserImageHistory';
import useGenerationPollingStore from '@/store/useGenerationPollingStore';
import { sendGAEventBtnClicked } from '@/lib/utils/analyticsUtils';
import { FileType } from '@/lib/utils/fileUtils';
import { showConfettiFireworks } from '@/lib/utils/uiUtils';
import useUploadFiles from '@/hooks/use-upload-files';
import useUpdateUserInfo from '@/hooks/useUpdateUserInfo';

import { buildImageGenerationRequest } from '../utils/submitUtils';
import type { ImageFormData } from '../types';
import type { ImageModel } from '@/lib/constants/image/types';

/**
 * useImageFormSubmit 的参数
 */
interface UseImageFormSubmitOptions {
  imageFormType: string;
  selectModel: (hasImages: boolean) => ImageModel | undefined;
  showPromptInput?: boolean;
  requireImageUpload?: boolean;
  formatPrompt?: (prompt: string) => string;
  submitBtnId?: string;
  t: (key: string) => string;
}

/**
 * 图片表单提交 Hook
 */
export function useImageFormSubmit(options: UseImageFormSubmitOptions) {
  const {
    imageFormType,
    selectModel,
    showPromptInput = true,
    requireImageUpload = false,
    formatPrompt,
    submitBtnId = 'image-form-submit-btn',
    t,
  } = options;

  const [isSubmitting, setIsSubmitting] = useState(false);

  const addProcessingTask = useGenerationPollingStore((state) => state.add);
  const removeProcessingTask = useGenerationPollingStore((state) => state.remove);
  const uploadFilesToStorageThroughBackEnd = useUploadFiles();
  const { updateUserInfoWithDelay } = useUpdateUserInfo();

  /**
   * 处理表单提交
   */
  const handleSubmit = useCallback(
    async (formData: ImageFormData, event?: React.BaseSyntheticEvent) => {
      if (isSubmitting) return;

      event?.stopPropagation();
      sendGAEventBtnClicked(submitBtnId);

      // 根据表单数据（有无图片）选择具体的模型
      const hasImagesInForm =
        (formData.images && formData.images.length > 0) ||
        formData.subjectImage ||
        formData.objectImage ||
        (formData.objectImages && formData.objectImages.length > 0);
      const modelToUse = selectModel(hasImagesInForm);

      if (!modelToUse) {
        toast.error('Please select a model');
        return;
      }

      if (showPromptInput && !formData.prompt) {
        toast.error(t('noPromptInput'));
        return;
      }

      if (requireImageUpload) {
        const isProductMode = 'subjectImage' in formData || 'objectImage' in formData || 'objectImages' in formData;
        if (isProductMode) {
          const hasObjectImage = formData.objectImage ||
            (formData.objectImages && formData.objectImages.length > 0);
          if (!formData.subjectImage || !hasObjectImage) {
            toast.error(t('noImageUpload'));
            return;
          }
        } else if (!formData.images || formData.images.length === 0) {
          toast.error(t('noImageUpload'));
          return;
        }
      }

      // 声明 res 以便在 catch 块中访问
      let res;

      setIsSubmitting(true);

      try {
        // 上传图片 - 支持 File 和 URL 混合
        const filesToUpload: FileType[] = [];
        const existingImageUrls: string[] = [];

        (formData.images || []).forEach((image: File | string) => {
          if (typeof image === 'string') {
            existingImageUrls.push(image);
          } else if (image instanceof File) {
            filesToUpload.push({
              data: image,
              type: image.type,
            });
          }
        });

        // 处理 subjectImage 和 objectImage（用于 product-to-video 等场景）
        if (formData.subjectImage) {
          if (typeof formData.subjectImage === 'string') {
            existingImageUrls.push(formData.subjectImage);
          } else if (formData.subjectImage instanceof File) {
            filesToUpload.push({
              data: formData.subjectImage,
              type: formData.subjectImage.type,
            });
          }
        }
        if (formData.objectImage) {
          if (typeof formData.objectImage === 'string') {
            existingImageUrls.push(formData.objectImage);
          } else if (formData.objectImage instanceof File) {
            filesToUpload.push({ data: formData.objectImage, type: formData.objectImage.type });
          }
        }

        // 处理 objectImages 数组（用于 virtual-try-on 等多图场景）
        if (formData.objectImages && formData.objectImages.length > 0) {
          formData.objectImages.forEach((img: File | string) => {
            if (typeof img === 'string') {
              existingImageUrls.push(img);
            } else if (img instanceof File) {
              filesToUpload.push({ data: img, type: img.type });
            }
          });
        }

        const uploadedUrls =
          filesToUpload.length > 0 ? await uploadFilesToStorageThroughBackEnd(filesToUpload) : [];
        const allImageUrls = [...uploadedUrls, ...existingImageUrls];

        // 格式化 prompt
        const finalPrompt = formatPrompt
          ? formatPrompt(formData.prompt || '')
          : formData.prompt || '';

        // 使用工具函数构建请求数据
        const reqData = buildImageGenerationRequest({
          formData,
          modelToUse,
          uploadedUrls: allImageUrls,
          finalPrompt,
          defaultImageFormType: imageFormType,
        });

        res = await generateImageAsyncApi(reqData as ImageGeneratorRequest);

        const { code, msg, data } = res;

        if (code !== 200 || data?.status === 'failed' || !data?.key) {
          throw new Error(msg);
        }

        // 添加到全局轮询状态，后台处理生成任务
        addProcessingTask(res.data.key, 'image', imageFormType);

        // 显示成功提示和特效
        showConfettiFireworks(3000);
        toast.success(res.msg);

        // 刷新历史记录，让用户在历史记录中看到新任务
        refreshImageHistory();
      } catch (error: any) {
        // 提交失败时移除全局轮询任务
        if (res?.data?.key) {
          removeProcessingTask(res.data.key);
        }
        toast.error(error?.message || String(error));
      } finally {
        setIsSubmitting(false);
        updateUserInfoWithDelay();
      }
    },
    [
      isSubmitting,
      submitBtnId,
      selectModel,
      showPromptInput,
      requireImageUpload,
      formatPrompt,
      imageFormType,
      t,
      addProcessingTask,
      removeProcessingTask,
      uploadFilesToStorageThroughBackEnd,
      updateUserInfoWithDelay,
    ],
  );

  return {
    handleSubmit,
    isSubmitting,
  };
}
