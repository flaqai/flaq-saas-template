/**
 * 图片表单 Hooks 集合
 *
 * 模块化设计：
 * - useModelConfig: 模型配置解析
 * - useModelSwitch: 模型切换检测（返回 needsReset 标记）
 * - useFieldReset: 字段重置处理（监听 needsReset 和配置变化）
 * - useFieldDefaults: 字段默认值计算（可选，用于其他场景）
 */

export { useModelConfig } from './useModelConfig';
export { useFieldDefaults } from './useFieldDefaults';
export { useModelSwitch, useFieldReset } from './useModelSwitch';
