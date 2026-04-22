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
 * 通用上传接口预留：
 * 暂时沿用 createSignedUrl 命名，后续再切到图床或后端代理。
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
