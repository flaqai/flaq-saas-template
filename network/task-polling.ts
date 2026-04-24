'use client';

import { toast } from 'sonner';
import { getClientOpenApiConfigAsync } from '@/network/clientFetch';
import { getImageTask } from '@/network/image/client';
import {
  completeImageHistory,
  failImageHistory,
  imageHistoryKey,
  type ImageHistoryItem,
} from '@/network/image/history';
import { readLocalHistory } from '@/network/local-history';
import { getVideoTask } from '@/network/video/client';
import {
  completeVideoHistory,
  failVideoHistory,
  videoHistoryKey,
  type VideoHistoryItem,
} from '@/network/video/history';
import useGenerationPollingStore from '@/store/useGenerationPollingStore';

type PollingTask = {
  traceId: string;
  type: 'image' | 'video';
  submitTime: number;
};

const POLLING_INTERVAL = 3000;
const TASK_TIMEOUT = 5 * 60 * 1000;
const activePolls = new Map<string, number>();

function finishTask(traceId: string) {
  const timeout = activePolls.get(traceId);
  if (timeout) {
    window.clearTimeout(timeout);
  }
  activePolls.delete(traceId);
  useGenerationPollingStore.getState().remove(traceId);
}

function scheduleNext(task: PollingTask) {
  const timeout = window.setTimeout(() => {
    void pollTask(task);
  }, POLLING_INTERVAL);
  activePolls.set(task.traceId, timeout);
}

async function pollTask(task: PollingTask): Promise<void> {
  try {
    if (Date.now() - task.submitTime > TASK_TIMEOUT) {
      if (task.type === 'image') failImageHistory(task.traceId, 'Task timeout');
      if (task.type === 'video') failVideoHistory(task.traceId, 'Task timeout');
      finishTask(task.traceId);
      return;
    }

    const config = await getClientOpenApiConfigAsync();

    if (task.type === 'image') {
      const res = await getImageTask(config, task.traceId);
      if (res.data.task_status === 'succeed') {
        const result = res.data.task_result?.images?.[0];
        completeImageHistory(task.traceId, {
          url: result?.url,
          thumbnailUrl: result?.thumbnail_url,
          resolution: result?.resolution,
        });
        finishTask(task.traceId);
        return;
      }

      if (res.data.task_status === 'failed') {
        failImageHistory(task.traceId, res.data.task_status_msg || undefined);
        finishTask(task.traceId);
        if (res.data.task_status_msg) toast.error(res.data.task_status_msg);
        return;
      }

      scheduleNext(task);
      return;
    }

    const res = await getVideoTask(config, task.traceId);
    if (res.data.task_status === 'succeed') {
      const result = res.data.task_result?.videos?.[0];
      completeVideoHistory(task.traceId, {
        videoUrl: result?.url,
        videoThumbnailUrl: result?.cover_url,
        duration: result?.duration,
        ratio: result?.ratio,
      });
      finishTask(task.traceId);
      return;
    }

    if (res.data.task_status === 'failed') {
      failVideoHistory(task.traceId, res.data.task_status_msg || undefined);
      finishTask(task.traceId);
      if (res.data.task_status_msg) toast.error(res.data.task_status_msg);
      return;
    }

    scheduleNext(task);
  } catch (error) {
    // If clientKey is not configured, stop polling
    if (error instanceof Error && error.message.includes('client key')) {
      const errorMsg = 'Please configure your Flaq client key in settings first.';
      if (task.type === 'image') failImageHistory(task.traceId, errorMsg);
      if (task.type === 'video') failVideoHistory(task.traceId, errorMsg);
      finishTask(task.traceId);
      return;
    }

    // Retry on other errors
    scheduleNext(task);
  }
}

export async function startTaskPolling(traceId: string, type: 'image' | 'video', submitTime = Date.now()) {
  if (typeof window === 'undefined') return;
  if (!traceId || activePolls.has(traceId)) return;

  // Check if clientKey is configured
  try {
    await getClientOpenApiConfigAsync();
  } catch (error) {
    const errorMsg = 'Please configure your Flaq client key in settings first.';
    if (type === 'image') failImageHistory(traceId, errorMsg);
    if (type === 'video') failVideoHistory(traceId, errorMsg);
    return;
  }

  useGenerationPollingStore.getState().add(traceId, type);
  void pollTask({ traceId, type, submitTime });
}

export function restorePendingTaskPolling() {
  if (typeof window === 'undefined') return;

  const pendingImages = readLocalHistory<ImageHistoryItem>(imageHistoryKey).filter(
    (item) => item.status === 'processing' && (item.taskId || item.id),
  );
  const pendingVideos = readLocalHistory<VideoHistoryItem>(videoHistoryKey).filter(
    (item) => (item.status === 'processing' || item.status === 'pending') && (item.traceId || item.id),
  );

  pendingImages.forEach((item) => {
    startTaskPolling(item.taskId || item.id, 'image', item.createTime || Date.now());
  });

  pendingVideos.forEach((item) => {
    startTaskPolling(item.traceId || item.id, 'video', item.createTime || Date.now());
  });
}

export function stopAllTaskPolling() {
  activePolls.forEach((timeout) => {
    window.clearTimeout(timeout);
  });
  activePolls.clear();
}
