import { CanvasWorkspace } from '@/components/infinite-canvas/integration/canvas-workspace';

export default async function CanvasProjectPage({ params }: { readonly params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  return <CanvasWorkspace mode='editor' projectId={projectId} />;
}
