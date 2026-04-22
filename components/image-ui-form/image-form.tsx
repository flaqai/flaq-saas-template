'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { cn } from '@/lib/utils';
import useImageFormStore from '@/store/form/useImageFormStore';
import useImageFormDefaultStore from '@/store/form/useImageFormDefaultStore';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { ALL_IMAGE_PROVIDERS } from '@/lib/constants/image';
import { supportsGenerationType } from '@/lib/utils/imageModelService';

import { Form } from '@/components/ui/form';

// 通用表单组件
import {
  PromptField,
  ModelVersionField,
  MotionField,
  RadioButtonGroup,
  UnifiedImageUploadField,
  TemplateSelector,
} from '@/components/form-fields';
import type { UnifiedImageUploadFieldRef } from '@/components/form-fields';
import BottomActionArea from '@/components/form-fields/action/BottomActionArea';

import ImageContenxtProvider from './image-context-provider';
import ImageDisplay from './ImageDisplay';
import ImageHistorySection from './ImageHistorySection';

import { validateImageFile } from './utils/submitUtils';
import { convertModelsToVersionConfigs } from './utils/modelConversion';
import type { ImageFormData, ImageFormProps } from './types';
import { useModelConfig, useModelSwitch, useFieldReset } from './hooks';
import { useImageFormSubmit } from './hooks/useImageFormSubmit';

// 重新导出类型，保持向后兼容
export type { ImageFormData, ImageFormProps } from './types';

// ============================================
// 主组件
// ============================================

