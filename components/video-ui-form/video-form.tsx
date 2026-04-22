'use client';

/* eslint-disable @typescript-eslint/indent */
/* eslint-disable no-confusing-arrow */
/* eslint-disable react/jsx-wrap-multilines */
import { useCallback, useContext, useMemo, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useNavigationGuard } from 'next-navigation-guard';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { selectVideoModelByGenerationType, getVersionConfig } from '@/lib/constants/video/';
import { cn } from '@/lib/utils';
import { Form } from '@/components/ui/form';
import SubHeading from '@/components/form/SubHeading';

// 通用表单组件
import {
  PromptField,
  AudioSupportField,
  AudioToggleField,
  AudioUploadField,
  BottomActionArea,
  ModelSelect,
  MultiImageUploadField,
  StartEndFrameField,
} from '@/components/form-fields';
import type { MultiImageUploadFieldRef, ImageUploadFieldRef, AudioUploadFieldRef } from '@/components/form-fields';

// 本地 hooks 和 utils
import { useVideoFormStores } from './hooks/useVideoFormStores';
import useVideoFormSubmit from './hooks/useVideoFormSubmit';
import useModelToggle from './hooks/useModelToggle';
import useFormSync from './hooks/useFormSync';
import { useVideoModelConfig } from './hooks/useVideoModelConfig';
import { VideoModelService } from './utils/modelService';

import { videoAudioContext } from './VideoContenxtProvider';
import VideoContenxtProvider from './VideoContenxtProvider';
import VideoDisplay from './VideoDisplay';
import VideoHistorySection from './VideoHistorySection';
import type { VideoHistoryRequest } from '@/network/video/history';

// 本地类型
import type { VideoFormData } from './types';

// ============================================
// 配置常量
// ============================================

// 注意：模型选择逻辑已移至 ./utils/modelService.ts
// 这里不再重复定义，直接使用 VideoModelService

/**
 * VideoFormBase Props
 *
 * UI 显示控制：通过 show* props 明确控制每个字段的显示（对标 image-form）
 */
interface VideoFormBaseProps {
  submitBtnId: string;
  videoType: VideoHistoryRequest['videoType'];
  defaultValues?: Partial<VideoFormData>;
  formTitle?: string;
  uploadImageTitle?: string;
  slotNode?: React.ReactNode;
  requireImageUpload?: boolean; // 当前页面是否需要图片上传才能生成
  showAllVideoHistory?: boolean; // 历史记录是否显示所有类型（不过滤）

  // UI 显示控制
  showInput?: boolean;
  showVideoModelVersion?: boolean;
  showRatio?: boolean;
  showDuration?: boolean;
  showResolution?: boolean;
  showStartFrame?: boolean;
  showEndFrame?: boolean;
  showAudio?: boolean;
  showAudioUpload?: boolean;
  allowedProviders?: string[];

  // 默认值优先级（对标 image-form 的 defaultValuePriority）
  defaultValuePriority?: {
    ratio?: string[];
    duration?: string[];
    resolution?: string[];
  };
}

