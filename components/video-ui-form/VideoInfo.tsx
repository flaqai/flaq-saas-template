import useVideoFormStore from '@/store/form/useVideoFormStore';

export default function VideoInfo() {
  const { videoObj } = useVideoFormStore();

  return (
    <div className='absolute bottom-1 left-0 flex h-26 w-full items-center gap-1 px-1'>
      <div className='border-main-gray bg-card-black h-full flex-1 overflow-auto rounded-lg border p-2 text-sm text-white/70'>
        {videoObj?.prompt}
      </div>
    </div>
  );
}
