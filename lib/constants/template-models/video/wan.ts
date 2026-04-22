import type { TemplateModelConfig } from '../types';

export const WAN_VIDEO_MODELS: TemplateModelConfig[] = [
  {
    id: 'wan-2.7-text-to-video',
    label: 'Wan 2.7',
    mediaType: 'video',
    request: {
      endpoint: 'video',
      modelName: 'wan-2.7-text-to-video',
    },
    inputs: {
      prompt: { supported: true, required: true },
      startFrame: { supported: false, required: false },
      endFrame: { supported: false, required: false },
      audio: { supported: true, required: false },
    },
    params: {
      ratio: ['16:9', '9:16', '1:1', '4:3', '3:4'],
      resolution: ['720p', '1080p'],
      durationRange: { min: 2, max: 15 },
      seed: true,
      negativePrompt: true,
    },
  },
  {
    id: 'wan-2.7-image-to-video',
    label: 'Wan 2.7',
    mediaType: 'video',
    request: {
      endpoint: 'video',
      modelName: 'wan-2.7-image-to-video',
    },
    inputs: {
      prompt: { supported: true, required: true },
      startFrame: { supported: true, required: true },
      endFrame: { supported: true, required: false },
      video: { supported: true, required: false },
      audio: { supported: true, required: false },
    },
    params: {
      resolution: ['720p', '1080p'],
      durationRange: { min: 2, max: 15 },
      seed: true,
      negativePrompt: true,
    },
  },
];
