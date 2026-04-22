'use client';

/* eslint-disable operator-assignment */
import { useCallback, useEffect, useRef, useState } from 'react';
import { Brush, Eraser, Redo2, Undo2 } from 'lucide-react';

// import { useThrottledCallback } from 'use-debounce';

import { cn } from '@/lib/utils';
import useMouseMove from '@/hooks/use-mouse-move';

import RangeInput from '../range-input';

export default function InpaintingCanvas({
  image,
  className,
  onMaskGenerated,
}: {
  image: string;
  className?: string;
  onMaskGenerated?: (maskDataUrl: string) => void;
}) {
  const imageCanvasRef = useRef<HTMLCanvasElement>(null);
  const maskCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<'brush' | 'eraser'>('brush');
  const [lineWidth, setLineWidth] = useState(60);
  const lastPos = useRef<{ x: number; y: number } | null>(null);
  const historyRef = useRef<ImageData[]>([]);
  const historyIndexRef = useRef(-1);
  const divRef = useRef<HTMLDivElement>(null);
  const { mousePosition, isVisible } = useMouseMove(divRef);

  const generateMask = () => {
    const maskCanvas = maskCanvasRef.current;
    if (!maskCanvas || !onMaskGenerated) return;

    // Convert the mask to black and white
    const maskCtx = maskCanvas.getContext('2d');
    if (!maskCtx) return;

    const imageData = maskCtx.getImageData(0, 0, maskCanvas.width, maskCanvas.height);
    const { data } = imageData;

    // Convert semi-transparent purple to white, and transparent to black
    for (let i = 0; i < data.length; i += 4) {
      const alpha = data[i + 3];
      data[i] = alpha ? 255 : 0; // R
      data[i + 1] = alpha ? 255 : 0; // G
      data[i + 2] = alpha ? 255 : 0; // B
      data[i + 3] = 255; // A
    }

    // Create temporary canvas for the mask
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = maskCanvas.width;
    tempCanvas.height = maskCanvas.height;
    const tempCtx = tempCanvas.getContext('2d');
    tempCtx?.putImageData(imageData, 0, 0);

    onMaskGenerated(tempCanvas.toDataURL());
  };

  const saveState = () => {
    const maskCtx = maskCanvasRef.current?.getContext('2d');
    if (!maskCtx) return;

    const imageData = maskCtx.getImageData(0, 0, maskCtx.canvas.width, maskCtx.canvas.height);

    // Remove any redo states
    historyRef.current = historyRef.current.slice(0, historyIndexRef.current + 1);
    historyRef.current.push(imageData);
    historyIndexRef.current = historyIndexRef.current + 1;
  };

  // Initialize canvases
  useEffect(() => {
    const img = new Image();
    img.src = image;
    img.onload = () => {
      const imageCanvas = imageCanvasRef.current;
      const maskCanvas = maskCanvasRef.current;
      if (!imageCanvas || !maskCanvas) return;

      // Set both canvases to image dimensions
      imageCanvas.width = img.width;
      imageCanvas.height = img.height;
      maskCanvas.width = img.width;
      maskCanvas.height = img.height;

      // Draw image on image canvas
      const imgCtx = imageCanvas.getContext('2d');
      imgCtx?.drawImage(img, 0, 0);

      // Initialize mask canvas with transparent background
      const maskCtx = maskCanvas.getContext('2d');
      if (maskCtx) {
        maskCtx.fillStyle = 'rgba(0,0,0,0)';
        maskCtx.fillRect(0, 0, maskCanvas.width, maskCanvas.height);
        // Save initial state
        saveState();
      }
    };
  }, [image]);

  const undo = () => {
    if (historyIndexRef.current <= 0) return;

    historyIndexRef.current = historyIndexRef.current - 1;
    const maskCtx = maskCanvasRef.current?.getContext('2d');
    if (!maskCtx) return;

    maskCtx.putImageData(historyRef.current[historyIndexRef.current], 0, 0);
    generateMask();
  };

  const redo = () => {
    if (historyIndexRef.current >= historyRef.current.length - 1) return;

    historyIndexRef.current = historyIndexRef.current + 1;
    const maskCtx = maskCanvasRef.current?.getContext('2d');
    if (!maskCtx) return;

    maskCtx.putImageData(historyRef.current[historyIndexRef.current], 0, 0);
    generateMask();
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const rect = maskCanvasRef.current?.getBoundingClientRect();
    if (rect) {
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      lastPos.current = {
        x: (clientX - rect.left) * (maskCanvasRef.current!.width / rect.width),
        y: (clientY - rect.top) * (maskCanvasRef.current!.height / rect.height),
      };
    }
  };

  const draw = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
      if (!isDrawing || !lastPos.current) return;

      const maskCtx = maskCanvasRef.current?.getContext('2d');
      const rect = maskCanvasRef.current?.getBoundingClientRect();
      if (!maskCtx || !rect) return;

      const scaleX = maskCanvasRef.current!.width / rect.width;
      const scaleY = maskCanvasRef.current!.height / rect.height;
      const scaledLineWidth = lineWidth * ((scaleX + scaleY) / 2); // Average scale for consistent width

      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      const currentPos = {
        x: (clientX - rect.left) * scaleX,
        y: (clientY - rect.top) * scaleY,
      };

      if (tool === 'brush') {
        maskCtx.globalCompositeOperation = 'source-over';
        maskCtx.strokeStyle = 'rgba(0, 0, 0, 1)';
      } else {
        maskCtx.globalCompositeOperation = 'destination-out';
        maskCtx.strokeStyle = 'rgba(0, 0, 0, 1)';
        maskCtx.shadowColor = 'transparent';
        maskCtx.shadowBlur = 0;
      }

      maskCtx.lineCap = 'round';
      maskCtx.lineJoin = 'round';
      maskCtx.lineWidth = scaledLineWidth; // Use the scaled line width

      maskCtx.beginPath();
      maskCtx.moveTo(lastPos.current.x, lastPos.current.y);
      maskCtx.lineTo(currentPos.x, currentPos.y);
      maskCtx.stroke();

      lastPos.current = currentPos;
    },
    [isDrawing, lastPos, tool, lineWidth],
  );

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      saveState();
      generateMask();
    }
  };

  return (
    <div className={cn('relative flex aspect-square w-full flex-col gap-3 lg:aspect-auto', className)}>
      <div
        className='pointer-events-none absolute z-50 -translate-x-1/2 -translate-y-1/2 rounded-full bg-yellow-400 bg-opacity-60'
        style={{
          left: mousePosition.x,
          top: mousePosition.y,
          width: lineWidth,
          height: lineWidth,
          display: isVisible ? 'block' : 'none',
        }}
      />
      <div className='relative flex-1' ref={divRef}>
        <canvas
          ref={imageCanvasRef}
          className='absolute inset-0 left-1/2 top-1/2 max-h-full max-w-full -translate-x-1/2 -translate-y-1/2'
        />
        <canvas
          ref={maskCanvasRef}
          className='absolute inset-0 left-1/2 top-1/2 max-h-full max-w-full -translate-x-1/2 -translate-y-1/2'
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          // eslint-disable-next-line jsx-a11y/mouse-events-have-key-events
          onMouseOut={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          onTouchCancel={stopDrawing}
        />
      </div>
      <div className='bottom-4 left-4 z-10 flex w-full flex-col gap-2 rounded bg-card-black p-2 lg:flex-row lg:gap-16'>
        <div className='flex items-center gap-2'>
          <button
            type='button'
            onClick={undo}
            className='flex size-8 items-center justify-center rounded hover:border hover:border-white/10 hover:bg-white/5'
          >
            <Undo2 className='size-5' strokeWidth={1} />
          </button>
          <button
            type='button'
            onClick={redo}
            className='flex size-8 items-center justify-center rounded hover:border hover:border-white/10 hover:bg-white/5'
          >
            <Redo2 className='size-5' strokeWidth={1} />
          </button>
        </div>
        <div className='flex h-8 items-center gap-2'>
          <div className='flex items-center gap-1 rounded border border-white/10 bg-white/5 p-1'>
            <button
              type='button'
              onClick={() => setTool('brush')}
              className={cn('flex size-6 items-center justify-center rounded', tool === 'brush' && 'bg-white/10')}
            >
              <Brush className='size-4' strokeWidth={1} />
            </button>
            <button
              type='button'
              onClick={() => setTool('eraser')}
              className={cn('flex size-6 items-center justify-center rounded', tool === 'eraser' && 'bg-white/10')}
            >
              <Eraser className='size-4' strokeWidth={1} />
            </button>
          </div>
          <RangeInput min={1} max={100} step={1} defaultValue={lineWidth} onChange={setLineWidth} />
        </div>
      </div>
    </div>
  );
}
