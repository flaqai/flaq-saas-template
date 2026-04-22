import { useCallback } from 'react';

/**
 * 表单验证结果
 */
export interface ValidationResult {
  valid: boolean;
  error?: 'form_invalid';
}

/**
 * 表单验证选项
 */
export interface FormValidationOptions {
  creditCost: number;
  validateFormFields: () => { valid: boolean; error?: string };
}

/**
 * 统一表单验证 Hook
 *
 * 提供统一的表单提交前验证逻辑。
 *
 * 优势：
 * - 只处理前端表单完整性校验
 * - 不耦合登录、过期和站内 credits 逻辑
 *
 * @example
 * ```tsx
 * const { validate } = useFormValidation();
 *
 * const onSubmit = async (formData) => {
 *   const validation = validate({
 *     creditCost: 10,
 *     validateFormFields: () => {
 *       if (!formData.prompt) {
 *         toast.error('Please enter a prompt');
 *         return { valid: false, error: 'form_invalid' };
 *       }
 *       return { valid: true };
 *     },
 *   });
 *
 *   if (!validation.valid) return;
 *
 *   // 执行提交逻辑
 * };
 * ```
 */
export function useFormValidation() {
  /**
   * 执行表单验证
   *
   * @param options - 验证选项
   * @returns 验证结果
   */
  const validate = useCallback(
    (options: FormValidationOptions): ValidationResult => {
      void options.creditCost;

      const formValidation = options.validateFormFields();
      if (!formValidation.valid) {
        return { valid: false, error: 'form_invalid' };
      }

      return { valid: true };
    },
    [],
  );

  return { validate };
}
