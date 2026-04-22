'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const TopLoadingBar = dynamic(() => import('@/components/top-loading-bar'), { ssr: false });
const CookieConsentDialog = dynamic(() => import('@/components/dialog/CookieConsentDialog'), { ssr: false });
const GlobalTaskPolling = dynamic(() => import('@/components/GlobalTaskPolling'), { ssr: false });

export default function LazyGlobalUI() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return null;

  return (
    <>
      <CookieConsentDialog />
      <TopLoadingBar />
      <GlobalTaskPolling />
    </>
  );
}
