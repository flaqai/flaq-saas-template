import Navigation from '@/components/home/Navigation';
import '@/components/infinite-canvas/integration/canvas.css';

export default function CanvasLayout({ children }: { readonly children: React.ReactNode }) {
  return <div className='canvas-workspace min-h-dvh'><Navigation />{children}</div>;
}
