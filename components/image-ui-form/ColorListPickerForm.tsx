'use client';

/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-param-reassign */
/* eslint-disable react/no-array-index-key */
import { memo, useRef, useState } from 'react';
import { produce } from 'immer';
import { Check, Dices, Plus, Trash2, X } from 'lucide-react';
import { nanoid } from 'nanoid';
import { useFormContext } from 'react-hook-form';

import { ColorItemType } from '@/types/client';
import { cn } from '@/lib/utils';
import { numberList } from '@/lib/utils/arrayUtils';
import { generateRandomHexColor } from '@/lib/utils/stringUtils';
import { FormField, FormItem } from '@/components/ui/form';

import Box from './Box';
import ColorEditBoard from './ColorEditBoard';

const defaultRandomColorList: ColorItemType[][] = [
  [
    { id: 'random-1', color: '#d8baa1' },
    { id: 'random-2', color: '#3a6488' },
    { id: 'random-3', color: '#e66d44' },
    { id: 'random-4', color: '#344646' },
  ],
  [
    { id: 'random-5', color: '#3C7027' },
    { id: 'random-6', color: '#81BD85' },
    { id: 'random-7', color: '#40938C' },
    { id: 'random-8', color: '#0D475D' },
  ],
  [
    { id: 'random-9', color: '#04454B' },
    { id: 'random-10', color: '#028288' },
    { id: 'random-11', color: '#ABCFDA' },
    { id: 'random-12', color: '#DBE2EA' },
    { id: 'random-13', color: '#D6CDC4' },
  ],
];

const colorList: ColorItemType[] = [
  { id: 'color-1', color: '#FF0000' },
  { id: 'color-2', color: '#FFA500' },
  { id: 'color-3', color: '#FFFF00' },
  { id: 'color-4', color: '#008000' },
  { id: 'color-5', color: '#0000FF' },
  { id: 'color-6', color: '#4B0082' },
  { id: 'color-7', color: '#EE82EE' },
  { id: 'color-8', color: '#A52A2A' },
  { id: 'color-9', color: '#D2691E' },
  { id: 'color-10', color: '#FF4500' },
  { id: 'color-11', color: '#FFD700' },
  { id: 'color-12', color: '#ADFF2F' },
  { id: 'color-13', color: '#87CEEB' },
  { id: 'color-14', color: '#9400D3' },
  { id: 'color-15', color: '#FF1493' },
  { id: 'color-16', color: '#00BFFF' },
  { id: 'color-17', color: '#00FF7F' },
  { id: 'color-18', color: '#FF6347' },
  { id: 'color-19', color: '#FF69B4' },
  { id: 'color-20', color: '#8A2BE2' },
];

