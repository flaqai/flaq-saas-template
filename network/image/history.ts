import { useEffect, useMemo, useState } from 'react';

import { ImageFormType } from '@/components/image-ui-form/image-context-provider';
import { notifyLocalHistory, readLocalHistory, subscribeLocalHistory, writeLocalHistory } from '../local-history';

export const imageHistoryKey = 'flaq_image_history';

export type ImageHistoryItem = {
  id: string;
  prompt: string;
  createTime: number;
  url: string;
  thumbnailUrl: string;
  resolution: string;
  size?: number;
  modelName?: string;
  modelInfo?: string;
  userImageUrlList?: string[];
  status?: 'processing' | 'completed' | 'fail';
  taskId?: string;
  errorInfo?: string;
};

export type ImageHistoryFilterType = ImageFormType;

export default function useImageHistory(pageNum: number, pageSize: number, filter?: ImageHistoryFilterType) {
  void filter;

  const [data, setData] = useState<ImageHistoryItem[]>([]);

  useEffect(() => {
    setData(readLocalHistory<ImageHistoryItem>(imageHistoryKey));

    return subscribeLocalHistory(imageHistoryKey, () => {
      setData(readLocalHistory<ImageHistoryItem>(imageHistoryKey));
    });
  }, []);

  const start = (pageNum - 1) * pageSize;
  const rows = useMemo(() => data.slice(start, start + pageSize), [data, start, pageSize]);

  return {
    data: rows,
    total: data.length,
    isLoading: false,
  };
}

export function refreshImageHistory() {
  notifyLocalHistory(imageHistoryKey);
}

export function addPendingImageHistory(item: Omit<ImageHistoryItem, 'status'>) {
  const current = readLocalHistory<ImageHistoryItem>(imageHistoryKey);
  writeLocalHistory(imageHistoryKey, [
    { ...item, status: 'processing', taskId: item.id, thumbnailUrl: item.thumbnailUrl || '', url: item.url || '' },
    ...current,
  ]);
}

export function completeImageHistory(
  taskId: string,
  payload: {
    url?: string;
    thumbnailUrl?: string;
    resolution?: string;
    credit?: number;
  },
) {
  const current = readLocalHistory<ImageHistoryItem>(imageHistoryKey);
  writeLocalHistory(
    imageHistoryKey,
    current.map((item) =>
      item.id === taskId || item.taskId === taskId
        ? {
            ...item,
            status: 'completed',
            url: payload.url || item.url,
            thumbnailUrl: payload.thumbnailUrl || payload.url || item.thumbnailUrl,
            resolution: payload.resolution || item.resolution,
          }
        : item,
    ),
  );
}

export function failImageHistory(taskId: string, errorInfo?: string) {
  const current = readLocalHistory<ImageHistoryItem>(imageHistoryKey);
  writeLocalHistory(
    imageHistoryKey,
    current.map((item) =>
      item.id === taskId || item.taskId === taskId
        ? {
            ...item,
            status: 'fail',
            errorInfo,
          }
        : item,
    ),
  );
}

export function deleteImageHistoryItem(id: string) {
  const current = readLocalHistory<ImageHistoryItem>(imageHistoryKey);
  writeLocalHistory(
    imageHistoryKey,
    current.filter((item) => item.id !== id && item.taskId !== id),
  );
}
