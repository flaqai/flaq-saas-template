'use client';

import { useEffect } from 'react';
import { restorePendingTaskPolling, stopAllTaskPolling } from '@/network/task-polling';

export default function GlobalTaskPolling() {
  useEffect(() => {
    restorePendingTaskPolling();

    return () => {
      stopAllTaskPolling();
    };
  }, []);

  return null;
}
