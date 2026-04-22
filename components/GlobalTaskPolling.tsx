'use client';

import { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { getImageTask } from '@/network/image/client';
import { getClientOpenApiConfig } from '@/network/clientFetch';
import { completeImageHistory, failImageHistory } from '@/network/image/history';
import { completeVideoHistory, failVideoHistory } from '@/network/video/history';
import { getVideoTask } from '@/network/video/client';
import useGenerationPollingStore from '@/store/useGenerationPollingStore';

export default function GlobalTaskPolling() {
  const processingTasksMap = useGenerationPollingStore((state) => state.processingTasks);
  const removeProcessingTask = useGenerationPollingStore((state) => state.remove);
  const pollingIntervalsRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

  useEffect(() => {
    const allTasks = Array.from(processingTasksMap.values());
    const currentTaskIds = new Set(allTasks.map((task) => task.traceId));

    pollingIntervalsRef.current.forEach((interval, traceId) => {
      if (!currentTaskIds.has(traceId)) {
        clearInterval(interval);
        pollingIntervalsRef.current.delete(traceId);
      }
    });

    allTasks.forEach((task) => {
      if (pollingIntervalsRef.current.has(task.traceId)) return;

      const interval = setInterval(async () => {
        try {
          if (Date.now() - task.submitTime > 5 * 60 * 1000) {
            clearInterval(interval);
            pollingIntervalsRef.current.delete(task.traceId);
            removeProcessingTask(task.traceId);
            if (task.type === 'image') failImageHistory(task.traceId, 'Task timeout');
            if (task.type === 'video') failVideoHistory(task.traceId, 'Task timeout');
            return;
          }

          const config = getClientOpenApiConfig();

          if (task.type === 'image') {
            const res = await getImageTask(config, task.traceId);
            if (res.data.task_status === 'succeed') {
              const result = res.data.task_result?.images?.[0];
              completeImageHistory(task.traceId, {
                url: result?.url,
                thumbnailUrl: result?.thumbnail_url,
                resolution: result?.resolution,
              });
              clearInterval(interval);
              pollingIntervalsRef.current.delete(task.traceId);
              removeProcessingTask(task.traceId);
            } else if (res.data.task_status === 'failed') {
              failImageHistory(task.traceId, res.data.task_status_msg || undefined);
              clearInterval(interval);
              pollingIntervalsRef.current.delete(task.traceId);
              removeProcessingTask(task.traceId);
              if (res.data.task_status_msg) toast.error(res.data.task_status_msg);
            }
            return;
          }

          if (task.type === 'video') {
            const res = await getVideoTask(config, task.traceId);
            if (res.data.task_status === 'succeed') {
              const result = res.data.task_result?.videos?.[0];
              completeVideoHistory(task.traceId, {
                videoUrl: result?.url,
                videoThumbnailUrl: result?.cover_url,
                duration: result?.duration,
                ratio: result?.ratio,
              });
              clearInterval(interval);
              pollingIntervalsRef.current.delete(task.traceId);
              removeProcessingTask(task.traceId);
            } else if (res.data.task_status === 'failed') {
              failVideoHistory(task.traceId, res.data.task_status_msg || undefined);
              clearInterval(interval);
              pollingIntervalsRef.current.delete(task.traceId);
              removeProcessingTask(task.traceId);
              if (res.data.task_status_msg) toast.error(res.data.task_status_msg);
            }
          }
        } catch (error) {
          console.error('Task polling error:', error);
        }
      }, 3000);

      pollingIntervalsRef.current.set(task.traceId, interval);
    });

    return () => {
      pollingIntervalsRef.current.forEach((interval) => clearInterval(interval));
      pollingIntervalsRef.current.clear();
    };
  }, [processingTasksMap, removeProcessingTask]);

  return null;
}
