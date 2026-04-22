export default function NoData(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' width={60} height={60} viewBox='0 0 60 60' fill='none' {...props}>
      <g clipPath='url(#clip0_2001_17297)'>
        <rect
          x={0.5}
          y={0.5}
          width={59}
          height={59}
          rx={15.5}
          fill='url(#paint0_linear_2001_17297)'
          stroke='url(#paint1_linear_2001_17297)'
        />
        <g opacity={0.2} filter='url(#filter0_f_2001_17297)'>
          <ellipse cx={35} cy={69} rx={59} ry={13} fill='#FB4DFF' />
        </g>
        <path
          d='M46.7154 16.2388C48.9451 17.3101 50.048 19.7399 50.048 22.2137V42.7762C50.048 45.1096 47.8631 47.0012 45.168 47.0012H15.8878C13.1927 47.0012 11.0078 45.1096 11.0078 42.7762V34.7592C11.0078 32.1769 12.215 29.6117 14.6608 28.7833C16.1752 28.2705 17.8235 27.9889 19.5479 27.9889C20.7839 27.9889 21.9814 27.4316 22.6483 26.3908C25.9337 21.2634 31.5152 14.2578 37.8479 14.2578C41.0652 14.2578 44.0885 14.9766 46.7154 16.2388Z'
          fill='white'
          fillOpacity={0.05}
        />
        <g filter='url(#filter1_i_2001_17297)'>
          <path
            d='M43.4926 19.0531C45.9164 19.9422 47.125 22.4889 47.125 25.0706V40.9032C47.125 42.6135 45.3901 44 43.25 44H18C15.8599 44 14.125 42.6135 14.125 40.9032V36.3164C14.125 33.6285 15.5358 31.1409 18.1681 30.5967C19.8323 30.2526 21.5992 30.0645 22.9062 30.0645C23.8952 30.0645 24.8556 29.6352 25.3869 28.8011C27.9981 24.7011 32.4209 18 37.4375 18C39.5985 18 41.6493 18.377 43.4926 19.0531Z'
            fill='black'
            fillOpacity={0.1}
          />
        </g>
        <path
          d='M17.5562 14.7781C17.5562 16.8647 15.8647 18.5562 13.7781 18.5562C11.6915 18.5562 10 16.8647 10 14.7781C10 12.6915 11.6915 11 13.7781 11C15.8647 11 17.5562 12.6915 17.5562 14.7781Z'
          fill='white'
          fillOpacity={0.05}
        />
      </g>
      <defs>
        <filter
          id='filter0_f_2001_17297'
          x={-39.1}
          y={40.9}
          width={148.2}
          height={56.2}
          filterUnits='userSpaceOnUse'
          colorInterpolationFilters='sRGB'
        >
          <feFlood floodOpacity={0} result='BackgroundImageFix' />
          <feBlend mode='normal' in='SourceGraphic' in2='BackgroundImageFix' result='shape' />
          <feGaussianBlur stdDeviation={7.55} result='effect1_foregroundBlur_2001_17297' />
        </filter>
        <filter
          id='filter1_i_2001_17297'
          x={14.125}
          y={18}
          width={33}
          height={26}
          filterUnits='userSpaceOnUse'
          colorInterpolationFilters='sRGB'
        >
          <feFlood floodOpacity={0} result='BackgroundImageFix' />
          <feBlend mode='normal' in='SourceGraphic' in2='BackgroundImageFix' result='shape' />
          <feColorMatrix
            in='SourceAlpha'
            type='matrix'
            values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'
            result='hardAlpha'
          />
          <feOffset />
          <feGaussianBlur stdDeviation={2} />
          <feComposite in2='hardAlpha' operator='arithmetic' k2={-1} k3={1} />
          <feColorMatrix type='matrix' values='0 0 0 0 0.084847 0 0 0 0 0 0 0 0 0 0.0834329 0 0 0 0.25 0' />
          <feBlend mode='normal' in2='shape' result='effect1_innerShadow_2001_17297' />
        </filter>
        <linearGradient id='paint0_linear_2001_17297' x1={30} y1={0} x2={30} y2={60} gradientUnits='userSpaceOnUse'>
          <stop stopColor='white' stopOpacity={0.1} />
          <stop offset={1} stopColor='white' stopOpacity={0.05} />
        </linearGradient>
        <linearGradient id='paint1_linear_2001_17297' x1={30} y1={0} x2={30} y2={60} gradientUnits='userSpaceOnUse'>
          <stop stopColor='#212121' />
          <stop offset={1} />
        </linearGradient>
        <clipPath id='clip0_2001_17297'>
          <rect width={60} height={60} rx={16} fill='white' />
        </clipPath>
      </defs>
    </svg>
  );
}
