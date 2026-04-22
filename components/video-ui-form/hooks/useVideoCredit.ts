import { useMemo } from 'react';
import { useFormContext } from 'react-hook-form';

import { calculateVideoCredit } from '@/lib/utils/videoModelService';
import type { VideoModel } from '@/lib/constants/video/types';

/**
 * 自动计算视频生成所需 credit 的 Hook
 * 支持动态 credit 计算（根据 duration、resolution、ratio 等参数）
 */
export function useVideoCredit(model: VideoModel) {
  const form = useFormContext();
  const duration = form.watch('duration');
  const resolution = form.watch('resolution');
  const credit = useMemo(() => {
    return calculateVideoCredit(model, {
      duration,
      resolution,
    });
  }, [model, duration, resolution]);

  return credit;
}
