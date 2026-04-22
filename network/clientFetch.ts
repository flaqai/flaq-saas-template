'use client';

import { defaultLocale, languages } from '@/i18n/languages';
import { clientSideGetCookie } from '@/lib/utils/stringUtils';

export type OpenApiTaskStatus = 'submitted' | 'processing' | 'succeed' | 'failed';

export interface OpenApiConfig {
  baseUrl: string;
  clientKey: string;
}

export interface OpenApiErrorPayload {
  error?: {
    code?: string;
    message?: string;
    param?: string;
    type?: string;
  };
}

export interface OpenApiSubmitResponse {
  code: number;
  message: string;
  data: {
    task_id: string;
    task_status: OpenApiTaskStatus;
    response_url: string;
  };
}

export interface OpenApiPollResponse<TResult> {
  code: number;
  message: string;
  data: {
    task_id: string;
    task_status: OpenApiTaskStatus;
    task_status_msg: null | string;
    response_url: string;
    task_result: null | TResult;
  };
}

export interface TaskCreditResult {
  credit?: number;
  credits?: number;
}

export const DEFAULT_OPEN_API_BASE_URL = 'https://api.flaq.ai';
export const OPEN_API_BASE_URL_STORAGE_KEY = 'flaq_open_api_base_url';
export const OPEN_API_CLIENT_KEY_STORAGE_KEY = 'flaq_open_api_client_key';

function getContentLanguage(code?: string): string {
  return languages.find((item) => item.lang === code)?.backendValue || defaultLocale;
}

function normalizeBaseUrl(baseUrl: string) {
  return baseUrl.replace(/\/+$/, '');
}

export function buildOpenApiUrl(baseUrl: string, path: string) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${normalizeBaseUrl(baseUrl)}${normalizedPath}`;
}

export function createOpenApiHeaders(clientKey: string, init?: HeadersInit): HeadersInit {
  return {
    Accept: 'application/json',
    Authorization: `Bearer ${clientKey}`,
    'Content-Type': 'application/json',
    ...init,
  };
}

export async function openApiFetchJson<TResponse>(
  config: OpenApiConfig,
  path: string,
  init?: RequestInit,
): Promise<TResponse> {
  const res = await fetch(buildOpenApiUrl(config.baseUrl, path), {
    ...init,
    headers: createOpenApiHeaders(config.clientKey, init?.headers),
  });

  const data = (await res.json().catch(() => null)) as null | TResponse | OpenApiErrorPayload;

  if (!res.ok) {
    const errorMessage =
      (data as OpenApiErrorPayload | null)?.error?.message || res.statusText || 'Open API request failed';
    throw new Error(errorMessage);
  }

  return data as TResponse;
}

export function getClientOpenApiConfig(): OpenApiConfig {
  const envBaseUrl =
    process.env.NEXT_PUBLIC_BASE_OPEN_API ||
    process.env.NEXT_PUBLIC_OPEN_API_BASE_URL ||
    DEFAULT_OPEN_API_BASE_URL;

  if (typeof window === 'undefined') {
    return {
      baseUrl: envBaseUrl,
      clientKey: '',
    };
  }

  const baseUrl = localStorage.getItem(OPEN_API_BASE_URL_STORAGE_KEY) || envBaseUrl;
  const clientKey = localStorage.getItem(OPEN_API_CLIENT_KEY_STORAGE_KEY) || '';

  if (!clientKey) {
    throw new Error('Please configure your Flaq client key first.');
  }

  return {
    baseUrl,
    clientKey,
  };
}

export function getClientContentLanguage() {
  return getContentLanguage(clientSideGetCookie('NEXT_LOCALE') || defaultLocale);
}
