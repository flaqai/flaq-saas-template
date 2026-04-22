import { useCallback } from 'react';

/**
 * 字段默认值计算 Hook（Video 版本）
 *
 * 职责：
 * 1. 根据可用选项和优先级列表，选择最佳默认值
 * 2. 纯函数，无副作用
 */
export function useFieldDefaults() {
  /**
   * 选择最佳选项
   *
   * 逻辑：按优先级列表查找第一个可用的选项
   * 如果优先级列表中没有可用选项，返回第一个可用选项
   */
  const selectBestOption = useCallback(
    (availableOptions: Array<{ value: string; name: string }>, priorityList?: string[]): string | undefined => {
      if (!availableOptions || availableOptions.length === 0) {
        return undefined;
      }

      // 按优先级列表查找第一个可用值
      if (priorityList && priorityList.length > 0) {
        for (const priority of priorityList) {
          const found = availableOptions.find((opt) => opt.value === priority);
          if (found) {
            return found.value;
          }
        }
      }

      // 都没找到，返回第一个选项
      return availableOptions[0]?.value;
    },
    [],
  );

  /**
   * 计算字段默认值
   */
  const calculateDefaults = useCallback(
    (params: {
      ratioOptions: Array<{ value: string; name: string }>;
      durationOptions: Array<{ value: string; name: string }>;
      resolutionOptions: Array<{ value: string; name: string }>;
      priorityRules?: {
        ratio?: string[];
        duration?: string[];
        resolution?: string[];
      };
    }) => {
      const { ratioOptions, durationOptions, resolutionOptions, priorityRules } = params;

      const ratio = selectBestOption(ratioOptions, priorityRules?.ratio || ['16:9', '9:16', '1:1']);

      const duration = selectBestOption(durationOptions, priorityRules?.duration || ['5s', '6s', '10s']);

      const resolution = selectBestOption(resolutionOptions, priorityRules?.resolution || ['720p', '1080p']);

      return {
        ratio: ratio || '',
        duration: duration || '',
        resolution: resolution || '',
      };
    },
    [selectBestOption],
  );

  return {
    selectBestOption,
    calculateDefaults,
  };
}