export default function VideoFormBase({
  submitBtnId,
  videoType,
  defaultValues,
  formTitle,
  uploadImageTitle,
  slotNode,
  requireImageUpload = false, // 默认不强制要求上传图片
  showAllVideoHistory = false, // 默认不显示所有历史

  // UI 显示控制 props
  showInput = true,
  showVideoModelVersion = true,
  showRatio = true,
  showDuration = true,
  showResolution = true,
  showStartFrame = true,
  showEndFrame = true,
  showAudio = true,
  showAudioUpload = true,

  // 默认值优先级 props
  defaultValuePriority,
  allowedProviders,
}: VideoFormBaseProps) {
  const t = useTranslations('components.video-form');
  const pathname = usePathname();
  const { audioDuration: _audioDuration } = useContext(videoAudioContext);
  void _audioDuration; // Reserved for future use

  // ============================================
  // 统一状态管理 (替换原来的 17 个 hooks)
  // ============================================
  const stores = useVideoFormStores();
  const {
    setOpenPricingDialogStore,
    resetDefault,
    defaultPrompt,
  } = stores;

  // ============================================
  // Refs
  // ============================================
  const startFrameUploadRef = useRef<ImageUploadFieldRef>(null);
  const multiImageUploadRef = useRef<MultiImageUploadFieldRef>(null);
  const audioUploadRef = useRef<AudioUploadFieldRef>(null);

  useNavigationGuard({
    enabled: true,
    confirm: () => {
      resetDefault();
      return true;
    },
  });

  // ============================================
  // 表单初始化
  // ============================================
  // 计算初始默认值（只在组件首次挂载时执行一次）
  const getInitialDefaultValues = (): Partial<VideoFormData> => {
    const initialModelVersion = defaultValues?.modelVersion || VideoModelService.getDefaultModel();

    // 获取初始模型配置，用于提取默认的 duration 和 resolution
    // 初始状态没有图片，所以使用 text-to-video 模式，默认关闭音频
    const versionConfig = getVersionConfig(initialModelVersion);
    const initialModel = selectVideoModelByGenerationType(versionConfig, false, undefined, undefined, false);

    // 提取初始的 duration 和 resolution 默认值
    const initialDuration = initialModel?.options?.duration ? `${initialModel.options.duration}s` : undefined;
    const initialResolution = initialModel?.options?.resolution;

    return {
      prompt: defaultPrompt,
      ratio: '16:9',
      modelVersion: initialModelVersion,
      enableEndFrame: false,
      enableAudio: false,
      duration: initialDuration,
      resolution: initialResolution,
      ...defaultValues,
    };
  };

  // 使用 useRef 保存初始默认值，确保在整个组件生命周期中不变
  const initialDefaultValuesRef = useRef<Partial<VideoFormData>>(getInitialDefaultValues());

  const form = useForm<VideoFormData>({
    progressive: true,
    defaultValues: initialDefaultValuesRef.current,
  });

  const modelVersion = form.watch('modelVersion');
  const selectedDuration = form.watch('duration');
  const selectedResolution = form.watch('resolution');
  const startFrame = form.watch('startFrame');
  const endFrame = form.watch('endFrame');
  const multiImages = form.watch('multiImages');
  const enableAudio = form.watch('enableAudio');

  // 判断用户是否上传了图片（用于自动判断生成类型）
  const hasImages = useMemo(() => {
    if (requireImageUpload) return true;
    const hasStartFrame = !!(startFrame && (startFrame instanceof File || typeof startFrame === 'string'));
    const hasEndFrame = !!(endFrame && (endFrame instanceof File || typeof endFrame === 'string'));
    const hasMultiImages = (multiImages?.length ?? 0) > 0;
    return hasStartFrame || hasEndFrame || hasMultiImages;
  }, [startFrame, endFrame, multiImages, requireImageUpload]);

  // ============================================
  // 业务逻辑：使用新的 useVideoModelConfig hook
  // ============================================
  const { versionConfig: currentVersionConfig, uiConfig, selectModel } = useVideoModelConfig({
    selectedModelVersion: modelVersion,
    hasImages,
  });

  // 从 uiConfig 获取选项 TODO：需对比方案实现，再决定去留
  const {
    durationOptions,
    resolutionOptions,
    ratioOptions,
    supportsImageInput,
    supportsEndFrame,
    supportsAudio,
    supportsAudioUrl,
    supportsOptionalAudio,
    multiImageMaxImages
  } = uiConfig;

  // 获取当前模型（用于显示 credit 等信息）
  const currentModel = useMemo(() => {
    return selectModel(hasImages, selectedDuration, selectedResolution, enableAudio) ?? undefined;
  }, [selectModel, hasImages, selectedDuration, selectedResolution, enableAudio]);

  // ============================================
  // 表单同步逻辑 (提取到 useFormSync hook)
  // ============================================
  useFormSync({
    form,
    currentModel,
    currentVersionConfig,
    durationOptions,
    ratioOptions,
    resolutionOptions,
    modelVersion,
    hasImages,
    defaultValues,
    defaultValuePriority,
  });

  // ============================================
  // 模型切换逻辑 (提取到 useModelToggle hook)
  // ============================================
  const { handleEndFrameToggle } = useModelToggle({
    form,
    t,
  });

  // ============================================
  // 表单提交逻辑 (提取到 useVideoFormSubmit hook)
  // ============================================
  const { handleSubmit: submitForm, isSubmitting } = useVideoFormSubmit({
    videoType,
    stores,
    pathname,
    t,
    submitBtnId,
  });

  const onSubmit = async (formData: VideoFormData) => {
    // 校验是否需要强制上传图片
    if (requireImageUpload) {
      const hasUploadedImage = !!(
        formData.startFrame &&
        (formData.startFrame instanceof File || typeof formData.startFrame === 'string')
      );
      
      if (!hasUploadedImage) {
        toast.error(t('error.image-required')); // 需要添加翻译
        return;
      }
    }

    // 判断提交时是否有图片（用于自动选择模型）
    const hasImagesAtSubmit = !!(
      formData.startFrame &&
      (formData.startFrame instanceof File || typeof formData.startFrame === 'string')
    );

    // 使用新的 selectModel 函数自动选择模型
    const formSubmitVideoModel = selectModel(hasImagesAtSubmit, formData.duration, formData.resolution, formData.enableAudio);

    if (!formSubmitVideoModel) {
      toast.error('Model not found');
      return;
    }

    // 调用提取的表单提交逻辑
    await submitForm(formData, formSubmitVideoModel);
  };


  return (
    <VideoContenxtProvider videoType={videoType} showAllVideoHistory={showAllVideoHistory}>
      <div id='video-form-container' className='relative flex h-auto w-full flex-col items-stretch gap-5 overflow-hidden rounded-[36px] bg-[#232528] lg:h-[calc(100vh-76px)] lg:flex-row lg:p-5'>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            id='VideoForm'
            className='no-scrollbar relative isolate z-40 flex h-[600px] w-full shrink-0 flex-col gap-2.5 overflow-y-auto rounded-3xl border border-[#303030] bg-[#1c1d20] p-3 lg:h-full lg:w-[351px]'
          >
          {formTitle && (
            <div className='line-clamp-1 shrink-0 border-b border-white/10 bg-[#1c1d20] pb-2.5 text-lg font-medium tracking-[0.36px] text-white'>
              {formTitle}
            </div>
          )}
          <div className='flex flex-1 flex-col gap-2.5 overflow-y-auto pb-20 lg:items-stretch custom-scrollbar'>
            
            {/* 模型版本选择 */}
            {showVideoModelVersion && (
              <>
                <SubHeading>{t('modelVersion')}</SubHeading>
                <ModelSelect name='modelVersion' hasImages={hasImages} allowedProviders={allowedProviders} />
              </>
            )}

            {/* 音频支持提示（纯展示，用于不可控音频的模型，如 Veo） */}
            <AudioSupportField show={showAudio && supportsAudio && !supportsOptionalAudio} />

            {/* 音频选项：是否开启生成的音频（如 Seedance 1.5、Kling 等支持可选音频的模型） */}
            <AudioToggleField show={showAudio && supportsOptionalAudio} />

            {/* 音频上传字段（根据模型的 audioUrl 配置决定是否显示） */}
            <AudioUploadField show={showAudioUpload && supportsAudioUrl} ref={audioUploadRef} />

            {/* 多图上传区域 */}
            {multiImageMaxImages > 0 && (
              <MultiImageUploadField
                name='multiImages'
                maxImages={multiImageMaxImages}
                ref={multiImageUploadRef}
              />
            )}

            {/* 起始/结束帧合并区域，右侧开关控制是否启用尾帧 */}
            <StartEndFrameField
              currentModel={currentModel} // TODO: product 页面需单独处理首尾帧的识别与传入，使用单独的产品上传组件
              showStartFrame={showStartFrame}
              showEndFrame={showEndFrame}
              onEndFrameToggle={handleEndFrameToggle}
              ref={startFrameUploadRef}
              uploadImageTitle={uploadImageTitle}
              supportsImageInput={supportsImageInput}
              supportsEndFrameFromConfig={supportsEndFrame}
            />

            {/* 自定义插槽节点 */}
            {slotNode}

            {/* Prompt 输入 */}
            <PromptField show={showInput} />

          </div>

          {/* 底部操作区域 */}
          <BottomActionArea
            durationOptions={durationOptions}
            ratioOptions={ratioOptions}
            resolutionOptions={resolutionOptions}
            showDuration={showDuration}
            showRatio={showRatio}
            showResolution={showResolution}
            isSubmitting={isSubmitting}
            creditCost={currentModel?.credit || 0}
            submitButtonText={t('generate')}
          />
        </form>
      </Form>

      {/* Right side content: Display + History */}
      <div className='flex flex-1 flex-col items-start justify-start gap-3'>
        <div className='h-[360px] w-full rounded-2xl border border-[#2a2b2f] bg-[#1c1d20] contain-strict lg:h-auto lg:flex-1'>
          <VideoDisplay />
        </div>

        <div className='flex w-full flex-col gap-3 contain-inline-size'>
          <VideoHistorySection />
        </div>
      </div>
    </div>
  </VideoContenxtProvider>
  );
}
