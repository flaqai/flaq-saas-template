'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import {
  DEFAULT_OPEN_API_BASE_URL,
  OPEN_API_BASE_URL_STORAGE_KEY,
  OPEN_API_CLIENT_KEY_STORAGE_KEY,
  buildOpenApiUrl,
  createOpenApiHeaders,
} from '@/network/clientFetch';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

const FLAQ_REGISTER_URL = 'https://flaq.ai/';

function isAuthError(status: number, message: string) {
  const normalizedMessage = message.toLowerCase();
  return (
    status === 401
    || status === 403
    || normalizedMessage.includes('unauthorized')
    || normalizedMessage.includes('authentication')
    || normalizedMessage.includes('authenticate')
    || normalizedMessage.includes('invalid client key')
    || normalizedMessage.includes('invalid api key')
    || normalizedMessage.includes('invalid key')
    || normalizedMessage.includes('forbidden')
    || normalizedMessage.includes('未认证')
    || normalizedMessage.includes('鉴权')
    || normalizedMessage.includes('认证')
    || normalizedMessage.includes('无效的client key')
    || normalizedMessage.includes('client key无效')
  );
}

type OpenApiSettingsDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function OpenApiSettingsDialog({
  open,
  onOpenChange,
}: OpenApiSettingsDialogProps) {
  const t = useTranslations('components.open-api-settings');
  const tCommon = useTranslations('Common');
  const [baseUrl, setBaseUrl] = useState(DEFAULT_OPEN_API_BASE_URL);
  const [clientKey, setClientKey] = useState('');
  const [isTesting, setIsTesting] = useState(false);

  useEffect(() => {
    if (!open || typeof window === 'undefined') return;

    setBaseUrl(
      localStorage.getItem(OPEN_API_BASE_URL_STORAGE_KEY) || DEFAULT_OPEN_API_BASE_URL,
    );
    setClientKey(localStorage.getItem(OPEN_API_CLIENT_KEY_STORAGE_KEY) || '');
  }, [open]);

  const handleReset = () => {
    setBaseUrl(DEFAULT_OPEN_API_BASE_URL);
    setClientKey('');
  };

  const handleSave = () => {
    const normalizedBaseUrl = baseUrl.trim() || DEFAULT_OPEN_API_BASE_URL;
    const normalizedClientKey = clientKey.trim();

    if (!normalizedClientKey) {
      toast.error(t('required'));
      return;
    }

    localStorage.setItem(OPEN_API_BASE_URL_STORAGE_KEY, normalizedBaseUrl);
    localStorage.setItem(OPEN_API_CLIENT_KEY_STORAGE_KEY, normalizedClientKey);

    toast.success(t('saved'));
    onOpenChange(false);
  };

  const handleTestConnection = async () => {
    const normalizedBaseUrl = baseUrl.trim() || DEFAULT_OPEN_API_BASE_URL;
    const normalizedClientKey = clientKey.trim();

    if (!normalizedClientKey) {
      toast.error(t('required'));
      return;
    }

    setIsTesting(true);

    try {
      const response = await fetch(
        buildOpenApiUrl(normalizedBaseUrl, '/api/v1/image/00000000-0000-0000-0000-000000000000'),
        {
          method: 'GET',
          headers: createOpenApiHeaders(normalizedClientKey),
        },
      );

      const payload = await response.json().catch(() => null) as
        | { error?: { message?: string }; message?: string; msg?: string }
        | null;
      const message = payload?.error?.message || payload?.message || payload?.msg || response.statusText;

      if (response.ok) {
        toast.success(t('test-success'));
        return;
      }

      if (isAuthError(response.status, message)) {
        toast.error(`${t('test-failed')} ${message}`);
        return;
      }

      toast.success(t('test-success-validation'));
    } catch (error) {
      const message = error instanceof Error ? error.message : t('test-failed');
      toast.error(`${t('test-failed')} ${message}`);
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        hiddenTitle={t('title')}
        className='border-white/10 bg-[#111214] text-white sm:max-w-[520px]'
      >
        <DialogHeader className='space-y-2 text-left'>
          <DialogTitle className='text-xl font-semibold text-white'>
            {t('title')}
          </DialogTitle>
          <DialogDescription className='text-sm text-white/60'>
            {t('description')}
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-4'>
          <div className='space-y-2'>
            <label htmlFor='open-api-base-url' className='text-sm font-medium text-white/80'>
              {t('base-url')}
            </label>
            <Input
              id='open-api-base-url'
              value={baseUrl}
              onChange={(event) => setBaseUrl(event.target.value)}
              placeholder={DEFAULT_OPEN_API_BASE_URL}
              className='h-11 border-white/10 bg-white/5 text-white placeholder:text-white/30'
            />
            <p className='text-xs text-white/45'>
              {t('base-url-hint')}
            </p>
          </div>

          <div className='space-y-2'>
            <label htmlFor='open-api-client-key' className='text-sm font-medium text-white/80'>
              {t('client-key')}
            </label>
            <Input
              id='open-api-client-key'
              type='password'
              value={clientKey}
              onChange={(event) => setClientKey(event.target.value)}
              className='h-11 border-white/10 bg-white/5 text-white placeholder:text-white/30'
            />
            <p className='text-xs text-white/45'>
              {t('client-key-hint')}
            </p>
            <Button
              asChild
              className='mt-3 h-11 w-full bg-color-main text-white hover:bg-color-main/90'
            >
              <a href={FLAQ_REGISTER_URL} target='_blank' rel='noreferrer'>
                {t('register')}
              </a>
            </Button>
          </div>
        </div>

        <DialogFooter className='flex-col gap-2 sm:flex-row sm:justify-between'>
          <div className='flex gap-2'>
            <Button
              type='button'
              variant='outline'
              onClick={handleReset}
              className='border-white/10 bg-transparent text-white hover:bg-white/8 hover:text-white'
            >
              {tCommon('reset')}
            </Button>
          </div>
          <div className='flex gap-2'>
            <Button
              type='button'
              variant='outline'
              onClick={handleTestConnection}
              disabled={isTesting}
              className='border-white/10 bg-transparent text-white hover:bg-white/8 hover:text-white'
            >
              {isTesting ? t('testing') : t('test')}
            </Button>
            <Button
              type='button'
              variant='ghost'
              onClick={() => onOpenChange(false)}
              className='text-white/70 hover:bg-white/8 hover:text-white'
            >
              {t('cancel')}
            </Button>
            <Button
              type='button'
              onClick={handleSave}
              className='bg-white text-black hover:bg-white/90'
            >
              {t('save')}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
