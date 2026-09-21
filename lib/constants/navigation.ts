export type RouteItem = {
  code: string;
  href: string;
  title?: string;
  hideInNav?: boolean;
  hideInFooter?: boolean;
  hideInSitemap?: boolean;
};

export type NavLink = RouteItem & { children?: RouteItem[] };

export const VIDEO_CHILDREN_LIST: RouteItem[] = [
  { code: 'image-to-video', href: '/image-to-video' },
  { code: 'text-to-video', href: '/text-to-video' },
  { code: 'reference-to-video', href: '/reference-to-video' },
];

export const IMAGE_CHILDREN_LIST: RouteItem[] = [
  { code: 'image-to-image', href: '/image-to-image' },
  { code: 'text-to-image', href: '/text-to-image' },
  { code: 'virtual-try-on', href: '/virtual-try-on' },
];

export const API_CHILDREN_LIST: RouteItem[] = [
  { code: 'nano-banana-2', href: 'https://flaq.ai/models/google/nano-banana-2/' },
  { code: 'nano-banana-pro', href: 'https://flaq.ai/models/google/nano-banana-pro/' },
  { code: 'chatgpt-images-2-5', href: 'https://flaq.ai/models/openai/chatgpt-images-2-5/' },
  { code: 'chatgpt-images-2-5-flare', href: 'https://flaq.ai/models/openai/chatgpt-images-2-5-flare/' },
  { code: 'chatgpt-images-2-5-sunburst', href: 'https://flaq.ai/models/openai/chatgpt-images-2-5-sunburst/' },
  { code: 'qwen-image-3-0', href: 'https://flaq.ai/models/alibaba/qwen-image-3-0/' },
  { code: 'qwen-image-3-0-pro', href: 'https://flaq.ai/models/alibaba/qwen-image-3-0-pro/' },
  { code: 'seedream-5-0-pro', href: 'https://flaq.ai/models/bytedance/seedream-5-0-pro/' },
  { code: 'veo-3-1', href: 'https://flaq.ai/models/google/veo3-1-text-to-video/' },
  { code: 'kling-4-0', href: 'https://flaq.ai/models/kuaishou/kling-4-0-text-to-video/' },
  { code: 'vidu-q3', href: 'https://flaq.ai/models/vidu/vidu-q3-turbo-text-to-video/' },
  { code: 'wan-3-0', href: 'https://flaq.ai/models/alibaba/wan-3-0-text-to-video/' },
  { code: 'seedance-2-5', href: 'https://flaq.ai/models/bytedance/seedance-2-5-text-to-video/' },
  { code: 'flux-3', href: 'https://flaq.ai/models/black-forest-labs/flux-3-text-to-video/' },
  { code: 'minimax-h3', href: 'https://flaq.ai/models/minimax/minimax-h3-text-to-video/' },
  { code: 'happyhorse-1-1', href: 'https://flaq.ai/models/alibaba/happyhorse-1-1-text-to-video/' },
];

export const SUPPORT_LINKS: RouteItem[] = [
  { code: 'privacy', href: '/privacy-policy' },
  { code: 'termsConditions', href: '/terms-of-service' },
  { code: 'refundPolicy', href: '/refund-policy' },
];

export const ALL_FEATURE_ROUTES: RouteItem[] = [
  ...VIDEO_CHILDREN_LIST,
  ...IMAGE_CHILDREN_LIST,
  { code: 'ai-create', href: '/ai-media-creator' },
  { code: 'ai-canvas', href: '/ai-canvas' },
].filter((r) => !r.hideInSitemap);

export const NAV_LINKS: NavLink[] = [
  { code: 'creative-suite', href: '', children: [
    { code: 'ai-create', href: '/ai-media-creator' },
    { code: 'ai-canvas', href: '/ai-canvas' },
  ] },
  { code: 'video-ai', href: '', children: VIDEO_CHILDREN_LIST.filter((r) => !r.hideInNav) },
  { code: 'image-ai', href: '', children: IMAGE_CHILDREN_LIST.filter((r) => !r.hideInNav) },
  { code: 'ai-api', href: '', children: API_CHILDREN_LIST },
];

export const UTM_SOURCE = 'flaq-saas-template';
