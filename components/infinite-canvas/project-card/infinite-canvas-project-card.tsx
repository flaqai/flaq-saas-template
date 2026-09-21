'use client';

import { Download, Ellipsis, Pencil, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import type { InfiniteCanvasProjectCardProps } from './infinite-canvas-project-card.types';
import { formatInfiniteCanvasProjectTime } from './infinite-canvas-project-time';

export function InfiniteCanvasProjectCard({
  actions,
  imageUrl,
  preview,
  labels,
  locale,
  mobileActions,
  onOpen,
  onSelectedChange,
  project,
  selected = false,
  variant,
}: InfiniteCanvasProjectCardProps) {
  const selectable = onSelectedChange !== undefined;

  return (
    <article
      className={`group h-full overflow-hidden rounded-2xl border bg-light-gray transition hover:-translate-y-0.5 hover:border-main-color hover:shadow-xl hover:shadow-main-color/5 ${
        selected ? 'border-main-color shadow-md shadow-main-color/10' : 'border-light-gray-2'
      }`}
    >
      <div className='relative'>
        {preview ?? <ProjectPreview variant={variant} imageUrl={imageUrl} alt={project.title} />}
        <button
          type='button'
          aria-label={`${labels.open}: ${project.title}`}
          onClick={onOpen}
          className='absolute inset-0 z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-main-color'
        />
        {selectable ? (
          <Checkbox
            aria-label={project.title}
            checked={selected}
            onCheckedChange={(checked) => onSelectedChange(checked === true)}
            className={`absolute z-20 border-light-gray-2 bg-background-color data-[state=checked]:border-main-color data-[state=checked]:bg-main-color data-[state=checked]:text-gradient-main-foreground ${mobileActions ? 'left-3 top-3 size-10 rounded-xl sm:left-4 sm:top-4 sm:size-5 sm:rounded-md' : 'left-4 top-4 size-5 rounded-md'}`}
          />
        ) : null}
        {mobileActions ? (
          <Button
            type='button'
            variant='ghost'
            size='icon'
            aria-label={`${mobileActions.label}: ${project.title}`}
            aria-haspopup='dialog'
            className='absolute right-3 top-3 z-20 size-10 rounded-xl border border-light-gray-2 bg-light-gray-1 text-text-color hover:bg-light-gray-2'
            onClick={mobileActions.onOpen}
          >
            <Ellipsis className='size-5' aria-hidden='true' />
          </Button>
        ) : actions !== undefined ? (
          <div className='absolute right-3 top-3 z-20 flex gap-1.5 opacity-100 shadow-lg backdrop-blur transition sm:translate-y-1 sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100 sm:group-focus-within:translate-y-0 sm:group-focus-within:opacity-100'>
            <Button
              type='button'
              variant='ghost'
              size='icon'
              aria-label={actions.renameLabel}
              className='size-8 bg-gradient-main text-main-color-foreground hover:opacity-80 rounded-lg'
              onClick={actions.onRename}
            >
              <Pencil className='size-4' />
            </Button>
            <Button
              type='button'
              variant='ghost'
              size='icon'
              aria-label={actions.exportLabel}
              className='size-8 bg-gradient-main text-main-color-foreground hover:opacity-80 rounded-lg'
              onClick={actions.onExport}
            >
              <Download className='size-4' />
            </Button>
            <Button
              type='button'
              variant='ghost'
              size='icon'
              aria-label={actions.deleteLabel}
              className='size-8 bg-gradient-main text-main-color-foreground hover:opacity-80 rounded-lg'
              onClick={actions.onDelete}
            >
              <Trash2 className='size-4' />
            </Button>
          </div>
        ) : null}
      </div>
      <div className={`p-4 ${mobileActions ? 'h-20 sm:h-[98px]' : 'h-[98px]'}`}>
        <h3 className='truncate mb-2 text-base font-medium text-text-color'>{project.title}</h3>
        <p className='truncate text-xs text-gray-color'>
          {project.nodeCount} {labels.nodeCount} · {project.connectionCount} {labels.connectionCount} · {labels.updated}{' '}
          {formatInfiniteCanvasProjectTime(project.updatedAt, locale)}
        </p>
      </div>
    </article>
  );
}

export function ProjectPreview({
  alt = '',
  imageUrl,
  variant,
}: {
  readonly alt?: string;
  readonly imageUrl?: string;
  readonly variant: number;
}) {
  const normalizedImageUrl = imageUrl?.trim();
  if (normalizedImageUrl) {
    return (
      <div className='relative aspect-[16/9] overflow-hidden border-b border-light-gray-2 bg-background-color'>
        <img src={normalizedImageUrl} alt={alt} className='size-full object-cover' loading='lazy' decoding='async' />
      </div>
    );
  }

  const alignRight = variant % 2 === 0;
  return (
    <div className='relative aspect-[16/9] overflow-hidden border-b border-light-gray-2 bg-background-color'>
      <div className='absolute inset-0 bg-main-color/15' />
      <div
        className={`absolute -top-[45%] aspect-square w-3/5 rounded-full bg-main-color/60 ${alignRight ? '-left-1/20' : '-right-1/20'}`}
      />
      <div
        className={`absolute -bottom-1/5 aspect-square w-2/5 rounded-full bg-hot-color/35 ${alignRight ? '-right-1/10' : '-left-1/10'}`}
      />
      <div
        className={`absolute top-[22%] flex h-[35%] w-2/5 flex-col justify-center gap-2 rounded-lg border border-light-gray-2 bg-background-color px-[5%] ${alignRight ? 'right-[6%]' : 'left-[6%]'}`}
      >
        <div className='h-1.5 w-3/4 rounded-full bg-text-color/60' />
        <div className='h-1 w-1/2 rounded-full bg-text-color/30' />
      </div>
      <div
        className={`absolute bottom-[15%] h-[32%] w-[45%] rounded-lg border border-main-color/35 bg-light-gray/60 p-[5%] ${alignRight ? 'left-[4%]' : 'right-[4%]'}`}
      >
        <div className='size-2 rounded-full bg-main-color' />
      </div>
    </div>
  );
}
