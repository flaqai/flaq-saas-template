import { nanoid } from 'nanoid';

import { TEMPLATE_MODELS } from '@/lib/constants/template-models';
import type { PreparedUnifiedSubmission, UnifiedSubmitInput } from '@/components/unified-generator/useUnifiedGeneratorSubmit';
import { createEmptyCanvasProject } from '../runtime/persistence/project-codec';
import type { CanvasNodeData, CanvasProject } from '../types/project';

interface CanvasEntryLabels {
  untitled: string;
  generation: string;
  inputImage: string;
  inputVideo: string;
  inputAudio: string;
}

export function validateCanvasEntryInput(input: UnifiedSubmitInput, unsupportedParameters: string): void {
  // As in the reference canvas entry, document and web-link inputs cannot become canvas media nodes.
  if (input.mediaType === 'video' && input.videoType === 'reference-to-video' && (input.files.length || input.links.some(Boolean))) {
    throw new Error(unsupportedParameters);
  }
}

/** Reuse the unified form's validated, uploaded inputs; only construct local editor data here. */
export async function createCanvasEntryProject(submission: PreparedUnifiedSubmission, labels: CanvasEntryLabels): Promise<CanvasProject> {
  const { input, request, mediaType } = submission;
  const model = TEMPLATE_MODELS.find((item) => item.mediaType === mediaType && item.request.modelName === request.model_name);
  if (!model) throw new TypeError('Unknown canvas model.');
  const assets: { kind: 'image' | 'video' | 'audio'; url: string; referenceId?: string }[] = [];
  if (submission.mediaType === 'image') {
    for (const url of submission.request.image_url_list ?? []) assets.push({ kind: 'image', url });
  } else {
    const video = submission.request;
    for (const url of [video.image_url, video.image_end_url]) if (url) assets.push({ kind: 'image', url });
    for (const [index, url] of (video.images ?? []).entries()) assets.push({ kind: 'image', url, referenceId: `image_${index + 1}` });
    for (const [index, url] of (video.videos ?? []).entries()) assets.push({ kind: 'video', url, referenceId: `video_${index + 1}` });
    for (const [index, url] of (video.audios ?? []).entries()) assets.push({ kind: 'audio', url, referenceId: `audio_${index + 1}` });
    if (video.audio_url) assets.push({ kind: 'audio', url: video.audio_url });
  }
  const sizes = { image: { width: 340, height: 240 }, video: { width: 420, height: 236 }, audio: { width: 340, height: 120 } };
  const nodes: CanvasNodeData[] = await Promise.all(assets.map(async (asset, index) => {
    let durationMs: number | undefined;
    if (asset.kind === 'video') {
      const { loadVideoMetadata } = await import('@/lib/utils/videoUtils');
      durationMs = (await loadVideoMetadata(asset.url)).duration * 1000;
    }
    return {
      id: nanoid(), type: asset.kind,
      title: asset.kind === 'image' ? labels.inputImage : asset.kind === 'video' ? labels.inputVideo : labels.inputAudio,
      position: { x: 80, y: 80 + index * 300 }, ...sizes[asset.kind],
      metadata: { content: asset.url, status: 'success', mimeType: `${asset.kind}/*`, ...(durationMs === undefined ? {} : { durationMs }) },
    };
  }));
  const referenceIds = new Map(assets.map((asset, index) => [asset.referenceId, nodes[index].id]));
  const prompt = request.prompt.trim().replace(/<<<((?:image|video|audio)_\d+)>>>/g, (token, id: string) => {
    const nodeId = referenceIds.get(id);
    return nodeId ? `@[node:${nodeId}]` : token;
  });
  const generation: CanvasNodeData = {
    id: nanoid(), type: 'config', title: labels.generation,
    position: { x: 560, y: 180 }, width: 340, height: 280,
    metadata: {
      generationMode: mediaType, model: model.id, composerContent: prompt, prompt, status: 'idle',
      size: input.ratio, seed: input.seed, negativePrompt: input.negativePrompt,
      ...(mediaType === 'image'
        ? { generationType: nodes.length ? 'edit' : 'generation', imageResolution: input.resolution, imageVersion: input.quality, quality: input.quality, count: 1 }
        : { seconds: input.duration === undefined ? undefined : String(input.duration), vquality: input.resolution, generateAudio: String(Boolean(input.sound)) }),
    },
  };
  return {
    ...createEmptyCanvasProject('', labels.untitled),
    nodes: [...nodes, generation],
    connections: nodes.map((node) => ({ id: nanoid(), fromNodeId: node.id, toNodeId: generation.id })),
    viewport: { x: 80, y: 80, k: 0.85 },
  };
}
