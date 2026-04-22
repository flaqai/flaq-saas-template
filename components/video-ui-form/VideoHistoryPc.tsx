'use client';

import VideoHistory from './VideoHistory';

export default function VideoHistoryPc() {
  return (
    <div className='hidden h-full w-[276px] flex-col rounded-lg bg-white p-3 lg:flex'>
      <VideoHistory itemNum={10} />
    </div>
  );
}
