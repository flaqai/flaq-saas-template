'use client';

import { Download, Ellipsis, Pencil, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import type { InfiniteCanvasProjectCardProps } from './infinite-canvas-project-card.types';
import { formatInfiniteCanvasProjectTime } from './infinite-canvas-project-time';
import CanvasProjectPlaceholder from './canvas-project-placeholder';

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
  const defaultPreview = preview == null && !imageUrl?.trim();

  return (
    <article
      className={`group relative overflow-hidden rounded-xl border bg-color-c1 transition-colors hover:border-color-main ${defaultPreview ? 'h-[180px]' : 'h-full'} ${
        selected ? 'border-color-main shadow-md shadow-color-main/10' : 'border-color-b1'
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
              className='size-8 bg-color-main text-white hover:bg-color-main/80 hover:text-white rounded-lg'
              onClick={actions.onRename}
            >
              <Pencil className='size-4' />
            </Button>
            <Button
              type='button'
              variant='ghost'
              size='icon'
              aria-label={actions.exportLabel}
              className='size-8 bg-color-main text-white hover:bg-color-main/80 hover:text-white rounded-lg'
              onClick={actions.onExport}
            >
              <Download className='size-4' />
            </Button>
            <Button
              type='button'
              variant='ghost'
              size='icon'
              aria-label={actions.deleteLabel}
              className='size-8 bg-color-main text-white hover:bg-color-main/80 hover:text-white rounded-lg'
              onClick={actions.onDelete}
            >
              <Trash2 className='size-4' />
            </Button>
          </div>
        ) : null}
      </div>
      <div className={defaultPreview ? 'pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-color-bg0 via-color-bg0/85 to-transparent px-3 pb-3 pt-10' : `p-4 ${mobileActions ? 'h-20 sm:h-[98px]' : 'h-[98px]'}`}>
        {defaultPreview ? <div aria-hidden='true' className='mb-2 border-t border-color-b1' /> : null}
        <h3 className='mb-1 truncate text-sm font-medium text-color-t1'>{project.title}</h3>
        <p className='truncate text-xs text-color-t2'>
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

  return (
    <div className='relative h-[124px] overflow-hidden bg-color-c1'>
      <CanvasProjectPlaceholder />
    </div>
  );
}
