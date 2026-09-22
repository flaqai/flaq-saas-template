import { IMAGE_CHILDREN_LIST, NAV_LINKS, VIDEO_CHILDREN_LIST, type RouteItem } from './navigation';

export type SidebarNavigationGroup = {
  code: 'video-ai' | 'image-ai';
  groupLabelKey: string;
  iconFolder: 'video_ai' | 'image_ai';
  collapsedVisibleCount: number;
  items: RouteItem[];
};

export const SIDEBAR_PRIMARY_ITEMS = NAV_LINKS.find((item) => item.code === 'creative-suite')?.children || [];

export const SIDEBAR_NAVIGATION_GROUPS: SidebarNavigationGroup[] = [
  {
    code: 'video-ai',
    groupLabelKey: 'video-ai',
    iconFolder: 'video_ai',
    collapsedVisibleCount: 5,
    items: VIDEO_CHILDREN_LIST.filter((item) => !item.hideInNav),
  },
  {
    code: 'image-ai',
    groupLabelKey: 'image-ai',
    iconFolder: 'image_ai',
    collapsedVisibleCount: 5,
    items: IMAGE_CHILDREN_LIST.filter((item) => !item.hideInNav),
  },
];

export function isItemActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}
