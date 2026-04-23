/* eslint-disable @typescript-eslint/naming-convention */

export interface RatioConfig {
  name: string;
  value: string;
  iconWidth: string;
  iconHeight: string;
}

export interface FrameConfig {
  required: boolean;
  isSupported: boolean;
}

export interface MultiImageConfig {
  required: boolean;
  isSupported?: boolean;
  minImages?: number;
  maxImages: number;
}

export interface ModelOptions {
  duration?: number;
  durationRange?: { min: number; max: number };
  resolution?: string;
  ratio?: RatioConfig[] | null;
  startFrame?: FrameConfig;
  endFrame?: FrameConfig;
  multiImage?: MultiImageConfig;
  audio?: boolean;
  audioUrl?: boolean;
  sound?: boolean;
  bgm?: boolean;
  style?: string[];
  videoUrl?: FrameConfig;
  audioSetting?: boolean;
  keepOriginalSound?: boolean;
  multiPrompt?: boolean;
  guidanceScale?: boolean;
  cameraFixed?: boolean;
  seed?: boolean;
  negativePrompt?: boolean;
}

export interface ModelVersionOptions {
  duration?: string[];
  durationRange?: { min: number; max: number };
  resolution?: string[];
  ratio?: RatioConfig[] | null;
  startFrame?: FrameConfig;
  endFrame?: FrameConfig;
  multiImage?: MultiImageConfig;
  audio?: boolean;
  audioUrl?: boolean;
  sound?: boolean;
  bgm?: boolean;
  style?: string[];
  videoUrl?: FrameConfig;
  keepOriginalSound?: boolean;
  guidanceScale?: boolean;
  seed?: boolean;
  negativePrompt?: boolean;
}

export type VideoGenerationType = 'text-to-video' | 'image-to-video' | 'reference-to-video' | 'video-edit';

export interface VideoModel {
  provider: string;
  modelVersion: string;
  model: string;
  name: string;
  platformType: number;
  pricingType: 'video';
  credit: number;
  isPaid: boolean;
  generationType?: VideoGenerationType;
  options: ModelOptions;
  previewUrl?: string;
  prompt?: string;
  disabled?: boolean;
}

export interface ModelVersionConfig {
  provider: string;
  modelVersion: string;
  name: string;
  baseCredit: number;
  platformType: number;
  isPaid: boolean;
  pricingType: 'video';
  isComingSoon?: boolean;
  options: ModelVersionOptions;
  models: VideoModel[];
}

export interface ProviderConfig {
  provider: string;
  name: string;
  versions: ModelVersionConfig[];
}
