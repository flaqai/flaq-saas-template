import {
  buildOpenApiUrl,
  createOpenApiHeaders,
  getClientOpenApiConfigAsync,
} from '@/network/clientFetch';
import { getSecureItem } from '@/lib/utils/secureStorage';

export const MAX_UPLOAD_BATCH_SIZE = 10;

export interface CreateSignedUrlRequest {
  mineType: string[];
  isForever?: boolean;
}

export interface SignedUrlItem {
  signedUrl: string;
  uploadUrl?: string;
  fileUrl?: string;
  url: string;
  fileName?: string;
  mimeType?: string;
}

export interface CreateSignedUrlResponse {
  rows: SignedUrlItem[];
}

/**
 * Upload adapter for custom R2 storage or Flaq Open API presigned URLs.
 */
export interface UploadAdapter {
  createSignedUrl(input: CreateSignedUrlRequest): Promise<SignedUrlItem[]>;
}

export async function createSignedUrl(
  mineType: string[],
  isForever?: boolean,
): Promise<CreateSignedUrlResponse> {
  void isForever;

  if (typeof window === 'undefined') {
    throw new Error('createSignedUrl can only be called from the browser.');
  }

  const publicDomain = (await getSecureItem('FLAQ-SAAS-TEMPLATE-r2-public-domain'))?.trim();
  if (publicDomain) {
    const response = await fetch('/api/upload/presigned-url', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mimeTypes: mineType, publicDomain }),
    });
    const payload = await response.json().catch(() => null) as
      | (CreateSignedUrlResponse & { error?: string })
      | null;

    if (!response.ok) {
      throw new Error(payload?.error || 'Failed to create signed URL');
    }
    if (!Array.isArray(payload?.rows) || payload.rows.length !== mineType.length ||
      payload.rows.some((item) => !item?.signedUrl || !item?.url)) {
      throw new Error('Failed to create signed URL');
    }
    return { rows: payload.rows };
  }

  const config = await getClientOpenApiConfigAsync();
  const response = await fetch(buildOpenApiUrl(config.baseUrl, '/api/v1/files/presignedUrl'), {
    method: 'POST',
    headers: createOpenApiHeaders(config.clientKey),
    body: JSON.stringify({ files: mineType.map((mime_type) => ({ mime_type })) }),
  });

  const payload = await response.json().catch(() => null) as {
    code?: number;
    message?: string;
    error?: { message?: string };
    data?: { signed_url: string; url: string }[] | null;
  } | null;

  if (!response.ok || payload?.code !== 0) {
    throw new Error(payload?.error?.message || payload?.message || 'Failed to create signed URL');
  }

  if (!Array.isArray(payload.data) || payload.data.length !== mineType.length ||
    payload.data.some((item) => !item?.signed_url || !item?.url)) {
    throw new Error('Failed to create signed URL');
  }

  return {
    rows: payload.data.map((item) => ({ signedUrl: item.signed_url, url: item.url })),
  };
}
