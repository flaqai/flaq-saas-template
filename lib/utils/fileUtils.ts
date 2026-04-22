import imageCompression from 'browser-image-compression';

import { maxSizeMB } from '../constants';

/* eslint-disable import/prefer-default-export */
/**
 * 下载文件
 * @param {String} path - 下载地址/下载请求地址。
 * @param {String} filename - 下载文件的名字（考虑到兼容性问题，最好加上后缀名）
 */
export function downloadFile(path: string, filename: string) {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', path, true);
  xhr.responseType = 'blob'; // 直接获取Blob数据

  xhr.onload = function () {
    if (xhr.status === 200 || xhr.status === 304) {
      const blob = xhr.response;
      const downloadUrl = URL.createObjectURL(blob); // 从Blob创建一个URL
      console.log(`fileurl:${downloadUrl}`);

      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = filename; // 设置文件名
      document.body.appendChild(a);
      a.click(); // 模拟点击实现下载

      // 清理资源
      document.body.removeChild(a);
      URL.revokeObjectURL(downloadUrl); // 释放URL对象占用的资源
    }
  };

  xhr.send();
}

export async function getFileByUrl(url: string): Promise<File> {
  const response = await fetch(url);

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
 * 检测图片的真实格式
 * @param imageUrl 图片URL
 * @returns 格式字符串 (WEBP/PNG/JPG) 或 null
 */
export async function detectImageFormat(imageUrl: string): Promise<ImageFormatType | null> {
  try {
    const response = await fetch(imageUrl);
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
