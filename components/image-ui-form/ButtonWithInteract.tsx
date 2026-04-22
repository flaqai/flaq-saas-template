import { ArrowRightLeft } from 'lucide-react';

import Box from './Box';

export default function ButtonWithInteract({ value, onClick }: { value: string; onClick: () => void }) {
  return (
    <Box className='flex w-full items-center justify-between'>
      <button type='button' onClick={onClick} className='w-full text-left'>
        {value}
      </button>
      <ArrowRightLeft className='size-3.5' />
    </Box>
  );
}