export default function ImageForm({
  // Schema & defaults
  imageFormType,
  defaultValues = {},
  moreFormSchema,
  defaultValuePriority,
  customModelList,
  customVersionList,
  formTitle,
  promptTitle,
  uploadImagesTitle,
  submitBtnId,
  onResetAll,
  formatPrompt,

  // Display control
  showPromptInput = true,
  showRatio = true,
  showModelVersion = true,
  modelVersionDisplayMode = 'model',

  // Template Selector
  showTemplateSelector = false,
  translationNamespace = 'components.image-form',
  imageTemplateList = [],

  // Image upload
  imageUploadMode = 'auto',
  requireImageUpload = false,

  showMotionField = false,
  motionFieldOptions = [],
  motionFieldLabel,
  currentMotionId,
  onMotionChange,

  // RadioButtonGroup
  showRadioButtonGroup = false,
  radioButtonGroupOptions = [],
  radioButtonGroupFieldName = 'selectedOption',
  radioButtonGroupLabel = 'RadioButtonGroup',
  radioButtonGroupTranslationNamespace = 'components.image-form',
  onRadioButtonGroupChange = () => {},

  // Custom nodes
  slotNode,
  slotNodeAfter,
  slotNodeFunc,
  slotNodeAfterModel,
  slotNodeFuncAfterInput,
  customRightContent,
  imageObjContext = 'default',

  className,
}: ImageFormProps) {
  const t = useTranslations('components.image-form');

  const multiImageUploadFormRef = useRef<UnifiedImageUploadFieldRef>(null);

  // ============================================
  // Store states
  // ============================================
  // 根据 imageObjContext 选择对应的 imageObj 和 updateImageObj
  const imageObj = useImageFormStore((state) => {
    if (imageObjContext === 'start-frame') return state.startFrameImageObj;
    if (imageObjContext === 'end-frame') return state.endFrameImageObj;
    return state.imageObj;
  });

  const updateImageObj = useImageFormStore((state) => {
    if (imageObjContext === 'start-frame') return state.updateStartFrameImageObj;
    if (imageObjContext === 'end-frame') return state.updateEndFrameImageObj;
    return state.updateImageObj;
  });

  const isPolling = useImageFormStore((state) => {
    if (imageObjContext === 'start-frame') return state.isStartFramePolling;
    if (imageObjContext === 'end-frame') return state.isEndFramePolling;
    return state.isPolling;
  });

  const setIsPolling = useImageFormStore((state) => {
    if (imageObjContext === 'start-frame') return state.setIsStartFramePolling;
    if (imageObjContext === 'end-frame') return state.setIsEndFramePolling;
    return state.setIsPolling;
  });

  const defaultPrompt = useImageFormDefaultStore((state) => state.prompt);
  const resetImageFormDefault = useImageFormDefaultStore((state) => state.resetDefault);

  // ============================================
  // 表单初始化
  // ============================================
  const form = useForm<ImageFormData>({
    defaultValues: {
      prompt: '',
      images: [],
      modelVersion: '',
      aspectRatio: '',
      resolution: '',
      ...defaultValues, // 优先使用页面传入的默认值
    },
  });

  // 监听 store 中的 prompt 并填充到表单
  useEffect(() => {
    if (defaultPrompt) {
      form.setValue('prompt', defaultPrompt);
      resetImageFormDefault();
    }
  }, [defaultPrompt, form, resetImageFormDefault]);

  // ============================================
  // 业务逻辑：模型选择
  // ============================================
  const selectedModelVersion = form.watch('modelVersion');
  const imagesValue = form.watch('images');
  const subjectImageValue = form.watch('subjectImage');
  const objectImageValue = form.watch('objectImage');
  const objectImagesValue = form.watch('objectImages');

  // 判断是否有图片：检查 images 数组或 subject/object 图片
  // 注意：只有用户真正上传/选择图片时，这些字段才会有值（File 或 string URL）
  const hasImages = (imagesValue?.length > 0) ||
                    !!(subjectImageValue && (subjectImageValue instanceof File || typeof subjectImageValue === 'string')) ||
                    !!(objectImageValue && (objectImageValue instanceof File || typeof objectImageValue === 'string')) ||
                    !!(objectImagesValue && objectImagesValue.length > 0);

  // 使用 useModelConfig Hook 解析模型配置
  const { versionConfig, uiConfig, selectModel } = useModelConfig({
    selectedModelVersion,
    customVersionList,
  });

  // 别名：保持向后兼容
  const selectedVersionConfig = versionConfig;
  const ratioOptions = uiConfig.ratioOptions;
  const resolutionOptions = uiConfig.resolutionOptions;
  const supportsImageInput = uiConfig.supportsImageInput;
  const maxImagesSupported = uiConfig.maxImages;

  // ============================================
  // 图片上传配置
  // ============================================
  const shouldShowUpload = imageUploadMode !== 'none' && (
    imageUploadMode === 'single' || supportsImageInput
  );

  const actualMaxImages = imageUploadMode === 'single'
    ? 1
    : (supportsImageInput ? maxImagesSupported : 1);

  // UI 显示用的选项（转换格式）
  const ratioOptionsForUI = useMemo(() =>
    ratioOptions.map(item => ({
      name: item.name,
      value: item.value,
    })),
    [ratioOptions]
  );

  const resolutionOptionsForUI = useMemo(() =>
    resolutionOptions.map(res => ({
      name: res.name,
      value: res.value,
    })),
    [resolutionOptions]
  );

  // 用于 UI 显示的模型（credit 计算等）
  const modelForDisplay = useMemo(() =>
    selectModel(hasImages),
    [selectModel, hasImages]
  );
  void modelForDisplay;

  // 使用模型切换检测 Hook（返回 needsReset 标记）
  const { needsReset, clearResetFlag } = useModelSwitch({
    selectedModelVersion,
  });

  // 使用字段重置 Hook（监听 needsReset 和配置变化）
  useFieldReset({
    form,
    needsReset,
    clearResetFlag,
    ratioOptions,
    resolutionOptions,
    priorityRules: defaultValuePriority,
  });

  // 包装 selectModel 以匹配 hook 的类型要求（null -> undefined）
  const selectModelWrapper = useCallback((hasImages: boolean) => {
    const model = selectModel(hasImages);
    return model === null ? undefined : model;
  }, [selectModel]);

  // 使用表单提交 Hook
  const { handleSubmit: handleFormSubmit, isSubmitting } = useImageFormSubmit({
    imageFormType,
    selectModel: selectModelWrapper,
    showPromptInput,
    requireImageUpload,
    formatPrompt,
    submitBtnId: submitBtnId || 'image-form-submit-btn',
    t,
  });

  // ============================================
  // 事件处理
  // ============================================
  const resetAll = useCallback(() => {
    form.reset();
    multiImageUploadFormRef.current?.removeAllImages();
    onResetAll?.();
  }, [form, onResetAll]);

  const validateFileBeforeAdd = async (file: File): Promise<boolean> => {
    return validateImageFile({
      file,
      errorMessages: {
        aspectRatioOutOfRange: t('errors.aspectRatioOutOfRange'),
        imageLoadFailed: t('errors.imageLoadFailed'),
      },
      onError: toast.error,
    });
  };

  // ============================================
  // 表单提交
  // ============================================
  const onSubmit = async (formData: ImageFormData, event?: React.BaseSyntheticEvent) => {
    // 检查是否正在提交或轮询中
    if (isSubmitting || isPolling) return;

    // 调用 hook 的提交逻辑
    await handleFormSubmit(formData, event);
  };

  // ============================================
  // 渲染
  // ============================================
  return (
    <ImageContenxtProvider imageFormType={imageFormType}>
      <div
        className={cn(
          'flex h-auto w-full flex-col gap-5 rounded-xl bg-[#232528] px-2 py-5',
          'lg:flex-row lg:h-[calc(100vh-76px)] lg:rounded-[36px] lg:p-5',
          className
        )}
      >
        <Form {...form}>
          <form
            onSubmit={(e) => {
              e.stopPropagation(); // 阻止 React Portal 事件冒泡到父级表单
              form.handleSubmit(onSubmit)(e);
            }}
            className='no-scrollbar relative isolate z-40 flex h-auto w-full shrink-0 flex-col gap-3 rounded-3xl bg-[#1c1d20] p-3.5 lg:h-full lg:w-[351px]'
          >
            {formTitle && (
              <div className='line-clamp-1 shrink-0 border-b border-[#303030] bg-[#1c1d20] pb-2.5 text-lg font-medium tracking-[0.36px] text-white'>
                {formTitle}
              </div>
            )}

            <div className='flex flex-1 flex-col gap-3 overflow-y-auto pb-20 custom-scrollbar'>

            {/* Custom slot before default fields */}
            {slotNode}
            {slotNodeFunc?.(form)}

            {/* Motion Field */}
            {showMotionField && (
              <MotionField 
                options={motionFieldOptions} 
                show={showMotionField}
                label={motionFieldLabel}
                currentMotionId={currentMotionId}
                onMotionChange={onMotionChange}
              />
            )}

            {/* Model Selection */}
            {showModelVersion && (
              <>
                <ModelVersionField
                  title={t('selectModel')}
                  name='modelVersion'
                  displayMode={modelVersionDisplayMode}
                  versions={
                    customVersionList ||
                    (customModelList && convertModelsToVersionConfigs(customModelList)) ||
                    ALL_IMAGE_PROVIDERS
                      .flatMap(p => p.versions)
                      .filter(v => {
                        if (imageFormType === 'text-to-image') {
                          return v.models.every(m => !(
                            supportsGenerationType(m, 'image-edit') ||
                            supportsGenerationType(m, 'multi-image-to-image')
                          ));
                        }

                        if (imageFormType === 'image-to-image' || imageFormType === 'virtual-try-on') {
                          return v.models.some(m =>
                            supportsGenerationType(m, 'image-edit') ||
                            supportsGenerationType(m, 'multi-image-to-image')
                          );
                        }

                        return !hasImages || v.models.some(m =>
                          supportsGenerationType(m, 'image-edit') ||
                          supportsGenerationType(m, 'multi-image-to-image')
                        );
                      })
                  }
                />
              </>
            )}

            {/* Custom slot after model selection */}
            {slotNodeAfterModel}

            {/* Unified Image Upload - 根据 maxImages 配置自动适配单图或多图模式 */}
            {shouldShowUpload && (
              <UnifiedImageUploadField
                title={actualMaxImages > 1 ? uploadImagesTitle : undefined}
                name='images'
                maxImages={actualMaxImages}
                ref={multiImageUploadFormRef}
                acceptTypes={
                  selectedModelVersion?.includes('seedream')
                    ? ['image/jpg', 'image/jpeg', 'image/png', 'image/webp']
                    : ['image/jpg', 'image/jpeg', 'image/png', 'image/webp']
                }
                validateFileBeforeAdd={validateFileBeforeAdd}
              />
            )}

            {/* RadioButtonGroup */}
            {showRadioButtonGroup && (
              <RadioButtonGroup
                options={radioButtonGroupOptions || []}
                fieldName={radioButtonGroupFieldName}
                label={radioButtonGroupLabel}
                translationNamespace={radioButtonGroupTranslationNamespace}
                onChange={onRadioButtonGroupChange}
              />
            )}

            {/* Template Selector */}
            {showTemplateSelector && (
              <TemplateSelector 
                templates={imageTemplateList || []}
                translationNamespace={translationNamespace}
                templateFieldName='template' // TODO: 考虑合并几个属性，统一对象传入
                promptFieldName='prompt' // TODO: 考虑合并几个属性，统一对象传入
              />
            )}

            {/* Prompt Input */}
            {showPromptInput && (
              <PromptField show title={promptTitle || t('enterPrompt')} translationNamespace='components.image-form' />
            )}

            {/* Custom slot after input fields */}
            {slotNodeFuncAfterInput?.(form)}

            {/* Custom slot after all fields */}
            {slotNodeAfter}

            </div>

            {/* Bottom Actions */}
            <BottomActionArea
              ratioOptions={showRatio && ratioOptions.length > 0 ? ratioOptionsForUI : undefined}
              resolutionOptions={resolutionOptions.length > 0 ? resolutionOptionsForUI : undefined}
              showRatio={showRatio && ratioOptions.length > 0}
              showResolution={resolutionOptions.length > 0}
              showDuration={false}
              isSubmitting={isPolling || isSubmitting}
              submitButtonText={t('generate')}
              ratioFieldName='aspectRatio'
              resolutionFieldName='resolution'
            />
          </form>
        </Form>

        {/* Right side content */}
        {customRightContent || (
          <div className='flex h-full flex-1 flex-col gap-3 overflow-hidden'>
            <ImageDisplay />
            <ImageHistorySection />
          </div>
        )}
      </div>
    </ImageContenxtProvider>
  );
}
