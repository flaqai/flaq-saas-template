import { CanvasWorkspace } from '@/components/infinite-canvas/integration/canvas-workspace';

import AICanvasPublicSections from './_components/AICanvasPublicSections';

export default function CanvasPage() {
  return (
    <CanvasWorkspace mode='landing'>
      <AICanvasPublicSections />
    </CanvasWorkspace>
  );
}
