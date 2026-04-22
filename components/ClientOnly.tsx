import dynamic from 'next/dynamic';

function ClientOnly({ children }: { children: React.ReactNode }) {
  return children;
}

export default dynamic(() => Promise.resolve(ClientOnly), {
  ssr: false,
});
