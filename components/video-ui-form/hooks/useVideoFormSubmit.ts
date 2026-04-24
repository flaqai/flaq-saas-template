/**
 * 视频表单提交逻辑 Hook
 *
 * 封装表单提交的完整流程：
 * 1. 表单验证（必填字段）
 * 2. 文件上传处理（图片、音频）
 * 3. API 调用
 * 4. 成功/失败处理
 *
 * @example
 * ```tsx
 * const { handleSubmit, isSubmitting } = useVideoFormSubmit({
 *   videoType: 'Image-to-video',
 *   stores,
 *   pathname,
 *   t,
 * });
 * ```
 */

import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import { createVideoTask } from '@/network/video/client';
import { getClientOpenApiConfig } from '@/network/clientFetch';
import { addPendingVideoHistory } from '@/network/video/history';
import useGenerationPollingStore from '@/store/useGenerationPollingStore';
import { shouldCompressImageFileList, type FileType } from '@/lib/utils/fileUtils';
import { showConfettiFireworks } from '@/lib/utils/uiUtils';
import { sendGAEventBtnClicked } from '@/lib/utils/analyticsUtils';
import trimAudioFile from '@/lib/utils/audioUtils';
import { startTaskPolling } from '@/network/task-polling';
import type { VideoModel } from '@/lib/constants/video/';
import type { VideoFormStores } from './useVideoFormStores';
import type { VideoFormData } from '../types';

/**
 * useVideoFormSubmit 的参数
 */
interface UseVideoFormSubmitOptions {
  videoType?: string;
  stores: VideoFormStores;
  pathname: string;
  t: (key: string) => string;
  submitBtnId: string;
}

/**
 * 视频表单提交 Hook
 */
