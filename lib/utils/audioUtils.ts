function writeString(view: DataView, offset: number, string: string): void {
  for (let i = 0; i < string.length; i += 1) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}

function interleave(buffer: AudioBuffer): Float32Array {
  const numberOfChannels = buffer.numberOfChannels;
  const length = buffer.length * numberOfChannels;
  const result = new Float32Array(length);

  let offset = 0;
  for (let i = 0; i < buffer.length; i += 1) {
    for (let channel = 0; channel < numberOfChannels; channel += 1) {
      result[offset] = buffer.getChannelData(channel)[i];
      offset += 1;
    }
  }

  return result;
}

function audioBufferToWav(buffer: AudioBuffer): Blob {
  const numberOfChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const format = 1; // PCM
  const bitDepth = 16;

  const bytesPerSample = bitDepth / 8;
  const blockAlign = numberOfChannels * bytesPerSample;

  const data = interleave(buffer);
  const dataLength = data.length * bytesPerSample;
  const headerLength = 44;
  const totalLength = headerLength + dataLength;

  const arrayBuffer = new ArrayBuffer(totalLength);
  const view = new DataView(arrayBuffer);

  // RIFF chunk descriptor
  writeString(view, 0, 'RIFF');
  view.setUint32(4, totalLength - 8, true);
  writeString(view, 8, 'WAVE');

  // FMT sub-chunk
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true); // SubChunk1Size
  view.setUint16(20, format, true); // AudioFormat
  view.setUint16(22, numberOfChannels, true); // NumChannels
  view.setUint32(24, sampleRate, true); // SampleRate
  view.setUint32(28, sampleRate * blockAlign, true); // ByteRate
  view.setUint16(32, blockAlign, true); // BlockAlign
  view.setUint16(34, bitDepth, true); // BitsPerSample

  // Data sub-chunk
  writeString(view, 36, 'data');
  view.setUint32(40, dataLength, true);

  // Write PCM samples
  const volume = 1;
  let offset = 44;
  for (let i = 0; i < data.length; i += 1) {
    const sample = Math.max(-1, Math.min(1, data[i]));
    const intSample = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
    view.setInt16(offset, intSample * volume, true);
    offset += 2;
  }

  return new Blob([arrayBuffer], { type: 'audio/wav' });
}

/**
 * 裁剪音频文件
 * @param audioFile 原始音频文件
 * @param startTime 开始时间（秒）
 * @param endTime 结束时间（秒）
 * @returns 裁剪后的音频文件
 */
export default async function trimAudioFile(
  audioFile: File,
  startTime: number,
  endTime: number,
): Promise<File> {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  const arrayBuffer = await audioFile.arrayBuffer();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

  const sampleRate = audioBuffer.sampleRate;
  const startSample = Math.floor(startTime * sampleRate);
  const endSample = Math.floor(endTime * sampleRate);
  const trimmedLength = endSample - startSample;

  // 创建新的 AudioBuffer
  const trimmedBuffer = audioContext.createBuffer(
    audioBuffer.numberOfChannels,
    trimmedLength,
    sampleRate,
  );

  // 复制裁剪范围内的音频数据
  for (let channel = 0; channel < audioBuffer.numberOfChannels; channel += 1) {
    const originalData = audioBuffer.getChannelData(channel);
    const trimmedData = trimmedBuffer.getChannelData(channel);
    for (let i = 0; i < trimmedLength; i += 1) {
      trimmedData[i] = originalData[startSample + i];
    }
  }

  // 将 AudioBuffer 转换为 WAV 格式的 Blob
  const wavBlob = audioBufferToWav(trimmedBuffer);

  // 获取原始文件类型，如果是 mp3/mpeg 格式，映射为 audio/mpeg
  const originalType = audioFile.type;
  let outputType = 'audio/wav';
  let outputExt = '.wav';

  // 如果原始文件是 mp3/mpeg 格式，保持为 mpeg 类型（后端接受）
  if (originalType === 'audio/mpeg' || originalType === 'audio/mp3') {
    outputType = 'audio/mpeg';
    outputExt = '.mp3';
  }

  // 创建新的 File 对象
  const originalName = audioFile.name;
  const nameWithoutExt = originalName.replace(/\.[^/.]+$/, '');
  const trimmedFile = new File([wavBlob], `${nameWithoutExt}_trimmed${outputExt}`, {
    type: outputType,
  });

  audioContext.close();
  return trimmedFile;
}
