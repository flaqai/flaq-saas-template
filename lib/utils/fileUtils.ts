import imageCompression from 'browser-image-compression';

import { maxSizeMB } from '../constants';

/* eslint-disable import/prefer-default-export */
/**
 * Download file
 * @param {String} path - Download address/download request address
 * @param {String} filename - Name of the downloaded file (best to include extension for compatibility)
 */
export function downloadFile(path: string, filename: string) {
  // Use proxy API to avoid CORS issues
  const proxyUrl = `/api/proxy-image?url=${encodeURIComponent(path)}`;

  const xhr = new XMLHttpRequest();
  xhr.open('GET', proxyUrl, true);
  xhr.responseType = 'blob'; // Get Blob data directly

  xhr.onload = function () {
    if (xhr.status === 200 || xhr.status === 304) {
      const blob = xhr.response;
      const downloadUrl = URL.createObjectURL(blob); // Create a URL from Blob

      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = filename; // Set filename
      document.body.appendChild(a);
      a.click(); // Simulate click to trigger download

      // Clean up resources
      document.body.removeChild(a);
      URL.revokeObjectURL(downloadUrl); // Release resources occupied by URL object
    }
  };

  xhr.send();
}

export async function getFileByUrl(url: string): Promise<File> {
  // Use proxy API to avoid CORS issues
  const proxyUrl = `/api/proxy-image?url=${encodeURIComponent(url)}`;
  const response = await fetch(proxyUrl);

  if (!response.ok) {
    throw new Error('Failed to fetch file');
  }

  const blob = await response.blob();

  // Extract the filename from the URL
  const urlParts = url.split('/');
  const filename = urlParts[urlParts.length - 1];

  // Determine the file type based on the file extension
  const extension = filename.split('.').pop()?.toLowerCase();
  let mimeType = '';

  switch (extension) {
    case 'jpg':
    case 'jpeg':
      mimeType = 'image/jpeg';
      break;
    case 'png':
      mimeType = 'image/png';
      break;
    case 'webp':
      mimeType = 'image/webp';
      break;
    case 'gif':
      mimeType = 'image/gif';
      break;
    case 'bmp':
      mimeType = 'image/bmp';
      break;
    case 'mp4':
      mimeType = 'video/mp4';
      break;
    case 'webm':
      mimeType = 'video/webm';
      break;
    case 'ogg':
      mimeType = 'video/ogg';
      break;
    case 'mov':
      mimeType = 'video/quicktime';
      break;
    default:
      throw new Error('Unsupported file type');
  }

  // Create the file with the correct MIME type
  const file = new File([blob], filename, { type: mimeType });

  return file;
}

export type FileType = {
  data: File | null;
  type: string;
};

export async function shouldCompressImageFileList(fileList: FileType[], xMB: number = maxSizeMB): Promise<FileType[]> {
  const maxSizeInBytes = xMB * 1024 * 1024;

  if (fileList.every((file) => file.data?.size && file.data.size <= maxSizeInBytes)) {
    return fileList;
  }

  const compressedFilesPromises = fileList.map((file) => {
    if (file.data && file.data.size > maxSizeInBytes) {
      return imageCompression(file.data, { maxSizeMB: xMB, useWebWorker: true }).then(
        (compressedData) =>
          ({
            ...file,
            data: compressedData,
          }) satisfies FileType,
      );
    }
    return Promise.resolve(file);
  });

  const compressedFiles = await Promise.all(compressedFilesPromises);

  return compressedFiles;
}

export type ImageFormatType = 'WEBP' | 'PNG' | 'JPG';

/**
 * Detect the actual format of an image
 * @param imageUrl Image URL
 * @returns Format string (WEBP/PNG/JPG) or null
 */
export async function detectImageFormat(imageUrl: string): Promise<ImageFormatType | null> {
  try {
    // Use proxy API to avoid CORS issues
    const proxyUrl = `/api/proxy-image?url=${encodeURIComponent(imageUrl)}`;
    const response = await fetch(proxyUrl);
    const blob = await response.blob();
    const mimeType = blob.type;
    const format = mimeType.split('/')[1]?.toLowerCase();

    const formatMap: Record<string, ImageFormatType> = {
      webp: 'WEBP',
      png: 'PNG',
      jpeg: 'JPG',
      jpg: 'JPG',
    };

    return formatMap[format] || null;
  } catch (error) {
    console.error('Failed to detect image format:', error);
    return null;
  }
}
