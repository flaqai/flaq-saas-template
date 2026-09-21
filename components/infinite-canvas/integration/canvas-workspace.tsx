'use client';

import { useCallback, useMemo, useState, type ReactNode } from 'react';
import dynamic from 'next/dynamic';
import OpenApiSettingsDialog from '@/components/dialog/OpenApiSettingsDialog';
import { STORE_PREFIX } from '@/lib/constants/config';
import { InfiniteCanvasDashboard } from '../infinite-canvas-dashboard';
import { InfiniteCanvasLanding } from '../landing/infinite-canvas-landing';
import PanelSider from '@/components/sider/panel-sider/sider3';
import { CanvasEntryWorkspace } from './canvas-entry-workspace';
import { useCanvasI18n } from './use-canvas-i18n';
import { useCanvasIntegrations } from './use-canvas-integrations';

const InfiniteCanvasEditor = dynamic(() => import('../infinite-canvas-editor').then((module) => module.InfiniteCanvasEditor), { ssr: false });

export function CanvasWorkspace({ mode, projectId, children }: { readonly children?: ReactNode; readonly mode: 'landing' | 'dashboard' | 'editor'; readonly projectId?: string }) {
  const i18n = useCanvasI18n();
  const [page, setPage] = useState(1);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const openSettings = useCallback(() => setSettingsOpen(true), []);
  const integrations = useCanvasIntegrations(openSettings);
  const landingI18n = useMemo(() => ({
    ...i18n.landing.recent, ...i18n.landing, locale: i18n.locale,
    recentTitle: i18n.landing.recent.title,
    docsCta: i18n.landing.secondaryCta, createCta: i18n.dashboard.create, dashboardCta: i18n.landing.primaryCta,
    nodeCount: i18n.dashboard.nodeCount, connectionCount: i18n.dashboard.connectionCount,
    open: i18n.dashboard.open, untitled: i18n.dashboard.untitled,
  }), [i18n]);

  return (
    <>
      {mode === 'editor' && projectId ? (
        <InfiniteCanvasEditor projectId={projectId} i18n={i18n} integrations={integrations} storageKeyPrefix={STORE_PREFIX} />
      ) : mode === 'dashboard' ? (
        <InfiniteCanvasDashboard i18n={i18n} integrations={integrations} page={page} onPageChange={setPage} />
      ) : (
        <div className='flex items-start'>
          <PanelSider />
          <main className='relative min-w-0 flex-1 overflow-hidden'>
            <InfiniteCanvasLanding i18n={landingI18n} integrations={integrations} entryForm={<CanvasEntryWorkspace integrations={integrations} />} />
            {children}
          </main>
        </div>
      )}
      <OpenApiSettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
    </>
  );
}
