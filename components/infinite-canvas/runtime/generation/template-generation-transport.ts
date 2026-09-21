'use client';

import { getClientOpenApiConfigAsync, type OpenApiTaskStatus } from '@/network/clientFetch';
import { createImageTask, getImageTask } from '@/network/image/client';
import { createVideoTask, getVideoTask } from '@/network/video/client';
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
    return { taskId: response.data.task_id };
  },
  async submitVideo(request) {
    const response = await createVideoTask(await getConfig(), request);
    if (response.code !== 0 || !response.data?.task_id) throw new Error(response.message);
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
