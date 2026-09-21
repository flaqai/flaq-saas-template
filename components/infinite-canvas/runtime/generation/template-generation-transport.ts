'use client';

import { getClientOpenApiConfigAsync, type OpenApiTaskStatus } from '@/network/clientFetch';
import { createImageTask, getImageTask } from '@/network/image/client';
import { createVideoTask, getVideoTask } from '@/network/video/client';
import { addPendingImageHistory } from '@/network/image/history';
import { addPendingVideoHistory } from '@/network/video/history';
import { startTaskPolling } from '@/network/task-polling';
import { ALL_IMAGE_MODELS } from '@/lib/constants/image';
import { ALL_VIDEO_MODELS } from '@/lib/constants/video';
import { CanvasClientKeyRequiredError } from './generation-bindings';
import type { InfiniteCanvasGenerationTransport } from '../../infinite-canvas.types';
import type { CanvasProjectTaskStatus } from '../../types/project';

const statusMap: Record<OpenApiTaskStatus, CanvasProjectTaskStatus> = {
  submitted: 'pending', processing: 'processing', succeed: 'completed', failed: 'fail',
};

async function getConfig() {
  try { return await getClientOpenApiConfigAsync(); }
  catch { throw new CanvasClientKeyRequiredError(); }
}

/** Adapts the existing public API response to the editor's task lifecycle. */
export const templateGenerationTransport: InfiniteCanvasGenerationTransport = {
  async submitImage(request) {
    const response = await createImageTask(await getConfig(), request);
    if (response.code !== 0 || !response.data?.task_id) throw new Error(response.message);
    const model = ALL_IMAGE_MODELS.find((item) => item.model === request.model_name);
    addPendingImageHistory({
      id: response.data.task_id,
      taskId: response.data.task_id,
      prompt: request.prompt,
      createTime: Date.now(),
      url: '',
      thumbnailUrl: request.image_url_list?.[0] || '',
      resolution: request.resolution || `${request.width}x${request.height}`,
      modelName: request.model_name,
      modelInfo: model?.name || request.model_name,
      userImageUrlList: request.image_url_list || [],
    });
    void startTaskPolling(response.data.task_id, 'image');
    return { taskId: response.data.task_id };
  },
  async submitVideo(request) {
    const response = await createVideoTask(await getConfig(), request);
    if (response.code !== 0 || !response.data?.task_id) throw new Error(response.message);
    const model = ALL_VIDEO_MODELS.find((item) => item.model === request.model_name);
    const imageUrl = request.image_url || request.images?.[0] || '';
    addPendingVideoHistory({
      id: response.data.task_id,
      traceId: response.data.task_id,
      platformName: request.model_name,
      coverImage: imageUrl,
      categoryName: '',
      createTime: Date.now(),
      duration: request.duration || 0,
      errorInfo: '',
      imageEndUrl: request.image_end_url || '',
      imageUrl,
      prompt: request.prompt,
      videoId: response.data.task_id,
      videoThumbnailUrl: imageUrl,
      videoUrl: '',
      videoType: model?.generationType === 'reference-to-video'
        ? 'Reference-to-video'
        : model?.generationType === 'image-to-video' || request.image_url ? 'Image-to-video' : 'Text-to-video',
      ratio: request.aspect_ratio,
    });
    void startTaskPolling(response.data.task_id, 'video');
    return { taskId: response.data.task_id };
  },
  async getImageTask(taskId, { signal }) {
    signal?.throwIfAborted();
    const response = await getImageTask(await getConfig(), taskId);
    signal?.throwIfAborted();
    if (response.code !== 0) throw new Error(response.message);
    return { status: statusMap[response.data.task_status], resultUrl: response.data.task_result?.images?.[0]?.url ?? '', error: response.data.task_status_msg ?? '' };
  },
  async getVideoTask(taskId, { signal }) {
    signal?.throwIfAborted();
    const response = await getVideoTask(await getConfig(), taskId);
    signal?.throwIfAborted();
    if (response.code !== 0) throw new Error(response.message);
    return { status: statusMap[response.data.task_status], resultUrl: response.data.task_result?.videos?.[0]?.url ?? '', error: response.data.task_status_msg ?? '' };
  },
};
