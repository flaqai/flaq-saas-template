import { KLING_VIDEO_MODELS } from './kling';
import { VEO_VIDEO_MODELS } from './veo';
import { VIDU_VIDEO_MODELS } from './vidu';
import { WAN_VIDEO_MODELS } from './wan';

export { KLING_VIDEO_MODELS } from './kling';
export { VEO_VIDEO_MODELS } from './veo';
export { VIDU_VIDEO_MODELS } from './vidu';
export { WAN_VIDEO_MODELS } from './wan';

export const TEMPLATE_VIDEO_MODELS = [
  ...KLING_VIDEO_MODELS,
  ...VEO_VIDEO_MODELS,
  ...VIDU_VIDEO_MODELS,
  ...WAN_VIDEO_MODELS,
];
