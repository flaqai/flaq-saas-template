export default function FormTitle({ title }: { title: string }) {
  return (
    <div title={title} className='line-clamp-1 shrink-0 px-2 text-lg font-medium tracking-[0.36px]'>
      {title}
    </div>
  );
}
