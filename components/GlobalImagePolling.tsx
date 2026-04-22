'use client';

import { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { pollImageApi } from '@/network/generation/client';
import { refreshImageHistory } from '@/network/profile/useUserImageHistory';
import useGenerationPollingStore from '@/store/useGenerationPollingStore';

/**
 * 全局图片生成任务轮询组件
 *
 * 负责轮询所有正在处理的图片任务，检查状态并在完成时更新
 */
export default function GlobalImagePolling() {
  const processingTasksMap = useGenerationPollingStore((state) => state.processingTasks);
  const removeProcessingTask = useGenerationPollingStore((state) => state.remove);
  const pollingIntervalsRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

  useEffect(() => {
    const allTasks = Array.from(processingTasksMap.values());
    const imageTasks = allTasks.filter((task) => task.type === 'image');
    const currentTaskIds = new Set(imageTasks.map((task) => task.traceId));

    // 清理不再存在的任务的轮询
    pollingIntervalsRef.current.forEach((interval, traceId) => {
      if (!currentTaskIds.has(traceId)) {
        clearInterval(interval);
        pollingIntervalsRef.current.delete(traceId);
      }
    });

    // 为新任务创建轮询
    imageTasks.forEach((task) => {
      if (!pollingIntervalsRef.current.has(task.traceId)) {
        const startPolling = async () => {
          const maxTime = 5 * 60 * 1000; // 5分钟超时
          const startTime = task.submitTime;

          const interval = setInterval(async () => {
            try {
              // 检查是否超时
              if (Date.now() - startTime > maxTime) {
                clearInterval(interval);
                pollingIntervalsRef.current.delete(task.traceId);
                removeProcessingTask(task.traceId);
                return;
              }

              // 轮询任务状态
              const res = await pollImageApi(task.traceId);

              if (res.code === 200 && res.data) {
                // 检查任务状态
                if (res.data.status === 'success' && res.data.imageResponseVo) {
                  // 任务完成
                  clearInterval(interval);
                  pollingIntervalsRef.current.delete(task.traceId);
                  removeProcessingTask(task.traceId);
                  refreshImageHistory();
                } else if (res.data.status === 'failed' || res.data.status === 'fail') {
                  // 任务失败
                  clearInterval(interval);
                  pollingIntervalsRef.current.delete(task.traceId);
                  removeProcessingTask(task.traceId);
                  // 显示错误消息
                  if (res.data.message) {
                    toast.error(res.data.message);
                  }
                }
                // status === 'await' 或 'pending' 或 'processing' 时继续轮询
              }
            } catch (error) {
              console.error('Polling error:', error);
            }
          }, 3000); // 每3秒轮询一次

          pollingIntervalsRef.current.set(task.traceId, interval);
        };

        startPolling();
      }
    });

    // 清理函数
    return () => {
      pollingIntervalsRef.current.forEach((interval) => clearInterval(interval));
      pollingIntervalsRef.current.clear();
    };
  }, [processingTasksMap, removeProcessingTask]);

  return null;
}
