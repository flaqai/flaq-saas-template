/**
 * 视频表单 Hooks 集合
 *
 * 模块化设计：
 * - useVideoModelConfig: 模型配置解析
 * - useModelToggle: 模型切换（音频/尾帧开关）
 * - useVideoFormStores: 表单状态管理
 * - useFormSync: 表单同步
 * - useVideoCredit: 积分计算
 * - useFieldDefaults: 字段默认值计算（优先级队列）
 * - useModelSwitch + useFieldReset: 模型切换检测和字段重置
 */

export { useVideoCredit } from './useVideoCredit';
export { useVideoModelConfig, type UseVideoModelConfigResult, type VideoUIConfig } from './useVideoModelConfig';
export { default as useModelToggle } from './useModelToggle';
export { useVideoFormStores } from './useVideoFormStores';
export { default as useFormSync } from './useFormSync';
export { default as useVideoFormSubmit } from './useVideoFormSubmit';
export { useFieldDefaults } from './useFieldDefaults';
export { useModelSwitch, useFieldReset } from './useModelSwitch';
