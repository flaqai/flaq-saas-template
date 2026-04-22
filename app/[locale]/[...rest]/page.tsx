import { redirect } from '@/i18n/navigation';

export default async function CatchAllPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  // 重定向到 /404 路由，使用 /404 页面的 metadata
  redirect({ href: '/404', locale });
}
