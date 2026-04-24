export const getModelIcon = (modelValue: string): string => {
  const lowerValue = modelValue.toLowerCase();

  if (lowerValue.startsWith('wan')) {
    return '/images/model-icon/wan.svg';
  }
  if (lowerValue.startsWith('kling')) {
    return '/images/model-icon/kling.svg';
  }
  if (lowerValue.startsWith('veo')) {
    return '/images/model-icon/veo.svg';
  }
  if (lowerValue.startsWith('vidu')) {
    return '/images/model-icon/vidu.svg';
  }

  if (lowerValue.startsWith('seedream')) {
    return '/images/model-icon/seedance.svg';
  }

  if (lowerValue.startsWith('gemini') || lowerValue.startsWith('nano-banana')) {
    return '/images/model-icon/veo.svg';
  }

  if (lowerValue.startsWith('gpt')) {
    return '/images/model-icon/openai.svg';
  }

  return '';
};
