import {
  buildOpenApiUrl,
  createOpenApiHeaders,
  getClientOpenApiConfigAsync,
} from '@/network/clientFetch';

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
 * Upload adapter for Flaq Open API presigned URLs.
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
