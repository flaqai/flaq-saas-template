import Navigation from '@/components/home/Navigation';

export default function CanvasLayout({ children }: { readonly children: React.ReactNode }) {
  return <div className='canvas-workspace min-h-dvh'><Navigation />{children}</div>;
}
