/**
 * Video form submission logic Hook
 *
 * Encapsulates the complete form submission process:
 * 1. Form validation (required fields)
 * 2. File upload handling (images, audio)
 * 3. API call
 * 4. Success/failure handling
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
 * Parameters for useVideoFormSubmit
 */
interface UseVideoFormSubmitOptions {
  videoType?: string;
  stores: VideoFormStores;
  pathname: string;
  t: (key: string) => string;
  submitBtnId: string;
}

/**
 * Video form submission Hook
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
   * Handle file upload
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

      // Handle image upload based on model configuration - only process File objects, string URLs will be used directly later
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

      // Handle multi-image upload
      if (formData.multiImages && formData.multiImages.length > 0) {
        formData.multiImages.forEach((file) => {
          filesToUpload.push({
            type: file.type,
            data: file,
          });
        });
      }

      // Handle audio file (trim first if needed)
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

      // Pop URLs in reverse order of upload
      let startFrameUrl = '';
      let endFrameUrl = '';
      let clothesChangerImageUrl = '';
      let audioUrl = '';
      const imageUrlList: string[] = [];

      // Handle audio file URL
      if (formData.audioFile && formData.audioFile instanceof File) {
        audioUrl = uploadedUrls.pop()!;
      }

      // Handle multi-image URL list (pop in reverse order of upload)
      if (formData.multiImages && formData.multiImages.length > 0) {
        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < formData.multiImages.length; i++) {
          const url = uploadedUrls.pop();
          if (url) imageUrlList.unshift(url); // unshift to maintain correct order
        }
      }

      // Handle endFrame - if it's a string URL, use directly; if it's a File, get from upload result
      if (formData.endFrame) {
        if (formData.endFrame instanceof File) {
          endFrameUrl = uploadedUrls.pop()!;
        } else if (typeof formData.endFrame === 'string') {
          endFrameUrl = formData.endFrame;
        }
      }

      // Handle startFrame - if it's a string URL, use directly; if it's a File, get from upload result
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
   * Handle form submission
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
        // Upload files
        const { startFrameUrl, endFrameUrl, imageUrlList, audioUrl } = await uploadFiles(formData);

        // Uniformly use imageUrlList to manage all images (start frame, end frame, multi-images, etc.)
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

        // Flaq API returns business code 0 on success
        if (res.code !== 0 || !res.data?.task_id) {
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

        // Success handling
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
