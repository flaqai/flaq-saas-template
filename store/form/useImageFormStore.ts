/* eslint-disable @typescript-eslint/indent */
import { create } from 'zustand';

import { ImageFormType } from '@/components/image-ui-form/image-context-provider';

// 纯 Image 生成页的预览默认值
const PURE_IMAGE_DEFAULT_PREVIEW: { formType: ImageFormType; imgSrc: string }[] = [
  {
    formType: 'image-to-image',
    imgSrc: 'https://cdn.heydream.im/heydream/v3/image_to_image/first_picture/first_picture.webp',
  },
  {
    formType: 'text-to-image',
    imgSrc: 'https://cdn.heydream.im/heydream/v3/text_to_image/feature/feature1.3.webp',
  },
  {
    formType: 'virtual-try-on',
    imgSrc: 'https://cdn.heydream.im/heydream/v3/virtual_try_on/feature/1_1.webp',
  },
];

// 图片生成页的预览默认值
const DefaultPreviewMedia: { formType: ImageFormType; imgSrc: string }[] = [
  ...PURE_IMAGE_DEFAULT_PREVIEW,
];

type PreviewMedia = {
  id: string;
  src: string; // generated img
  name: string;
  resolution: string;
  prompt: string;
  originalImg?: string;
  modelName?: string;
  createTime?: number;
  width?: number;
  height?: number;
  userImageUrlList?: string[];
  size?: number;
  type: 'display-one' | 'compare-two' | 'display-one-edit';
};

type ImageObjType =
  | (PreviewMedia & {
      mediaList?: typeof DefaultPreviewMedia;
    })
  | (Partial<PreviewMedia> & {
      mediaList: typeof DefaultPreviewMedia;
    })
  | 'loading'
  | null;

type State = {
  imageObj: ImageObjType;
  startFrameImageObj: ImageObjType;
  endFrameImageObj: ImageObjType;
  imageFormSrc: string | null;
  videoFormImageSrc: string | null;
  layerImageObj: { id: string; originalImg: string; maskImg?: string; generatedImg?: string; prompt?: string } | null;
  layerMaskDataUrl: string | null;
  uploadImageObj: { src: string } | null;
  isPolling: boolean;
  isStartFramePolling: boolean;
  isEndFramePolling: boolean;
};

type Actions = {
  updateImageObj: (imageObj: State['imageObj']) => void;
  updateStartFrameImageObj: (imageObj: State['startFrameImageObj']) => void;
  updateEndFrameImageObj: (imageObj: State['endFrameImageObj']) => void;
  setImageFormSrc: (imageObj: State['imageFormSrc']) => void;
  setVideoFormImageSrc: (imageObj: State['videoFormImageSrc']) => void;
  setUploadImageObj: (uploadImageObj: State['uploadImageObj']) => void;
  setLayerImageObj: (layerImageObj: State['layerImageObj']) => void;
  setLayerMaskDataUrl: (layerMaskDataUrl: State['layerMaskDataUrl']) => void;
  setIsPolling: (isPolling: boolean) => void;
  setIsStartFramePolling: (isPolling: boolean) => void;
  setIsEndFramePolling: (isPolling: boolean) => void;
  resetDefault: () => void;
};

const DEFAULT_DATA: State = {
  imageFormSrc: null,
  videoFormImageSrc: null,
  layerImageObj: null,
  layerMaskDataUrl: null,
  imageObj: { mediaList: DefaultPreviewMedia },
  startFrameImageObj: { mediaList: DefaultPreviewMedia },
  endFrameImageObj: { mediaList: DefaultPreviewMedia },
  uploadImageObj: null,
  isPolling: false,
  isStartFramePolling: false,
  isEndFramePolling: false,
};

const useImageFormStore = create<State & Actions>((set, get) => ({
  ...DEFAULT_DATA,
  updateImageObj: (imageObj) => set({ imageObj }),
  updateStartFrameImageObj: (startFrameImageObj) => set({ startFrameImageObj }),
  updateEndFrameImageObj: (endFrameImageObj) => set({ endFrameImageObj }),
  setImageFormSrc: (imageFormSrc) => set({ imageFormSrc }),
  setVideoFormImageSrc: (videoFormImageSrc) => set({ videoFormImageSrc }),
  setUploadImageObj: (uploadImageObj) => set({ uploadImageObj }),
  setLayerImageObj: (layerImageObj) => set({ layerImageObj }),
  setLayerMaskDataUrl: (layerMaskDataUrl) => set({ layerMaskDataUrl }),
  setIsPolling: (isPolling) => set({ isPolling }),
  setIsStartFramePolling: (isStartFramePolling) => set({ isStartFramePolling }),
  setIsEndFramePolling: (isEndFramePolling) => set({ isEndFramePolling }),
  resetDefault: () => {
    const { isPolling, isStartFramePolling, isEndFramePolling } = get();
    const newState = { ...DEFAULT_DATA };
    if (isPolling) {
      newState.isPolling = true;
      newState.imageObj = null;
    }
    if (isStartFramePolling) {
      newState.isStartFramePolling = true;
      newState.startFrameImageObj = null;
    }
    if (isEndFramePolling) {
      newState.isEndFramePolling = true;
      newState.endFrameImageObj = null;
    }
    set(newState);
  },
}));

export default useImageFormStore;
