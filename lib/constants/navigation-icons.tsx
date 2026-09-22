import type { ComponentType } from 'react';
import { Sparkles, Workflow } from 'lucide-react';

import { getModelBrandIconValueFromHref } from '@/lib/utils/modelBrandIcons';
import { getModelProviderIconConfig } from '@/lib/utils/modelProviderIcons';

type NavigationIconImage = {
  off: string;
  on: string;
};

type NavigationIcon = ComponentType<{ className?: string }> | NavigationIconImage;

export function isNavigationIconImage(icon: NavigationIcon | undefined): icon is NavigationIconImage {
  return Boolean(icon && typeof icon === 'object' && 'off' in icon && 'on' in icon);
}

const sidebarIcon = (folder: string, name: string): NavigationIconImage => ({
  off: `/images/sidebar-icon/off/${folder}/${name}_off.svg`,
  on: `/images/sidebar-icon/on/${folder}/${name}_on.svg`,
});

const navigationImageIcon = (name: string): NavigationIconImage => ({
  off: `/images/navigation/${name}_off.svg`,
  on: `/images/navigation/${name}_on.svg`,
});

const TOP_NAVIGATION_ICON_MAP: Record<string, NavigationIcon> = {
  'ai-create': Sparkles,
  'ai-canvas': Workflow,
  'reference-to-video': navigationImageIcon('video_common'),
  'text-to-video': navigationImageIcon('video_common'),
  'image-to-video': navigationImageIcon('video_common'),
  'text-to-image': navigationImageIcon('image_common'),
  'image-to-image': navigationImageIcon('image_common'),
  'virtual-try-on': sidebarIcon('image_ai', 'virtual_try_on'),
};

export function getNavigationIcon(code: string, href: string): NavigationIcon | undefined {
  const modelPath = href.startsWith('https://flaq.ai/') ? new URL(href).pathname : href;
  const modelValue = getModelBrandIconValueFromHref(modelPath);
  const modelIconConfig = modelValue ? getModelProviderIconConfig(modelValue) : undefined;

  if (modelIconConfig) {
    return { off: modelIconConfig.whiteIcon, on: modelIconConfig.icon };
  }

  return TOP_NAVIGATION_ICON_MAP[code];
}

export const NAVIGATION_ICON_MAP: Record<string, NavigationIcon> = {
  'ai-create': Sparkles,
  'ai-canvas': Workflow,
  'image-to-video': sidebarIcon('video_ai', 'image_to_video'),
  'text-to-video': sidebarIcon('video_ai', 'text_to_video'),
  'reference-to-video': sidebarIcon('video_ai', 'ai_video_generator'),
  'image-to-image': sidebarIcon('image_ai', 'image_to_image'),
  'text-to-image': sidebarIcon('image_ai', 'text_to_image'),
  'virtual-try-on': sidebarIcon('image_ai', 'virtual_try_on'),
};
