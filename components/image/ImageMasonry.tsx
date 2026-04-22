'use client';

/* eslint-disable @typescript-eslint/indent */
// import Link from 'next/link';
import { ComponentProps, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { ImageResponseVo } from '@/network/generation/client';
import { deleteImageById } from '@/network/image/client';
import { Masonry } from 'react-plock';
import { toast } from 'sonner';

import { cn } from '@/lib/utils';

import ImageWithPlaiceholder from './ImageWithPlaiceholder';

const ConfirmDialog = dynamic(() => import('@/components/dialog/ConfirmDialog'), { ssr: false });

type Props = {
  imageList: ImageResponseVo[];
  route?: string;
  className?: string;
  imageClassName?: string;
  config?: ComponentProps<typeof Masonry>['config'];
  deleteCb?: () => void;
  onImageClick?: (image: ImageResponseVo) => void;
};

export default function ImageMasonry({ imageList, route, className, imageClassName, config, deleteCb, onImageClick }: Props) {
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const idToDeleteRef = useRef('');

  const setIdToDeleteAndOpen = (id: string) => {
    idToDeleteRef.current = id;
    setOpenConfirmDialog(true);
  };

  const openDialog = (open: boolean) => {
    if (!open) {
      idToDeleteRef.current = '';
    }
    setOpenConfirmDialog(open);
  };

  const deleteImage = async () => {
    try {
      const res = await deleteImageById(idToDeleteRef.current);
      if (res.code !== 200) {
        toast.error(res.msg);
        return;
      }
      toast.success(res.msg);
      if (deleteCb) {
        deleteCb();
      }
    } catch (error: any) {
      toast.error(error);
    }
  };

  return (
    <>
      <Masonry
        items={imageList}
        className={cn(className)}
        config={
          config || {
            columns: [2, 6],
            gap: [12, 20],
            media: [768, 1709],
          }
        }
        render={(image) => (
          <ImageWithPlaiceholder
            key={image.id}
            id={image.id}
            route={route}
            src={image.thumbnailUrl}
            alt={image.title || 'Image'}
            title={image.title || 'Image'}
            className={imageClassName}
            onDelete={setIdToDeleteAndOpen}
            showDeleteBtn={!!deleteCb}
            onClick={() => onImageClick?.(image)}
            isFailed={!image.url || !image.thumbnailUrl}
          />
        )}
      />
      {!!deleteCb && <ConfirmDialog open={openConfirmDialog} setOpen={openDialog} callback={deleteImage} />}
    </>
  );
}
