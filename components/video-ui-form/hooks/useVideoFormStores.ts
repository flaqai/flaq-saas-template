/**
 * 视频表单状态管理 Hook
 *
 * 统一管理视频表单所需的所有 Zustand stores
 * 减少主组件中的 hooks 调用，提高可维护性
 *
 * @example
 * ```tsx
 * const stores = useVideoFormStores();
 * // 使用 stores.setShowBtn, stores.uploadFilesToStorageThroughBackEnd 等
 * ```
 */

import usePricingDialogStore from '@/store/usePricingDialogStore';
import useMobileVideoHistoryButttonStore from '@/store/video/useMobileVideoHistoryButttonStore';
import useShareFormStore from '@/store/form/use-share-form-store';
import useVideoFormDefaultStore from '@/store/form/use-video-form-default-store';
import useVideoFormStore from '@/store/form/useVideoFormStore';
import useUploadFiles from '@/hooks/use-upload-files';
import useUpdateUserInfo from '@/hooks/useUpdateUserInfo';

/**
 * 视频表单状态管理
 *
 * 将 17 个分散的 hooks 调用统一到一个 hook 中
 * 提高代码可读性和可维护性
 */
export function useVideoFormStores() {
  // ============================================
  // 对话框控制
  // ============================================
  const setOpenPricingDialogStore = usePricingDialogStore((state) => state.setOpen);

  // ============================================
  // 导航和UI状态
  // ============================================
  const setShowBtn = useMobileVideoHistoryButttonStore((state) => state.setShowBtn);

  // ============================================
  // 表单状态
  // ============================================
  const resetDefault = useVideoFormStore((state) => state.resetDefault);
  const defaultPrompt = useVideoFormDefaultStore((state) => state.prompt);

  // ============================================
  // 共享状态
  // ============================================
  const shareImageObj = useShareFormStore((state) => state.shareImageObj);
  const setShareImageObj = useShareFormStore((state) => state.setShareImageObj);

  // ============================================
  // 工具函数
  // ============================================
  const uploadFilesToStorageThroughBackEnd = useUploadFiles();
  const { updateUserInfoWithDelay } = useUpdateUserInfo();

  return {
    // 向后兼容的空占位，避免核心表单链路继续依赖登录态
    userInfo: null,
    isPaidUser: true,

    // 对话框
    setOpenPricingDialogStore,

    // 导航和UI
    setShowBtn,

    // 表单状态
    resetDefault,
    defaultPrompt,

    // 共享状态
    shareImageObj,
    setShareImageObj,

    // 工具函数
    uploadFilesToStorageThroughBackEnd,
    updateUserInfoWithDelay,
  };
}

/**
 * 类型导出，方便在其他地方使用
 */
export type VideoFormStores = ReturnType<typeof useVideoFormStores>;
