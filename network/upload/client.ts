import { getSecureItem } from '@/lib/utils/secureStorage';

export interface CreateSignedUrlRequest {
  mineType: string[];
  isForever?: boolean;
}

export interface SignedUrlItem {
  signedUrl?: string;
  uploadUrl?: string;
  fileUrl?: string;
  url?: string;
  fileName?: string;
  mimeType?: string;
}

export interface CreateSignedUrlResponse {
  rows: SignedUrlItem[];
}

/**
 * Generic upload interface placeholder:
 * Currently using createSignedUrl naming, will switch to image hosting or backend proxy later.
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

  const publicDomain = await getSecureItem('FLAQ-SAAS-TEMPLATE-r2-public-domain');
  if (!publicDomain) {
    throw new Error('R2 public domain is not configured. Please set it in Open API Settings.');
  }

  const response = await fetch('/api/upload/presigned-url', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mimeTypes: mineType, publicDomain }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Upload failed' }));
    throw new Error(error.error || 'Failed to create signed URL');
  }

  return response.json();
}
