'use client';

import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from 'react';
import { ArrowRight, Infinity as InfinityIcon, Loader2, Plus } from 'lucide-react';

import { createCanvasProjectStorage } from '@/components/infinite-canvas/runtime/persistence/local-projects';
import { type CanvasProjectSummary } from '@/components/infinite-canvas/types/project';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { InfiniteCanvasProjectCard } from '@/components/infinite-canvas/project-card/infinite-canvas-project-card';
import type { InfiniteCanvasLandingProps } from './infinite-canvas-landing.types';

const RECENT_PROJECT_LIMIT = 4;
const RECENT_PROJECT_SKELETON_KEYS = [
  'recent-project-1',
  'recent-project-2',
  'recent-project-3',
  'recent-project-4',
] as const;

type RecentProjectsLoadState = 'idle' | 'loading' | 'ready' | 'empty' | 'error';

export function InfiniteCanvasLanding({
  i18n,
  integrations,
  projectImageUrl,
}: InfiniteCanvasLandingProps) {
  const storage = useMemo(() => createCanvasProjectStorage(), []);
  const [projects, setProjects] = useState<readonly CanvasProjectSummary[]>([]);
  const [total, setTotal] = useState(0);
  const [loadState, setLoadState] = useState<RecentProjectsLoadState>('idle');
  const [isCreating, startCreating] = useTransition();
  const creatingRef = useRef(false);
  const requestSequence = useRef(0);

  const handleError = useCallback(
    (error: unknown, operation: string) => {
      integrations.onError?.(error, operation);
    },
    [integrations],
  );

  const loadRecentProjects = useCallback(async () => {
    const sequence = ++requestSequence.current;
    setLoadState('loading');
    try {
      const page = await storage.listProjects(1, RECENT_PROJECT_LIMIT);
      if (sequence !== requestSequence.current) return;
      setProjects(page.rows);
      setTotal(page.total);
      setLoadState(page.rows.length === 0 ? 'empty' : 'ready');
    } catch (error) {
      if (sequence !== requestSequence.current) return;
      setProjects([]);
      setTotal(0);
      setLoadState('error');
      handleError(error, 'list-recent-projects');
    }
  }, [handleError, storage]);

  useEffect(() => {
    void loadRecentProjects();
  }, [loadRecentProjects]);

  const createProject = () => {
    if (creatingRef.current) return;
    creatingRef.current = true;
    startCreating(async () => {
      try {
        const project = await storage.createProject(i18n.untitled);
        integrations.onAnalytics?.('infinite_canvas_project_created', { source: 'landing' });
        integrations.navigateToEditor(project.id);
      } catch (error) {
        handleError(error, 'create-project');
      } finally {
        creatingRef.current = false;
      }
    });
  };

  const openDashboard = () => {
    integrations.navigateToDashboard();
  };

  const openProject = (projectId: string) => {
    integrations.navigateToEditor(projectId);
  };

  return (
    <div className='bg-background-color text-text-color'>
      <section className='mx-auto w-full max-w-[1280px] px-4 pb-8 pt-16 text-center sm:px-5 md:pt-24'>
        <div className='mx-auto flex w-full flex-col items-center pb-2'>
          <div className='inline-flex max-w-full items-center gap-2 rounded-full border border-main-color/40 bg-main-color/15 px-4 py-2 text-xs font-medium text-text-color sm:text-sm'>
            <InfinityIcon className='size-5 shrink-0' aria-hidden='true'>
              <path d='M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2M21 19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2' />
            </InfinityIcon>
            <span>{i18n.eyebrow}</span>
          </div>
          <h1 className='mt-6 text-[32px] font-semibold leading-[1.3] text-main-color sm:mt-8 sm:text-balance sm:text-4xl sm:leading-[1.2] lg:text-[56px]'>
            <span className='block'>{i18n.title}</span>
            <span className='block'>{i18n.titleHighlight}</span>
          </h1>
          <p className='mt-6 max-w-[760px] whitespace-pre-line text-pretty px-4 text-base leading-6 text-text-color/80 sm:mt-8 sm:px-0 sm:text-lg sm:leading-7'>
            {i18n.description}
          </p>
          <div className='mt-6 grid w-full max-w-[368px] grid-cols-2 gap-3 sm:mt-8'>
            <Button
              type='button'
              onClick={createProject}
              disabled={isCreating}
              aria-busy={isCreating}
              className='col-span-2 h-[52px] min-w-0 gap-3 rounded-lg bg-gradient-main px-4 text-gradient-main-foreground hover:opacity-90'
            >
              {isCreating ? (
                <Loader2 className='size-5 animate-spin' aria-hidden='true' />
              ) : (
                <ArrowRight className='size-5' aria-hidden='true' />
              )}{' '}
              {i18n.createCta}
            </Button>
            <Button
              type='button'
              variant='outline'
              onClick={integrations.navigateToDocs}
              className='h-12 min-w-0 whitespace-normal rounded-lg border-light-gray-2 bg-light-gray-1 px-3 text-text-color hover:bg-light-gray-2 hover:text-text-color sm:px-6'
            >
              {i18n.docsCta}
            </Button>
            <Button
              type='button'
              variant='outline'
              onClick={openDashboard}
              className='h-12 min-w-0 whitespace-normal rounded-lg border-light-gray-2 bg-light-gray-1 px-3 text-text-color hover:bg-light-gray-2 hover:text-text-color sm:px-6'
            >
              {i18n.dashboardCta}
            </Button>
          </div>
          <p className='mt-4 text-sm leading-5 text-gray-color sm:mt-6'>{i18n.capabilities}</p>
        </div>
      </section>

        <section
          className='mx-auto w-full min-w-0 max-w-7xl border-t border-light-gray-2 px-4 py-10 sm:px-8'
          aria-labelledby='infinite-canvas-recent-projects'
          aria-busy={loadState === 'loading'}
        >
          <div className='flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4'>
            <h2 id='infinite-canvas-recent-projects' className='text-2xl font-semibold'>
              {i18n.recentTitle}
            </h2>
            <button
              type='button'
              onClick={openDashboard}
              className='inline-flex items-center gap-1 text-sm font-medium text-main-color transition-opacity hover:opacity-75'
            >
              {i18n.viewAll}
              {total > RECENT_PROJECT_LIMIT ? ` (${total})` : ''}
              <ArrowRight className='size-4' aria-hidden='true' />
            </button>
          </div>

          <ul
            aria-labelledby='infinite-canvas-recent-projects'
            className='-mx-4 mt-6 grid snap-x snap-proximity auto-cols-[252px] grid-flow-col gap-4 overflow-x-auto overscroll-x-contain px-4 pb-1 pt-1 scroll-px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden [&>li]:min-w-0 [&>li]:snap-start sm:-mx-0 sm:auto-cols-auto sm:grid-flow-row sm:grid-cols-2 sm:px-0 lg:grid-cols-5'
          >
            <li>
              <button
                type='button'
                onClick={createProject}
                disabled={isCreating}
                aria-busy={isCreating}
                className='flex h-full min-h-48 w-full flex-col items-center justify-center rounded-xl border border-main-color/50 bg-main-color/5 px-5 py-7 text-center transition hover:border-main-color hover:bg-main-color/10 disabled:opacity-50'
              >
                <span className='grid size-12 place-items-center rounded-full border border-main-color/60 bg-main-color/15 text-main-color'>
                  {isCreating ? (
                    <Loader2 className='size-5 animate-spin' aria-hidden='true' />
                  ) : (
                    <Plus className='size-5' aria-hidden='true' />
                  )}
                </span>
                <span className='mt-4 font-medium text-text-color'>{i18n.newProject}</span>
                <span className='mt-1 text-xs leading-5 text-gray-color'>{i18n.newProjectDescription}</span>
              </button>
            </li>

            {loadState === 'loading'
              ? RECENT_PROJECT_SKELETON_KEYS.map((key) => (
                  <li
                    key={key}
                    aria-label={i18n.loading}
                    className='rounded-xl border border-light-gray-2 bg-light-gray p-2'
                  >
                    <Skeleton className='aspect-video w-full rounded-lg bg-light-gray-2' />
                    <Skeleton className='mt-3 h-4 w-3/4 bg-light-gray-2' />
                    <Skeleton className='mt-2 h-3 w-1/2 bg-light-gray-2' />
                  </li>
                ))
              : null}

            {loadState === 'error' ? (
              <li className='flex min-h-48 flex-col items-center justify-center rounded-xl border border-dashed border-light-gray-2 px-5 text-center sm:col-span-2 lg:col-span-4'>
                <p className='text-sm text-gray-color'>{i18n.loadError}</p>
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  className='mt-3'
                  onClick={() => void loadRecentProjects()}
                >
                  {i18n.retry}
                </Button>
              </li>
            ) : null}

            {loadState === 'empty' ? (
              <li className='flex min-h-48 flex-col items-center justify-center rounded-xl border border-dashed border-light-gray-2 bg-light-gray/40 px-5 text-center sm:col-span-2 lg:col-span-4'>
                <InfinityIcon className='size-8 text-text-color' aria-hidden='true' />
                <p className='mt-3 text-sm font-medium text-text-color'>{i18n.emptyTitle}</p>
                <p className='mt-1 max-w-md text-xs leading-5 text-gray-color'>{i18n.emptyDescription}</p>
              </li>
            ) : null}

            {loadState === 'ready'
              ? projects.map((project, index) => (
                  <li key={project.projectId}>
                    <InfiniteCanvasProjectCard
                      project={project}
                      imageUrl={projectImageUrl}
                      variant={index}
                      locale={i18n.locale}
                      labels={{
                        connectionCount: i18n.connectionCount,
                        nodeCount: i18n.nodeCount,
                        open: i18n.open,
                        updated: i18n.updated,
                      }}
                      onOpen={() => openProject(project.projectId)}
                    />
                  </li>
                ))
              : null}
          </ul>
        </section>
    </div>
  );
}
