import { useCallback, useState } from 'react';

export type ImageType = 'webp' | 'png' | 'jpg';

export const imageTypesList: ImageType[] = ['webp', 'png', 'jpg'];

interface ConvertAndDownloadData {
  imageUrl: string;
  type: ImageType;
  imageName: string;
}

interface UseImageConverterResult {
  convertAndDownload: (data: ConvertAndDownloadData) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const useImageConverter = (): UseImageConverterResult => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const convertAndDownload = useCallback(async ({ imageUrl, type, imageName }: ConvertAndDownloadData) => {
    setIsLoading(true);
    setError(null);

    try {
      // 移除文件名中的扩展名
      const nameWithoutExt = imageName.replace(/\.[^/.]+$/, '');

      // 使用代理 API 避免 CORS 问题
      const proxyUrl = `/api/proxy-image?url=${encodeURIComponent(imageUrl)}`;
      const response = await fetch(proxyUrl);
      const blob = await response.blob();

      // 检测原始图片格式
      const originalType = blob.type.split('/')[1]; // e.g., 'png', 'jpeg', 'webp'
      const normalizedOriginalType = originalType === 'jpeg' ? 'jpg' : originalType;

      // 如果目标格式和原图格式相同，直接下载不转换
      if (normalizedOriginalType === type) {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${nameWithoutExt}.${type}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
        return;
      }

      // Create an image element
      const img = new Image();
      img.src = URL.createObjectURL(blob);

      await new Promise((resolve) => {
        img.onload = resolve;
      });

      // Create a canvas and draw the image
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        throw new Error('Unable to create canvas context');
      }
      ctx.drawImage(img, 0, 0);

      // Convert the image with quality 1 for all formats
      const mimeType = `image/${type === 'jpg' ? 'jpeg' : type}`;
      const quality = 1;
      const dataUrl = canvas.toDataURL(mimeType, quality);

      // Create a download link and trigger the download
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `${nameWithoutExt}.${type}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { convertAndDownload, isLoading, error };
};

export default useImageConverter;
