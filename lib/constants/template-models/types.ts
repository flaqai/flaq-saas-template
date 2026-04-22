export type TemplateModelConfig = {
  id: string;
  label: string;
  mediaType: 'image' | 'video';

  request: {
    endpoint: 'image' | 'video';
    modelName: string;
  };

  inputs: {
    prompt?: { supported: boolean; required: boolean };
    image?: {
      supported: boolean;
      required: boolean;
      multiple?: boolean;
      min?: number;
      max?: number;
    };
    startFrame?: { supported: boolean; required: boolean };
    endFrame?: { supported: boolean; required: boolean };
    video?: { supported: boolean; required: boolean };
    audio?: { supported: boolean; required: boolean };
  };

  params?: {
    ratio?: string[];
    resolution?: string[];
    duration?: number[];
    durationRange?: { min: number; max: number };
    style?: string[];
    seed?: boolean;
    negativePrompt?: boolean;
    guidanceScale?: boolean;
    sound?: boolean;
    bgm?: boolean;
    keepOriginalSound?: boolean;
  };
};
