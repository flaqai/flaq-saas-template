'use client';

import { createContext, useState, useMemo } from 'react';
import type { VideoRequestType } from '@/network/video/useVideoHistory';

export const videoTypeContenxt = createContext<VideoRequestType['videoType']>('Image-to-video');

export const showAllVideoHistoryContext = createContext<boolean>(false);

interface VideoAudioContextType {
  audioDuration: number;
  setAudioDuration: (duration: number) => void;
}

export const videoAudioContext = createContext<VideoAudioContextType>({
  audioDuration: 0,
  setAudioDuration: () => {},
});

export default function VideoContenxtProvider({
  videoType,
  showAllVideoHistory = false,
  children,
}: {
  videoType: VideoRequestType['videoType'];
  showAllVideoHistory?: boolean;
  children: React.ReactNode;
}) {
  const [audioDuration, setAudioDuration] = useState(0);

  const audioContextValue = useMemo(
    () => ({
      audioDuration,
      setAudioDuration,
    }),
    [audioDuration],
  );

  return (
    <videoTypeContenxt.Provider value={videoType}>
      <showAllVideoHistoryContext.Provider value={showAllVideoHistory}>
        <videoAudioContext.Provider value={audioContextValue}>{children}</videoAudioContext.Provider>
      </showAllVideoHistoryContext.Provider>
    </videoTypeContenxt.Provider>
  );
}
