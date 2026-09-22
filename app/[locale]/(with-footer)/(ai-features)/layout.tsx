export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className='min-h-[calc(100dvh-64px)] min-w-0 flex-1 overflow-x-hidden'>
      {children}
    </div>
  );
}
