import SubHeading from '@/components/internal-page/sub-heading';
import LinkBtn from '@/components/home/new-section/link-btn';

export default function CoreFeaturesCards({
  title,
  description,
  buttonText,
  buttonHref,
  features,
}: {
  title: string;
  description: string;
  buttonText: string;
  buttonHref: string;
  features: {
    title: string;
    description: string;
  }[];
}) {
  return (
    <div className='container-centered container-py'>
      <SubHeading title={title} description={description} />
      
      <div className='mx-auto mt-3 mb-8 flex justify-center'>
        <LinkBtn href={buttonHref} className='w-fit'>
          {buttonText}
        </LinkBtn>
      </div>

      {/* Outer container */}
      <div
        className='mx-auto grid max-w-[1600px] grid-cols-1 gap-3 rounded-[12px] p-6 md:grid-cols-2 md:gap-3 md:p-6'
        style={{ background: '#16171B' }}
      >
        {features.map((feature, index) => (
          <div
            key={index}
            className='min-h-[160px] flex flex-col gap-0 rounded-[12px] p-3 md:p-4'
            style={{ background: '#1C1D22' }}
          >
            {/* Title area */}
            <div className='flex items-center gap-2 mb-2'>
              <div className='h-[20px] w-[4px] flex-shrink-0 rounded-full bg-[#1677FF]' />
              <h3 className='text-[18px] font-semibold leading-[28px] text-white md:text-[20px]'>
                {feature.title}
              </h3>
            </div>

            {/* Divider */}
            <div className='h-px w-full bg-white/10 mb-3 flex-shrink-0' />

            {/* Description */}
            <p className='text-sm font-normal leading-[22px] text-white/70 flex-1'>
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}