export default function useVideoFormSubmit(options: UseVideoFormSubmitOptions) {
  const { videoType, stores, pathname, t, submitBtnId } = options;
  const {
    setOpenPricingDialogStore,
    uploadFilesToStorageThroughBackEnd,
  } = stores;
  void pathname;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const addProcessingTask = useGenerationPollingStore((state) => state.add);

  /**
   * 处理文件上传
   */
  const uploadFiles = useCallback(
    async (formData: VideoFormData): Promise<{
      startFrameUrl: string;
      endFrameUrl: string;
      imageUrlList: string[];
      clothesChangerImageUrl: string;
      audioUrl: string;
    }> => {
      const filesToUpload: FileType[] = [];

      // 根据模型配置处理图片上传 - 只处理 File 对象，字符串 URL 稍后直接使用
      if (formData.startFrame && formData.startFrame instanceof File) {
        filesToUpload.push({
          type: formData.startFrame.type,
          data: formData.startFrame,
        });
      }

      if (formData.endFrame && formData.endFrame instanceof File) {
        filesToUpload.push({
          type: formData.endFrame.type,
          data: formData.endFrame,
        });
      }

      // 处理多图上传
      if (formData.multiImages && formData.multiImages.length > 0) {
        formData.multiImages.forEach((file) => {
          filesToUpload.push({
            type: file.type,
            data: file,
          });
        });
      }

      // 处理音频文件（需要裁剪的话先裁剪）
      let processedAudioFile = formData.audioFile;
      if (formData.audioFile && formData.audioFile instanceof File && formData.audioTrimRange) {
        const { startTime, endTime } = formData.audioTrimRange;
        if (startTime > 0 || endTime < Infinity) {
          try {
            processedAudioFile = await trimAudioFile(formData.audioFile, startTime, endTime);
          } catch (error) {
            console.error('Failed to trim audio:', error);
            toast.error('音频裁剪失败，将使用完整音频');
          }
        }
      }

      if (processedAudioFile && processedAudioFile instanceof File) {
        filesToUpload.push({
          type: processedAudioFile.type,
          data: processedAudioFile,
        });
      }

      let uploadedUrls: string[] = [];
      if (filesToUpload.length) {
        const compressFilesToUpload = await shouldCompressImageFileList(filesToUpload);
        uploadedUrls = await uploadFilesToStorageThroughBackEnd(compressFilesToUpload);
      }

      // 按照上传顺序的逆序pop URL
      let startFrameUrl = '';
      let endFrameUrl = '';
      let clothesChangerImageUrl = '';
      let audioUrl = '';
      const imageUrlList: string[] = [];

      // 处理音频文件 URL
      if (formData.audioFile && formData.audioFile instanceof File) {
        audioUrl = uploadedUrls.pop()!;
      }

      // 处理多图URL列表（按照上传顺序的逆序pop）
      if (formData.multiImages && formData.multiImages.length > 0) {
        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < formData.multiImages.length; i++) {
          const url = uploadedUrls.pop();
          if (url) imageUrlList.unshift(url); // unshift保持正确的顺序
        }
      }

      // 处理 endFrame - 如果是字符串 URL，直接使用；如果是 File，从上传结果中获取
      if (formData.endFrame) {
        if (formData.endFrame instanceof File) {
          endFrameUrl = uploadedUrls.pop()!;
        } else if (typeof formData.endFrame === 'string') {
          endFrameUrl = formData.endFrame;
        }
      }

      // 处理 startFrame - 如果是字符串 URL，直接使用；如果是 File，从上传结果中获取
      if (formData.startFrame) {
        if (formData.startFrame instanceof File) {
          startFrameUrl = uploadedUrls.pop()!;
        } else if (typeof formData.startFrame === 'string') {
          startFrameUrl = formData.startFrame;
        }
      }

      return { startFrameUrl, endFrameUrl, imageUrlList, clothesChangerImageUrl, audioUrl };
    },
    [uploadFilesToStorageThroughBackEnd],
  );


  /**
   * 处理表单提交
   */
  const handleSubmit = useCallback(
    async (formData: VideoFormData, currentModel: VideoModel) => {
      sendGAEventBtnClicked(submitBtnId);

      if (!currentModel) {
        toast.error('Model not found');
        return;
      }

      if (!formData.prompt && !currentModel.prompt) {
        toast.error(t('noPromptInput'));
        return;
      }

      if (currentModel.options?.startFrame?.required && !formData.startFrame) {
        toast.error(t('noImageInput'));
        return;
      }

      if (currentModel.options?.multiImage?.required) {
        const minImages = currentModel.options.multiImage.minImages || 1;
        if (!formData.multiImages || formData.multiImages.length < minImages) {
          toast.error(t('noImageInput'));
          return;
        }
      }

      setIsSubmitting(true);

      try {
        // 上传文件
        const { startFrameUrl, endFrameUrl, imageUrlList, audioUrl } = await uploadFiles(formData);

        // 统一使用 imageUrlList 管理所有图片（首帧、尾帧、多图等）
        const finalImageUrlList: string[] = [];
        if (startFrameUrl) finalImageUrlList.push(startFrameUrl);
        if (endFrameUrl) finalImageUrlList.push(endFrameUrl);
        if (imageUrlList.length > 0) {
          finalImageUrlList.push(...imageUrlList);
        }

        const prompt = currentModel.prompt || formData.prompt;
        const imageUrls = finalImageUrlList.length > 0 ? finalImageUrlList : undefined;
        const res = await createVideoTask(getClientOpenApiConfig(), {
          model_name: currentModel.model,
          prompt,
          aspect_ratio: formData.ratio || undefined,
          duration: formData.duration ? Number(String(formData.duration).replace('s', '')) : undefined,
          resolution: formData.resolution || undefined,
          image_url: imageUrls?.[0],
          image_end_url: imageUrls?.[1],
          images: imageUrls && imageUrls.length > 2 ? imageUrls : undefined,
          audio_url: audioUrl || undefined,
        });

        // Flaq API 成功时返回 code: 0 或 200
        if ((res.code !== 0 && res.code !== 200) || !res.data?.task_id) {
          toast.error(res.message || 'Video task submit failed');
          return;
        }

        addPendingVideoHistory({
          id: res.data.task_id,
          traceId: res.data.task_id,
          platformName: currentModel.model,
          coverImage: imageUrls?.[0] || '',
          categoryName: '',
          createTime: Date.now(),
          duration: formData.duration ? Number(String(formData.duration).replace('s', '')) : 0,
          errorInfo: '',
          imageEndUrl: imageUrls?.[1] || '',
          imageUrl: imageUrls?.[0] || '',
          prompt,
          videoId: res.data.task_id,
          videoThumbnailUrl: imageUrls?.[0] || '',
          videoUrl: '',
          videoType: videoType as any,
          ratio: formData.ratio,
        });

        addProcessingTask(res.data.task_id, 'video', videoType);
        startTaskPolling(res.data.task_id, 'video');

        // 成功处理
        showConfettiFireworks(3000);
        toast.success(res.message || 'Video task submitted.');
      } catch (error: any) {
        if (String(error?.message || error).toLowerCase().includes('credit')) {
          setOpenPricingDialogStore(true, 'credits');
          return;
        }
        toast.error(error?.message || String(error));
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      submitBtnId,
      videoType,
      t,
      uploadFiles,
      setOpenPricingDialogStore,
      addProcessingTask,
    ],
  );

  return {
    handleSubmit,
    isSubmitting,
  };
}
