'use client';

import ImageHistory from './image-history';

export default function ImageHistoryPc() {
  return (
    <div className='hidden w-[240px] rounded-lg bg-white/5 p-3 lg:flex'>
      <ImageHistory imageNum={10} />
    </div>
  );
}
