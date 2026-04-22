/**
 * 视频表单相关类型定义
 *
 * 统一管理所有视频表单组件、hooks、utils 的类型
 */

/**
 * 视频表单数据类型
 *
 * 用于 React Hook Form 的表单数据结构
 */
export interface VideoFormData {
  prompt: string;
  ratio: string;
  disableEndFrame: boolean; // 保留此字段以兼容主组件
  modelVersion: string;
  duration?: string; // 时长选项 (如 '5s', '10s')
  resolution?: string; // 分辨率选项 (如 '480p', '720p', '1080p')
  startFrame?: File | string; // 可以是 File 对象或 URL 字符串
  endFrame?: File | string; // 可以是 File 对象或 URL 字符串
  multiImages?: File[] | null;
  enableEndFrame?: boolean;
  enableAudio?: boolean;
  audioFile?: File | null; // 音频文件（用于 lipsync 等需要音频的模型）
  audioTrimRange?: { startTime: number; endTime: number } | null; // 音频裁剪范围
}

/**
 * 表单选项类型
 */
export interface FormOption {
  name: string;
  value: string;
}
