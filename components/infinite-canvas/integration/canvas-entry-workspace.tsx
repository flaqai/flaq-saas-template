'use client';

import { useCallback, useMemo } from 'react';
import { useTranslations } from 'next-intl';

import UnifiedGeneratorForm from '@/components/unified-generator/UnifiedGeneratorForm';
import type { PreparedUnifiedSubmission, UnifiedSubmitInput } from '@/components/unified-generator/useUnifiedGeneratorSubmit';
import type { InfiniteCanvasIntegrations } from '../infinite-canvas.types';
import { createCanvasProjectStorage } from '../runtime/persistence/local-projects';
import { createCanvasEntryProject, validateCanvasEntryInput } from './canvas-entry-project';

export function CanvasEntryWorkspace({ integrations }: { integrations: InfiniteCanvasIntegrations }) {
  const t = useTranslations('InfiniteCanvas.landing');
  const storage = useMemo(() => createCanvasProjectStorage(), []);
  const validateInput = useCallback((input: UnifiedSubmitInput) => {
    validateCanvasEntryInput(input, t('workflow.unsupportedParameters'));
  }, [t]);
  const createProject = useCallback(async (submission: PreparedUnifiedSubmission) => {
    const snapshot = await createCanvasEntryProject(submission, {
      untitled: t('workflow.untitled'), generation: t('workflow.generation'),
      inputImage: t('workflow.inputImage'), inputVideo: t('workflow.inputVideo'), inputAudio: t('workflow.inputAudio'),
    });
    const project = await storage.createProject(snapshot.title, snapshot);
    integrations.navigateToEditor(project.id);
  }, [integrations, storage, t]);

  return <UnifiedGeneratorForm submitLabel={t('form.submit')} validateInput={validateInput} onPreparedSubmit={createProject} keepSubmittingOnSuccess />;
}
