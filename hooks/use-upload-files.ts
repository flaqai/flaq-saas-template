import { createSignedUrl, MAX_UPLOAD_BATCH_SIZE } from '@/network/upload/client';

import { FileType } from '@/lib/utils/fileUtils';
import { fetchWithRetry } from '@/lib/utils/promiseUtils';

const useUploadFiles = () => {
  const uploadFilesToStorageThroughBackEnd = async (
    files: FileType[],
    options?: { isForever?: boolean },
  ): Promise<string[]> => {
    if (files.length === 0) {
      return [];
    }

    const urls: string[] = [];

    for (let offset = 0; offset < files.length; offset += MAX_UPLOAD_BATCH_SIZE) {
      const batch = files.slice(offset, offset + MAX_UPLOAD_BATCH_SIZE);

      // Get signed URLs
      // Request each batch immediately before uploading: signatures expire after 60 seconds.
      const signedUrlResult = await createSignedUrl(batch.map((file) => file.type), options?.isForever);

      // Upload files
      await Promise.all(
        signedUrlResult.rows.map((obj, index) => {
          const file = batch[index];
          return fetchWithRetry(obj.signedUrl, {
            method: 'PUT',
            body: file.data,
            headers: {
              'Content-Type': file.type,
            },
          });
        }),
      );

      // Generate final URLs
      urls.push(...signedUrlResult.rows.map((el) => el.url));
    }

    return urls;
  };

  return uploadFilesToStorageThroughBackEnd;
};

export default useUploadFiles;
