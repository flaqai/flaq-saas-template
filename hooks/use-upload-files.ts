import { createSignedUrl } from '@/network/image/client';

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

    // Get signed URLs
    const signedUrlResult = await createSignedUrl(files.map((file) => file.type), options?.isForever);

    // Upload files
    // const storeResults = await Promise.all(
    await Promise.all(
      signedUrlResult.rows.map((obj, index) => {
        const file = files[index];
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
    return signedUrlResult.rows.map((el) => el.url);
    // return storeResults.map(
    //   (item) =>
    //     `https://${process.env.NEXT_PUBLIC_R2_IMAGE_DOMAIN}${item.url.split('r2.cloudflarestorage.com')[1].split('?')[0]}`,
    // );
  };

  return uploadFilesToStorageThroughBackEnd;
};

export default useUploadFiles;
