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
  void mineType;
  void isForever;

  throw new Error('Upload adapter is not configured yet.');
}
