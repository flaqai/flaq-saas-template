'use client';

import { useState } from 'react';
import { useController } from 'react-hook-form';

import { Checkbox } from './ui/checkbox';

export default function ControlCheckbox({ options, control, name }: { options: any; control: any; name: string }) {
  const { field } = useController({
    control,
    name,
  });
  const [value, setValue] = useState(field.value || []);

  return (
    <>
      {options.map((option: any, index: any) => (
        <Checkbox
          onCheckedChange={(checked) => {
            const valueCopy = [...value];
            valueCopy[index] = checked;
            field.onChange(valueCopy);
            setValue(valueCopy);
          }}
          key={option}
          checked={value.includes(option)}
        />
      ))}
    </>
  );
}
