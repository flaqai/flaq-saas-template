'use client';

import { useEffect, useRef, useState } from 'react';
import { Check, Eye, EyeOff, Loader2 } from 'lucide-react';
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
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  setSecureItem,
  getSecureItem,
  isRememberMeEnabled,
  clearAllSecureStorage,
} from '@/lib/utils/secureStorage';

const FLAQ_REGISTER_URL = 'https://flaq.ai/';

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
  const [showClientKey, setShowClientKey] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testSucceeded, setTestSucceeded] = useState(false);
  const [testError, setTestError] = useState('');
  const testRequestId = useRef(0);

  useEffect(() => {
    setIsTesting(false);
    setTestSucceeded(false);
    setTestError('');

    return () => {
      testRequestId.current += 1;
    };
  }, [baseUrl, clientKey, open]);

  useEffect(() => {
    setShowClientKey(false);
    if (!open || typeof window === 'undefined') return;

    const loadSettings = async () => {
      const savedBaseUrl = await getSecureItem(OPEN_API_BASE_URL_STORAGE_KEY);
      const savedClientKey = await getSecureItem(OPEN_API_CLIENT_KEY_STORAGE_KEY);

      setBaseUrl(savedBaseUrl || DEFAULT_OPEN_API_BASE_URL);
      setClientKey(savedClientKey || '');
      setRememberMe(isRememberMeEnabled());
    };

    loadSettings();
  }, [open]);

  const handleReset = () => {
    setBaseUrl(DEFAULT_OPEN_API_BASE_URL);
    setClientKey('');
    setRememberMe(false);
  };

  const handleClearAll = () => {
    if (window.confirm(t('clear-data-confirm'))) {
      clearAllSecureStorage();
      handleReset();
      toast.success(t('data-cleared'));
    }
  };

  const handleSave = async () => {
    const normalizedBaseUrl = baseUrl.trim() || DEFAULT_OPEN_API_BASE_URL;
    const normalizedClientKey = clientKey.trim();

    if (!normalizedClientKey) {
      toast.error(t('required'));
      return;
    }

    await setSecureItem(OPEN_API_BASE_URL_STORAGE_KEY, normalizedBaseUrl, rememberMe);
    await setSecureItem(OPEN_API_CLIENT_KEY_STORAGE_KEY, normalizedClientKey, rememberMe);

    toast.success(t('saved'));
    onOpenChange(false);
  };

  const handleTestConnection = async () => {
    const normalizedBaseUrl = baseUrl.trim() || DEFAULT_OPEN_API_BASE_URL;
    const normalizedClientKey = clientKey.trim();
    const requestId = ++testRequestId.current;

    setTestSucceeded(false);
    setTestError('');

    if (!normalizedClientKey) {
      setTestError(t('required'));
      return;
    }

    setIsTesting(true);

    try {
      const response = await fetch(
        buildOpenApiUrl(normalizedBaseUrl, '/api/v1/key/status'),
        {
          method: 'POST',
          headers: createOpenApiHeaders(normalizedClientKey),
          body: JSON.stringify({ client_key: normalizedClientKey }),
        },
      );

      const payload = await response.json().catch(() => null) as
        | { code?: number; data?: { status?: number }; error?: { message?: string }; message?: string; msg?: string }
        | null;

      if (requestId !== testRequestId.current) return;

      if (response.ok && payload?.code === 200 && payload?.data?.status === 1) {
        setTestSucceeded(true);
        return;
      }

      const message = payload?.error?.message || payload?.message || payload?.msg || (!response.ok ? response.statusText : '');
      setTestError(message ? `${t('test-failed')} ${message}` : t('test-failed'));
    } catch (error) {
      if (requestId !== testRequestId.current) return;
      const message = error instanceof Error ? error.message : t('test-failed');
      setTestError(`${t('test-failed')} ${message}`);
    } finally {
      if (requestId === testRequestId.current) setIsTesting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        hiddenTitle={t('title')}
        className='custom-scrollbar max-h-[90vh] overflow-y-auto border-white/10 bg-[#111214] text-white sm:max-w-[520px]'
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
            <div className='relative'>
              <Input
                id='open-api-client-key'
                type={showClientKey ? 'text' : 'password'}
                value={clientKey}
                onChange={(event) => setClientKey(event.target.value)}
                className='h-11 border-white/10 bg-white/5 pr-12 text-white placeholder:text-white/30'
              />
              <Button
                type='button'
                variant='ghost'
                size='icon'
                onClick={() => setShowClientKey((visible) => !visible)}
                aria-label={t(showClientKey ? 'hide-client-key' : 'show-client-key')}
                aria-controls='open-api-client-key'
                className='absolute right-1 top-1 text-white/60 hover:bg-white/8 hover:text-white'
              >
                {showClientKey ? <EyeOff aria-hidden='true' /> : <Eye aria-hidden='true' />}
              </Button>
            </div>

            <div className='flex items-center space-x-2 pt-2'>
              <Checkbox
                id='remember-me'
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked === true)}
              />
              <label
                htmlFor='remember-me'
                className='text-sm text-white/70 cursor-pointer'
              >
                {t('remember-me')}
              </label>
            </div>
            <p className='text-xs text-white/45'>
              {t('remember-me-hint')}
            </p>

            <div className='rounded-md border border-yellow-500/20 bg-yellow-500/5 p-3 mt-3'>
              <p className='text-xs text-yellow-200/80'>
                ⚠️ {t('security-warning')}
              </p>
              <button
                type='button'
                onClick={handleClearAll}
                className='mt-2 text-xs text-red-400 hover:text-red-300 underline'
              >
                {t('clear-data')}
              </button>
            </div>

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
          <Button
            type='button'
            variant='outline'
            onClick={handleReset}
            className='border-white/10 bg-transparent text-white hover:bg-white/8 hover:text-white'
          >
            {tCommon('reset')}
          </Button>
          <div className='flex gap-2'>
            <Button
              type='button'
              variant='outline'
              onClick={handleTestConnection}
              disabled={isTesting}
              aria-live='polite'
              aria-busy={isTesting}
              className={testSucceeded
                ? 'border-green-500/30 bg-green-500/10 text-green-400 hover:bg-green-500/15 hover:text-green-300'
                : 'border-white/10 bg-transparent text-white hover:bg-white/8 hover:text-white'}
            >
              {isTesting && <Loader2 className='h-4 w-4 animate-spin' aria-hidden='true' />}
              {testSucceeded && <Check className='h-4 w-4' aria-hidden='true' />}
              {isTesting ? t('testing') : testSucceeded ? t('test-success') : t('test')}
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
        {testError && (
          <p role='alert' className='rounded-md border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm break-words text-red-400'>
            {testError}
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}
