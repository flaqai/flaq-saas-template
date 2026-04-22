import { useEffect, useMemo, useState } from 'react';

import { notifyLocalHistory, readLocalHistory, subscribeLocalHistory, writeLocalHistory } from '../local-history';

export type VideoHistoryRequest = {
  pageNum: number;
  pageSize: number;
  videoType?: 'Image-to-video' | 'Text-to-video';
};

export type VideoHistoryItem = {
  status: 'pending' | 'processing' | 'completed' | 'fail';
  platformName: string;
  coverImage?: string;
  isAllowExtend?: boolean;
  categoryName: string;
  createTime: number;
  duration: number;
  errorInfo: string;
  id: string;
  imageEndUrl: string;
  imageUrl: string;
  prompt: string;
  traceId: string;
  videoId: string;
  videoThumbnailUrl: string;
  videoUrl: string;
  videoType: VideoHistoryRequest['videoType'];
  ratio?: string;
};

export const pageSize = 8;
export const videoHistoryKey = 'flaq_video_history';

export default function useVideoHistory(reqData: VideoHistoryRequest) {
  const [data, setData] = useState<VideoHistoryItem[]>([]);

  useEffect(() => {
    setData(readLocalHistory<VideoHistoryItem>(videoHistoryKey));

    return subscribeLocalHistory(videoHistoryKey, () => {
      setData(readLocalHistory<VideoHistoryItem>(videoHistoryKey));
    });
  }, []);

  const filtered = useMemo(
    () => (reqData.videoType ? data.filter((item) => item.videoType === reqData.videoType) : data),
    [data, reqData.videoType],
  );
  const start = (reqData.pageNum - 1) * reqData.pageSize;
  const rows = useMemo(
    () => filtered.slice(start, start + reqData.pageSize),
    [filtered, start, reqData.pageSize],
  );

  return { data: rows, total: filtered.length, isLoading: false };
}

export function refreshVideoHistory() {
  notifyLocalHistory(videoHistoryKey);
}

export function addPendingVideoHistory(item: Omit<VideoHistoryItem, 'status'>) {
  const current = readLocalHistory<VideoHistoryItem>(videoHistoryKey);
  writeLocalHistory(videoHistoryKey, [{ ...item, status: 'processing' }, ...current]);
}

export function completeVideoHistory(
  taskId: string,
  payload: {
    videoUrl?: string;
    videoThumbnailUrl?: string;
    duration?: number;
    ratio?: string;
  },
) {
  const current = readLocalHistory<VideoHistoryItem>(videoHistoryKey);
  writeLocalHistory(
    videoHistoryKey,
    current.map((item) =>
      item.id === taskId || item.traceId === taskId
        ? {
            ...item,
            status: 'completed',
            videoUrl: payload.videoUrl || item.videoUrl,
            videoThumbnailUrl: payload.videoThumbnailUrl || item.videoThumbnailUrl,
            coverImage: payload.videoThumbnailUrl || item.coverImage,
            duration: payload.duration ?? item.duration,
            ratio: payload.ratio || item.ratio,
          }
        : item,
    ),
  );
}

export function failVideoHistory(taskId: string, errorInfo?: string) {
  const current = readLocalHistory<VideoHistoryItem>(videoHistoryKey);
  writeLocalHistory(
    videoHistoryKey,
    current.map((item) =>
      item.id === taskId || item.traceId === taskId
        ? {
            ...item,
            status: 'fail',
            errorInfo: errorInfo || item.errorInfo,
          }
        : item,
    ),
  );
}

export function deleteVideoHistoryItem(id: string) {
  const current = readLocalHistory<VideoHistoryItem>(videoHistoryKey);
  writeLocalHistory(
    videoHistoryKey,
    current.filter((item) => item.id !== id && item.traceId !== id),
  );
}
