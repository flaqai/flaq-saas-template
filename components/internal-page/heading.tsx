export default function Heading({
  title,
  description,
  showComingSoon = false,
  align = 'center',
}: {
  title: string;
  description: string;
  showComingSoon?: boolean;
  align?: 'left' | 'center';
}) {
  return (
    <div className={`flex flex-col gap-2 ${align === 'left' ? 'w-full items-start text-left' : 'mx-auto max-w-5xl items-center text-center'}`}>
      <div className='flex items-center gap-3'>
        <h1 className='text-balance text-color-main text-4xl font-semibold lg:text-5xl'>{title}</h1>
        {showComingSoon && (
          <span className='rounded-full bg-gradient-to-r from-[#6e51ff] to-[#e75df1] px-4 py-1 text-sm font-medium text-white'>
            Coming Soon
          </span>
        )}
      </div>
      <p className={`text-balance text-sm lg:text-lg ${align === 'left' ? 'w-full' : 'max-w-5xl'}`}>{description}</p>
    </div>
  );
}
