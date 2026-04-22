import { GEMINI_IMAGE_MODELS } from './gemini';
import { SEEDREAM_IMAGE_MODELS } from './seedream';

export { GEMINI_IMAGE_MODELS } from './gemini';
export { SEEDREAM_IMAGE_MODELS } from './seedream';

export const TEMPLATE_IMAGE_MODELS = [
  ...GEMINI_IMAGE_MODELS,
  ...SEEDREAM_IMAGE_MODELS,
];
