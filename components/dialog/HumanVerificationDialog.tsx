'use client';

import { useCallback } from 'react';

import { TurnstileWidget, useTurnstileInline } from '@/lib/security/turnstile';
import { Dialog, DialogContent } from '@/components/ui/dialog';

export default function HumanVerificationDialog({
  open,
  setOpen,
  onVerified,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  onVerified: (token: string) => void | Promise<void>;
}) {
  const turnstile = useTurnstileInline();

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (!nextOpen) {
        turnstile.reset();
      }
      setOpen(nextOpen);
    },
    [setOpen, turnstile],
  );

  const handleSuccess = useCallback(
    async (token: string) => {
      turnstile.handleSuccess(token);
      setOpen(false);
      await onVerified(token);
      turnstile.reset();
    },
    [onVerified, setOpen, turnstile],
  );

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        hiddenTitle='Human verification'
        className='w-[440px] max-w-[calc(100%-24px)] border border-[#2a2b2f] bg-[#141414] p-4 sm:rounded-2xl sm:p-5'
      >
        <div className='overflow-hidden rounded-xl border border-[#2a2b2f] bg-[#1b1d23] p-3'>
          <TurnstileWidget
            turnstileRef={turnstile.turnstileRef as any}
            onSuccess={handleSuccess}
            onError={turnstile.handleError}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
