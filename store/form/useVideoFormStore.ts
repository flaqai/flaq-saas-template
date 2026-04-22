/* eslint-disable @typescript-eslint/indent */
import type { VideoHistoryRequest } from '@/network/video/history';
import { create } from 'zustand';

const defaultVideoSrcs = {
  'image-to-video': {
    poster: 'https://cdn.heydream.im/heydream/v2/image_to_video/example/example1.webp',
    videoSrc: 'https://cdn.heydream.im/heydream/v2/image_to_video/example/example1.1.mp4',
  },
  'text-to-video': {
    poster: 'https://cdn.heydream.im/heydream/v2/text_to_video/example/example2.webp',
    videoSrc: 'https://cdn.heydream.im/heydream/v2/text_to_video/example/example2.1.mp4',
  },
} as const;

const DefaultPreviewMedia: { formType: VideoHistoryRequest['videoType']; imgSrc: string; videoSrc: string }[] = [
  {
    formType: 'Image-to-video',
    imgSrc: defaultVideoSrcs['image-to-video'].poster,
    videoSrc: defaultVideoSrcs['image-to-video'].videoSrc,
  },
  {
    formType: 'Text-to-video',
    imgSrc: defaultVideoSrcs['text-to-video'].poster,
    videoSrc: defaultVideoSrcs['text-to-video'].videoSrc,
  },
];

type PreviewMedia = {
  id: string;
  videoSrc: string;
  posterSrc: string;
  model: string;
  name: string;
  isAllowExtend: boolean;
  startFrame?: string;
  endFrame?: string;
  prompt: string;
  platformName?: string;
  ratio?: string;
  duration?: number;
  createTime?: number;
  coverImg?: string;
  originalImg?: string;
};

type State = {
  videoObj:
    | (PreviewMedia & {
        mediaList?: typeof DefaultPreviewMedia;
      })
    | (Partial<PreviewMedia> & {
        mediaList: typeof DefaultPreviewMedia;
      })
    | null;
};

type Actions = {
  updateVideoObj: (videoObj: State['videoObj']) => void;
  resetDefault: () => void;
};

const DEFAULT_DATA: State = {
  videoObj: {
    mediaList: DefaultPreviewMedia,
  },
};

const useVideoFormStore = create<State & Actions>((set) => ({
  ...DEFAULT_DATA,
  updateVideoObj: (videoObj) => set({ videoObj }),
  resetDefault: () => set(DEFAULT_DATA),
}));

export default useVideoFormStore;
