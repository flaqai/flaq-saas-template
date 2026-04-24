'use client';

import { useEffect, useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
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
  removeSecureItem,
  isRememberMeEnabled,
  clearAllSecureStorage,
} from '@/lib/utils/secureStorage';

const FLAQ_REGISTER_URL = 'https://flaq.ai/';
const R2_PUBLIC_DOMAIN_STORAGE_KEY = 'FLAQ-SAAS-TEMPLATE-r2-public-domain';

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
  const tHosting = useTranslations('components.image-hosting');
  const tCommon = useTranslations('Common');
  const [baseUrl, setBaseUrl] = useState(DEFAULT_OPEN_API_BASE_URL);
  const [clientKey, setClientKey] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [hostingExpanded, setHostingExpanded] = useState(false);
  const [r2PublicDomain, setR2PublicDomain] = useState('');
  const [isTestingR2, setIsTestingR2] = useState(false);

  useEffect(() => {
    if (!open || typeof window === 'undefined') return;

    const loadSettings = async () => {
      const savedBaseUrl = await getSecureItem(OPEN_API_BASE_URL_STORAGE_KEY);
      const savedClientKey = await getSecureItem(OPEN_API_CLIENT_KEY_STORAGE_KEY);
      const savedDomain = await getSecureItem(R2_PUBLIC_DOMAIN_STORAGE_KEY);

      setBaseUrl(savedBaseUrl || DEFAULT_OPEN_API_BASE_URL);
      setClientKey(savedClientKey || '');
      setR2PublicDomain(savedDomain || '');
      setRememberMe(isRememberMeEnabled());
    };

    loadSettings();
  }, [open]);

  const handleReset = () => {
    setBaseUrl(DEFAULT_OPEN_API_BASE_URL);
    setClientKey('');
    setR2PublicDomain('');
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

    const normalizedDomain = r2PublicDomain.trim();
    if (normalizedDomain) {
      await setSecureItem(R2_PUBLIC_DOMAIN_STORAGE_KEY, normalizedDomain, rememberMe);
    } else {
      removeSecureItem(R2_PUBLIC_DOMAIN_STORAGE_KEY);
    }

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

  const handleTestR2 = async () => {
    setIsTestingR2(true);

    try {
      const response = await fetch('/api/upload/test-r2', { method: 'GET' });
      const result = await response.json() as { ok?: boolean; error?: string };

      if (response.ok && result.ok) {
        toast.success(tHosting('test-success'));
      } else {
        toast.error(`${tHosting('test-failed')} ${result.error || ''}`);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : tHosting('test-failed');
      toast.error(`${tHosting('test-failed')} ${message}`);
    } finally {
      setIsTestingR2(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        hiddenTitle={t('title')}
        className='max-h-[90vh] overflow-y-auto border-white/10 bg-[#111214] text-white sm:max-w-[520px]'
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

          <div className='rounded-md border border-white/10'>
            <button
              type='button'
              onClick={() => setHostingExpanded((prev) => !prev)}
              className='flex w-full items-center justify-between px-3 py-2.5 text-sm font-medium text-white/70 hover:text-white/90'
            >
              <span>{tHosting('title')}</span>
              {hostingExpanded
                ? <ChevronDown className='h-4 w-4' />
                : <ChevronRight className='h-4 w-4' />}
            </button>

            {hostingExpanded && (
              <div className='space-y-2 border-t border-white/10 px-3 pb-3 pt-3'>
                <label htmlFor='r2-public-domain' className='text-sm font-medium text-white/80'>
                  {tHosting('public-domain')}
                </label>
                <Input
                  id='r2-public-domain'
                  value={r2PublicDomain}
                  onChange={(event) => setR2PublicDomain(event.target.value)}
                  placeholder={tHosting('public-domain-placeholder')}
                  className='h-11 border-white/10 bg-white/5 text-white placeholder:text-white/30'
                />
                <p className='text-xs text-white/45'>
                  {tHosting('public-domain-hint')}
                </p>
                <p className='text-xs text-white/30'>
                  {tHosting('not-configured')}
                </p>
                <Button
                  type='button'
                  variant='outline'
                  onClick={handleTestR2}
                  disabled={isTestingR2}
                  className='mt-1 h-9 w-full border-white/10 bg-transparent text-sm text-white hover:bg-white/8 hover:text-white'
                >
                  {isTestingR2 ? tHosting('testing') : tHosting('test')}
                </Button>
              </div>
            )}
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
