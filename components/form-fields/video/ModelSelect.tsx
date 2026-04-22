'use client';

import { useMemo, useEffect, useRef } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { getModelIcon } from '@/lib/utils/modelIcons';

import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import {
  getFilteredVisibleProviders,
  getVideoProviderByModelVersion,
  versionSupportsImageToVideo,
} from '@/lib/constants/video/';
import type { ModelVersionConfig } from '@/lib/constants/video/types';
import useUserInfoStore from '@/store/useUserInfoStore';
import { getUserAllowedStatus } from '@/lib/access-control';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../video-ui-form/ModelSelectContainer';
import ModelSelectItem from '../../video-ui-form/ModelSelectItem';

interface ModelSelectProps {
  name: string;
  hasImages?: boolean;
  allowedProviders?: string[];
}

export default function ModelSelect({ name, hasImages = false, allowedProviders }: ModelSelectProps) {
  const { control, watch, setValue } = useFormContext();
  const selectedModelVersion = watch(name);
  const t = useTranslations('VideoModels');
  const userInfo = useUserInfoStore((state) => state.userInfo);

  // 记录上一次的 hasImages 状态，用于检测变化
  const prevHasImages = useRef<boolean>(hasImages);

  // 根据 hasImages 动态过滤模型版本列表
  // 使用 getFilteredVisibleProviders（排除特殊用途模型，按渠道控制 WAN）
  // 有图片时，只显示支持 image-to-video 的版本
  const modelVersions = useMemo(() => {
    const isAllowed = getUserAllowedStatus(userInfo);
    const visibleProviders = getFilteredVisibleProviders(isAllowed);
    const providers = allowedProviders
      ? visibleProviders.filter((p) => allowedProviders.includes(p.provider))
      : visibleProviders;
    const allVisibleVersions = providers.flatMap((p) => p.versions);

    if (hasImages) {
      return allVisibleVersions.filter((v) => versionSupportsImageToVideo(v));
    }

    return allVisibleVersions;
  }, [hasImages, allowedProviders, userInfo]);

  // 对模型版本列表进行排序：
  // 1. 将当前选中模型的品牌的所有版本放在前面
  // 2. 在该品牌内，将选中的版本置顶
  const sortedVersions = useMemo(() => {
    if (!selectedModelVersion || !modelVersions.length) return modelVersions;

    // 找到选中的版本
    const selectedVersion = modelVersions.find((v) => v.modelVersion === selectedModelVersion);
    if (!selectedVersion) return modelVersions;

    const selectedProvider = selectedVersion.provider;

    // 按品牌分组
    const sameProviderVersions = modelVersions.filter(
      (v) => v.provider === selectedProvider && v.modelVersion !== selectedModelVersion,
    );
    const otherProviderVersions = modelVersions.filter((v) => v.provider !== selectedProvider);

    // 返回：选中的版本 + 同品牌其他版本 + 其他品牌版本
    return [selectedVersion, ...sameProviderVersions, ...otherProviderVersions];
  }, [modelVersions, selectedModelVersion]);

  // 格式化范围显示（将数组转换为 min-max 格式）
  const formatRangeLabel = (values: string[], unit: string) => {
    if (values.length === 0) return '';
    if (values.length === 1) return values[0];

    // 提取数值部分并排序
    const numbers = values
      .map((v) => parseInt(v.replace(/\D/g, ''), 10))
      .filter((n) => !Number.isNaN(n))
      .sort((a, b) => a - b);

    if (numbers.length === 0) return values.join(', ');
    if (numbers.length === 1) return `${numbers[0]}${unit}`;

    const min = numbers[0];
    const max = numbers[numbers.length - 1];
    return `${min}-${max}${unit}`;
  };

  // 为每个模型版本生成特性列表
  const getVersionFeatures = (version: ModelVersionConfig) => {
    const features = [];

    // 添加时长信息（从 options.duration 数组）
    if (version.options.duration && version.options.duration.length > 0) {
      const durationLabel = formatRangeLabel(version.options.duration, 's');
      features.push({ icon: 'duration' as const, label: durationLabel });
    }

    // 添加分辨率信息（从 options.resolution 数组）
    if (version.options.resolution && version.options.resolution.length > 0) {
      const resolutionLabel = formatRangeLabel(version.options.resolution, 'p');
      features.push({ icon: 'resolution' as const, label: resolutionLabel });
    }

    // 添加音频信息
    if (version.options?.audio) {
      features.push({ icon: 'audio' as const, label: 'Audio' });
    }

    // 添加结束帧信息
    if (version.options?.endFrame?.isSupported) {
      features.push({ icon: 'endFrame' as const, label: 'End frame' });
    }

    return features;
  };

  // 获取模型版本的显示名称
  const getVersionDisplayName = (version: ModelVersionConfig) => {
    // 直接使用 ModelVersionConfig 中的 name 字段
    return version.name;
  };

  // 当 hasImages 改变时，检查当前模型是否仍然可用
  // 如果用户上传了图片但当前模型不支持 image-to-video，则自动切换
  useEffect(() => {
    if (!sortedVersions.length) return;

    // 只在 hasImages 真正改变时才执行逻辑
    if (prevHasImages.current === hasImages) {
      return;
    }

    // 更新上一次的 hasImages 状态
    prevHasImages.current = hasImages;

    // 检查当前选择是否在新列表中
    const isCurrentInList = sortedVersions.some((v) => v.modelVersion === selectedModelVersion);
    if (isCurrentInList) {
      // 当前选择在列表中，无需切换
      return;
    }

    // 当前选择不在列表中，需要切换到支持的版本（同品牌优先）
    const currentProvider = getVideoProviderByModelVersion(selectedModelVersion);

    // 优先选择同品牌的模型
    let newModelVersion = sortedVersions[0]?.modelVersion;

    if (currentProvider && newModelVersion) {
      const sameBrandVersion = sortedVersions.find((v) => v.provider === currentProvider);
      if (sameBrandVersion) {
        newModelVersion = sameBrandVersion.modelVersion;
      }
    }

    if (newModelVersion) {
      setValue(name, newModelVersion);
    }
  }, [hasImages, sortedVersions, selectedModelVersion, setValue, name]);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className='space-y-0'>
          <Select onValueChange={field.onChange} value={field.value ?? ''} name={name}>
            <FormControl>
              {/* 模型版本列表，选择器触发按钮 */}
              <SelectTrigger className='w-full border border-[#303030] rounded-xl text-sm bg-[#1f1f1f] text-white'>
                <div className='flex items-center gap-2'>
                  {selectedModelVersion && getModelIcon(selectedModelVersion) ? (
                    <img
                      src={getModelIcon(selectedModelVersion)}
                      alt={selectedModelVersion}
                      className='size-4 text-purple-600'
                    />
                  ) : (
                    <div className='size-4' />
                  )}
                  <SelectValue placeholder='Select model version'>
                    {selectedModelVersion
                      ? (() => {
                          const version = sortedVersions.find((v) => v.modelVersion === selectedModelVersion);
                          return version ? getVersionDisplayName(version) : 'Select model version';
                        })()
                      : 'Select model version'}
                  </SelectValue>
                </div>
              </SelectTrigger>
            </FormControl>
            <SelectContent className='border border-[#303030] bg-[#1f1f1f] rounded-xl'>
              {sortedVersions.map((version) => {
                const isDisabled = version.isComingSoon || false;
                const showComingSoon = version.isComingSoon || false;

                return (
                  <SelectItem
                    key={version.modelVersion}
                    value={version.modelVersion}
                    disabled={isDisabled}
                    className={cn(
                      'p-0 w-full cursor-pointer rounded-none text-white hover:bg-white/10 focus:bg-white/10 [&>span:first-child]:hidden [&>span:last-child]:w-full',
                      isDisabled && 'opacity-50 cursor-not-allowed hover:bg-transparent',
                    )}
                  >
                    <ModelSelectItem
                      value={version.modelVersion}
                      label={getVersionDisplayName(version)}
                      description={t(version.modelVersion as any) || ''}
                      features={getVersionFeatures(version)}
                      isSelected={selectedModelVersion === version.modelVersion}
                      isDisabled={isDisabled}
                      showComingSoon={showComingSoon}
                      onClick={() => !isDisabled && field.onChange(version.modelVersion)}
                    />
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
