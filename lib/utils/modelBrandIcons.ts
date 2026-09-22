import { getModelProviderIconConfig } from './modelProviderIcons';

function toModelBrandTitleCase(value: string) {
  return value
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((word) => `${word.charAt(0).toUpperCase()}${word.slice(1)}`)
    .join(' ');
}

export function getModelBrandIconConfig(brandValue: string) {
  const provider = getModelProviderIconConfig(brandValue);

  return provider ? { ...provider, icon: provider.whiteIcon } : undefined;
}

export function getModelBrandName(brandValue: string) {
  return getModelBrandIconConfig(brandValue)?.name || toModelBrandTitleCase(brandValue);
}

export function getModelBrandIcon(brandValue: string) {
  return getModelBrandIconConfig(brandValue)?.icon;
}

export function getModelBrandIconValueFromHref(href?: string) {
  if (!href?.startsWith('/models/')) {
    return undefined;
  }

  const [, vendor, model] = href.split('/').filter(Boolean);

  if (model && getModelBrandIconConfig(model)) {
    return model;
  }

  return vendor;
}