function ControlButton({
  children,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type='button'
      className='flex size-8 items-center justify-center rounded-sm bg-white/10 text-white/20 hover:text-white disabled:cursor-not-allowed disabled:text-white/10'
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

function ColorItemComponent({
  id,
  color,
  isEditDelete,
  isEditColor,
  onDelete,
  onEdit,
}: {
  id: string;
  color: string;
  isEditDelete?: boolean;
  isEditColor?: boolean;
  onDelete?: (id: string) => void;
  onEdit?: (item: ColorItemType | null) => void;
}) {
  const onClickColorItem = () => {
    if (isEditDelete) return;
    if (isEditColor && onEdit) {
      onEdit(null);
      return;
    }
    if (onEdit) {
      onEdit({ id, color });
    }
  };

  return (
    <div
      onClick={onClickColorItem}
      style={{ backgroundColor: color }}
      className={cn(
        'flex size-8 items-center justify-center rounded hover:cursor-pointer hover:outline-solid hover:outline-1 hover:outline-white',
        (isEditDelete || isEditColor) && 'border border-white outline-solid outline-1 outline-white',
      )}
    >
      {isEditDelete && (
        <button type='button' className='rounded-full bg-[#363E41]' onClick={() => onDelete?.(id)}>
          <X className='size-4 ' />
        </button>
      )}
    </div>
  );
}

const ColorItem = memo(ColorItemComponent);

function RandomColorPicker({ refreshColor }: { refreshColor: (colorItem: ColorItemType[]) => void }) {
  const [randomColorList, setRandomColorList] = useState(defaultRandomColorList);

  const setRandomColor = () => {
    setRandomColorList(
      numberList(3).map(() => {
        const randomNum = Math.floor(Math.random() * 7) + 2;
        return numberList(randomNum).map(() => ({ id: nanoid(), color: generateRandomHexColor() }));
      }),
    );
  };

  return (
    <div className='flex flex-1 flex-col gap-1'>
      {randomColorList.map((el) => (
        <button
          type='button'
          key={el.map((item) => item.id).join('-')}
          onClick={() => refreshColor(el.map((color) => ({ id: color.id, color: color.color })))}
          className='flex h-8 w-full overflow-hidden rounded-sm hover:outline-solid hover:outline-1 hover:outline-white'
        >
          {el.map((item) => (
            <div key={item.id} style={{ backgroundColor: item.color }} className='h-full flex-1' />
          ))}
        </button>
      ))}
      <button
        type='button'
        onClick={setRandomColor}
        className='flex h-8 w-full items-center justify-center rounded-sm bg-white/10 text-white/40 hover:text-white'
      >
        <Dices className='size-4' />
      </button>
    </div>
  );
}

export default function ColorListPickerForm({ name, max = 10 }: { name: string; max?: number }) {
  const methods = useFormContext<{ [key: string]: { id: string; color: string }[] }>();
  const [isEditDelete, setIsEditDelete] = useState(false);
  const [editColorItem, setEditColorItem] = useState<ColorItemType | null>(null);
  const indexRef = useRef(0);

  const handleAddColor = () => {
    const prevList = methods.getValues(name);
    if (prevList?.length) {
      methods.setValue(
        name,
        produce(prevList, (draft) => {
          draft.push({ id: colorList[indexRef.current].id, color: colorList[indexRef.current].color });
        }),
      );
    } else {
      methods.setValue(name, [{ id: colorList[indexRef.current].id, color: colorList[indexRef.current].color }]);
    }
    indexRef.current += 1;
  };

  const handleRefreshColor = (colorItem: ColorItemType[]) => {
    methods.setValue(name, colorItem);
  };

  const toggleDeleteMode = () => {
    setIsEditDelete(!isEditDelete);
    if (!isEditDelete) {
      setEditColorItem(null);
    }
  };

  const onCloseEditBoard = () => {
    setEditColorItem(null);
  };

  const openEdit = (item: ColorItemType | null) => {
    setEditColorItem(item);
  };

  const updateColorById = (colorItem: ColorItemType) => {
    methods.setValue(
      name,
      produce(methods.getValues(name), (draft) => {
        const idx = draft.findIndex((el) => el.id === colorItem.id);
        if (idx !== -1) {
          draft[idx].color = colorItem.color;
        }
      }),
    );
  };

  const deleteColorById = (id: string) => {
    const newList = produce(methods.getValues(name), (draft) => {
      const idx = draft.findIndex((el) => el.id === id);
      if (idx !== -1) {
        draft.splice(idx, 1);
      }
    });
    methods.setValue(name, newList);
    if (newList.length === 0) {
      setIsEditDelete(false);
      indexRef.current = 0;
    }
  };

  return (
    <div className='flex gap-2.5'>
      <Box className='h-auto shrink-0 p-2'>
        <FormField
          control={methods.control}
          name={name}
          render={({ field }) => (
            <FormItem className='mb-auto grid grid-cols-3 gap-1 space-y-0'>
              {field.value?.map((el) => (
                <ColorItem
                  key={el.id}
                  id={el.id}
                  color={el.color}
                  isEditDelete={isEditDelete}
                  isEditColor={editColorItem?.id === el.id}
                  onDelete={deleteColorById}
                  onEdit={openEdit}
                />
              ))}
              {(field.value?.length < max || !field.value) && !isEditDelete && (
                <ControlButton onClick={handleAddColor}>
                  <Plus />
                </ControlButton>
              )}
              <ControlButton onClick={toggleDeleteMode} disabled={!field.value || field.value?.length === 0}>
                {isEditDelete ? <Check className='size-4' /> : <Trash2 className='size-4' />}
              </ControlButton>
            </FormItem>
          )}
        />
      </Box>
      <Box className='h-auto flex-1 p-2'>
        {editColorItem ? (
          <ColorEditBoard
            key={editColorItem.id}
            id={editColorItem.id}
            defaultColor={editColorItem.color}
            onChange={updateColorById}
            onClose={onCloseEditBoard}
          />
        ) : (
          <RandomColorPicker refreshColor={handleRefreshColor} />
        )}
      </Box>
    </div>
  );
}
