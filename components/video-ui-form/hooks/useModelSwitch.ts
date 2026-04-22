import { useEffect, useRef, useState, useCallback } from 'react';
import type { UseFormReturn } from 'react-hook-form';

/**
 * 模型切换处理 Hook（Video 版本）
 *
 * 职责：
 * 1. 检测模型版本切换
 * 2. 返回是否需要重置字段的标记
 *
 * 设计说明：
 * - 不再直接调用回调，而是返回 needsReset 标记
 * - 由外层根据 options 变化后再执行重置
 * - 解决闭包捕获旧值的时序问题
 */
export function useModelSwitch(params: {
  selectedModelVersion?: string;
  onModelSwitch?: (from: string | null, to: string) => void;
}): { needsReset: boolean; clearResetFlag: () => void } {
  const { selectedModelVersion, onModelSwitch } = params;
  const prevModelVersionRef = useRef<string | null>(null);
  const [needsReset, setNeedsReset] = useState(false);

  useEffect(() => {
    if (!selectedModelVersion) return;

    // 检测是否为模型版本切换
    // 初次加载时 prevModelVersionRef.current 为 null，不触发
    const isModelSwitch = prevModelVersionRef.current !== null && prevModelVersionRef.current !== selectedModelVersion;

    if (isModelSwitch) {
      // 设置需要重置的标记，而不是直接调用回调
      setNeedsReset(true);

      // 可选：仍然调用回调用于日志或其他用途
      onModelSwitch?.(prevModelVersionRef.current, selectedModelVersion);
    }

    // 更新 ref（记录当前模型版本）
    prevModelVersionRef.current = selectedModelVersion;
  }, [selectedModelVersion, onModelSwitch]);

  const clearResetFlag = useCallback(() => {
    setNeedsReset(false);
  }, []);

  return { needsReset, clearResetFlag };
}

/**
 * 字段重置处理 Hook（Video 版本）
 *
 * 职责：
 * 1. 监听 needsReset 标记
 * 2. 当 needsReset 为 true 且配置就绪时，重置字段为默认值
 *
 * 设计说明：
 * - 直接接收 ratioOptions/durationOptions/resolutionOptions 作为依赖
 * - 确保在新配置计算完成后再执行重置
 * - 解决闭包捕获旧值的问题
 */
export function useFieldReset(params: {
  form: UseFormReturn<any>;
  needsReset: boolean;
  clearResetFlag: () => void;
  ratioOptions: Array<{ value: string; name: string }>;
  durationOptions: Array<{ value: string; name: string }>;
  resolutionOptions: Array<{ value: string; name: string }>;
  hasImages: boolean;
  priorityRules?: {
    ratio?: string[];
    duration?: string[];
    resolution?: string[];
  };
}) {
  const { form, needsReset, clearResetFlag, ratioOptions, durationOptions, resolutionOptions, hasImages, priorityRules } =
    params;

  // 监听 needsReset 和配置变化，在配置就绪后执行重置
  useEffect(() => {
    if (!needsReset) return;

    // 选择最佳选项的辅助函数
    const selectBestOption = (
      availableOptions: Array<{ value: string; name: string }>,
      priorities?: string[],
    ): string | undefined => {
      if (!availableOptions || availableOptions.length === 0) {
        return undefined;
      }

      // 按优先级列表查找第一个可用值
      if (priorities && priorities.length > 0) {
        for (const priority of priorities) {
          const found = availableOptions.find((opt) => opt.value === priority);
          if (found) {
            return found.value;
          }
        }
      }

      // 都没找到，返回第一个选项
      return availableOptions[0]?.value;
    };

    // 图生视频时，ratio 由图片决定，清空
    const newRatio = hasImages ? '' : selectBestOption(ratioOptions, priorityRules?.ratio || ['16:9', '9:16', '1:1']);

    const newDuration = selectBestOption(durationOptions, priorityRules?.duration || ['5s', '10s']);

    const newResolution = selectBestOption(resolutionOptions, priorityRules?.resolution || ['1080p', '720p', '4k']);

    if (newRatio !== undefined) {
      form.setValue('ratio', newRatio);
    }

    if (newDuration) {
      form.setValue('duration', newDuration);
    } else if (durationOptions.length === 0) {
      // 当模型没有 duration 配置时，清空字段
      form.setValue('duration', '');
    }

    if (newResolution) {
      form.setValue('resolution', newResolution);
    } else if (resolutionOptions.length === 0) {
      // 当模型没有 resolution 配置时，清空字段
      form.setValue('resolution', '');
    }

    // 清除重置标记
    clearResetFlag();
  }, [needsReset, ratioOptions, durationOptions, resolutionOptions, hasImages, priorityRules, form, clearResetFlag]);
}
