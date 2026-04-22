import { useMemo } from 'react';
import { useFormContext } from 'react-hook-form';

import { calculateImageCredit } from '@/lib/utils/imageModelService';
import type { ImageModel } from '@/lib/constants/image/types';

/**
 * 自动计算图片生成所需 credit 的 Hook
 * 支持动态 credit 计算（根据 resolution、ratio 等参数）
 */
export function useImageCredit(model: ImageModel) {
  const form = useFormContext();
  const resolution = form.watch('resolution');
  const ratio = form.watch('aspectRatio');

  const credit = useMemo(() => {
    return calculateImageCredit(model, {
      resolution,
      ratio,
    });
  }, [model, resolution, ratio]);

  return credit;
}
