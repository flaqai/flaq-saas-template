'use client';

import { ChangeEvent, useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { HexColorPicker } from 'react-colorful';
import { useDebouncedCallback } from 'use-debounce';

import { ColorItemType } from '@/types/client';

import './styles/react-colorful.css';

import { hexToRgb, rgbToHex } from '@/lib/utils/stringUtils';

type RGBColorType = 'red' | 'green' | 'blue';

function RGBInput({
  hexColor,
  updateColor,
}: {
  hexColor: string;
  updateColor: (rgbColor: { [K in RGBColorType]: number }) => void;
}) {
  const [rgb, setRGB] = useState({ red: 0, green: 0, blue: 0 });

  const updateColorDebounced = useDebouncedCallback((color: RGBColorType, numValue: number) => {
    updateColor({ ...rgb, [color]: numValue });
  }, 300);

  const handleColorChange = (color: RGBColorType, value: string) => {
    const numValue = Math.min(255, Math.max(0, Number(value) || 0));
    setRGB((prev) => ({ ...prev, [color]: numValue }));
    updateColorDebounced(color, numValue);
  };

  useEffect(() => {
    const [red, green, blue] = hexToRgb(hexColor);
    setRGB({ red, green, blue });

    return () => {};
  }, [hexColor]);

  return (
    <div className='flex h-[18px] w-full shrink-0 items-center justify-between gap-2 text-xs'>
      <label htmlFor='red' className='flex flex-1 items-center gap-px'>
        <div className='text-white/40'>R</div>
        <input
          id='red'
          type='number'
          min='0'
          max='255'
          value={rgb.red}
          onChange={(e) => handleColorChange('red', e.target.value)}
          className='hide-number-input flex-1 rounded-sm bg-white/10 text-center'
        />
      </label>
      <label htmlFor='green' className='flex flex-1 items-center gap-px'>
        <div className='text-white/40'>G</div>
        <input
          id='green'
          type='number'
          min='0'
          max='255'
          value={rgb.green}
          onChange={(e) => handleColorChange('green', e.target.value)}
          className='hide-number-input flex-1 rounded-sm bg-white/10 text-center'
        />
      </label>
      <label htmlFor='blue' className='flex flex-1 items-center gap-px'>
        <div className='text-white/40'>B</div>
        <input
          id='blue'
          type='number'
          min='0'
          max='255'
          value={rgb.blue}
          onChange={(e) => handleColorChange('blue', e.target.value)}
          className='hide-number-input flex-1 rounded-sm bg-white/10 text-center'
        />
      </label>
    </div>
  );
}

export default function ColorEditBoard({
  id,
  defaultColor,
  onChange,
  onClose,
}: {
  id: string;
  defaultColor: string;
  onChange: (colorItem: ColorItemType) => void;
  onClose: () => void;
}) {
  const [color, setColor] = useState(defaultColor);
  const [hexColor, setHexColor] = useState(`#${defaultColor.slice(1).toLowerCase()}`);

  const onHexColorChangeDebounced = useDebouncedCallback((newColor: string) => {
    setColor(`#${newColor}`);
    onChange({ id, color: `#${newColor}` });
  }, 300);

  const handleChangeColor = (newColor: string) => {
    setColor(newColor);
    setHexColor(newColor);
    onChange({ id, color: newColor });
  };

  const onHexColorChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setHexColor(`#${e.target.value}`);
    if (e.target.value.length === 6) {
      onHexColorChangeDebounced(e.target.value);
    }
  };

  const rgbColorUpdate = (rgb: { [K in RGBColorType]: number }) => {
    const newHexColor = rgbToHex(rgb.red, rgb.green, rgb.blue);
    setColor(newHexColor);
    setHexColor(newHexColor);
    onChange({ id, color: newHexColor });
  };

  return (
    <div className='relative flex h-[140px] flex-1 flex-col gap-1'>
      <button type='button' onClick={onClose} className='absolute -right-4 -top-4 z-20 rounded-full bg-card-black p-1'>
        <X className='size-4' />
      </button>
      <HexColorPicker
        color={color}
        onChange={handleChangeColor}
        style={{ width: '100%', height: '100%' }}
        className='react-colorful-component'
      />
      <input
        type='text'
        value={hexColor.slice(1)}
        onChange={onHexColorChange}
        className='h-6 shrink-0 rounded-sm bg-white/10 text-center text-sm'
      />
      <RGBInput hexColor={color} updateColor={rgbColorUpdate} />
    </div>
  );
}
