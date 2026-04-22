export default function Heading({
  title,
  description,
  showComingSoon = false,
}: {
  title: string;
  description: string;
  showComingSoon?: boolean;
}) {
  return (
    <div className='mx-auto flex max-w-5xl flex-col items-center gap-2 text-center'>
      <div className='flex items-center gap-3'>
        <h1 className='text-balance text-color-main text-4xl font-semibold lg:text-5xl'>{title}</h1>
        {showComingSoon && (
          <span className='rounded-full bg-gradient-to-r from-[#6e51ff] to-[#e75df1] px-4 py-1 text-sm font-medium text-white'>
            Coming Soon
          </span>
        )}
      </div>
      <p className='text-balance max-w-5xl text-sm lg:text-lg'>{description}</p>
    </div>
  );
}
