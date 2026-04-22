'use client';

import { Clock3, Scaling, Mic, ImageIcon, Music4, Palette } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getModelIcon } from '@/lib/utils/modelIcons';

interface ModelFeature {
  icon: 'duration' | 'resolution' | 'audio' | 'sound' | 'bgm' | 'style' | 'endFrame';
  label: string;
}

interface ModelSelectItemProps {
  value: string;
  label: string;
  features: ModelFeature[];
  isSelected?: boolean;
  isDisabled?: boolean;
  showComingSoon?: boolean;
  onClick?: () => void;
}

export default function ModelSelectItem({
  value,
  label,
  features,
  isSelected,
  isDisabled = false,
  showComingSoon = false,
  onClick,
}: ModelSelectItemProps) {
  // 根据feature类型渲染对应的图标
  const renderFeatureIcon = (iconType: string) => {
    switch (iconType) {
      case 'duration':
        return <Clock3 className='w-3.5 h-3.5' />;
      case 'resolution':
        return <Scaling className='w-3.5 h-3.5' />;
      case 'audio':
        return <Mic className='w-3.5 h-3.5' />;
      case 'sound':
        return <Mic className='w-3.5 h-3.5' />;
      case 'bgm':
        return <Music4 className='w-3.5 h-3.5' />;
      case 'style':
        return <Palette className='w-3.5 h-3.5' />;
      case 'endFrame':
        return <ImageIcon className='w-3.5 h-3.5' />;
      default:
        return null;
    }
  };

  return (
    <div
      className={cn(
        'flex flex-col gap-3 p-2 w-full min-w-full max-w-full box-border border-b border-white/10 cursor-pointer',
        isSelected && 'bg-white/5',
        isDisabled && 'opacity-60 cursor-not-allowed',
      )}
      onClick={!isDisabled ? onClick : undefined}
      onKeyDown={(e) => {
        if (!isDisabled && onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      }}
      tabIndex={isDisabled ? -1 : 0}
      role='button'
      aria-pressed={isSelected}
    >
      <div className='flex items-start justify-between'>
        <div className='flex-1'>
          {/* 模型图标、模型名称、radio 图标同一行，两端对齐 */}
          <div className='flex items-center justify-between mb-1'>
            <div className='flex items-center gap-2'>
              {/* 模型图标 */}
              {getModelIcon(value) ? (
                <img
                  src={getModelIcon(value)}
                  alt={value}
                  className='w-5 h-5 flex-shrink-0'
                />
              ) : (
                <div className='w-5 h-5 flex-shrink-0' />
              )}
              <h3 className='text-base font-medium text-white'>{label}</h3>
              {/* Coming Soon 标识 */}
              {showComingSoon && (
                <span className='text-xs text-[#7D52FF] bg-[#f3eeff] px-2 py-0.5 rounded'>
                  Coming Soon
                </span>
              )}
            </div>
            {/* radio 样式 */}
            <div className='flex-shrink-0'>
              {isSelected ? (
                <div className='flex w-5 h-5 items-center justify-center rounded-full border-2 border-[#427cf1] bg-[#427cf1]'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='12'
                    height='12'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='white'
                    strokeWidth='3'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    className='lucide lucide-check'
                  >
                    <path d='M20 6 9 17l-5-5' />
                  </svg>
                </div>
              ) : (
                <div className='w-5 h-5 rounded-full border border-white/20 flex items-center justify-center' />
              )}
            </div>
          </div>
          {/* 渲染模型特性图标 */}
          <div className='flex flex-wrap gap-2'>
            {features.map((feature, index) => (
              <div
                key={index}
                className='flex items-center gap-1 border border-white/10 rounded-md px-2 py-1 text-xs text-white/70'
              >
                {renderFeatureIcon(feature.icon)}
                {feature.label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
