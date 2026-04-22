export default function ContentInfo({ title, content }: { title: string; content: string }) {
  return (
    <div
      title={content}
      className='flex min-h-12 w-full items-center rounded-lg bg-color-5 p-3 leading-6 text-white/70 lg:px-5 lg:py-2'
    >
      {`${title} : ${content}`}
    </div>
  );
}
