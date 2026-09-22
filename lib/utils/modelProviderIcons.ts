export type ModelIconBackground = 'dark' | 'light';

export type ModelProviderIconConfig = {
  match: string[];
  name: string;
  icon: string;
  whiteIcon: string;
  background?: ModelIconBackground;
};

const MODEL_PROVIDER_ICON_CONFIGS: ModelProviderIconConfig[] = [
  {
    match: ['tripo3d', 'tripo'],
    name: 'Tripo3D AI',
    icon: '/images/model-provider/tripo3d.webp',
    whiteIcon: '/images/model-provider/tripo3d_white.svg',
  },
  {
    match: ['deepseek'],
    name: 'DeepSeek',
    icon: '/images/model-provider/deepseek.svg',
    whiteIcon: '/images/model-provider/deepseek_white.svg',
  },
  {
    match: ['anthropic', 'claude'],
    name: 'Anthropic',
    icon: '/images/model-provider/claude.svg',
    whiteIcon: '/images/model-provider/claude_white.svg',
  },
  {
    match: ['gemini', 'google', 'nano-banana', 'veo'],
    name: 'Google',
    icon: '/images/model-provider/google.svg',
    whiteIcon: '/images/model-provider/google_white.png',
  },
  {
    match: ['grok', 'x-ai', 'xai'],
    name: 'Grok',
    icon: '/images/model-provider/grok.svg',
    whiteIcon: '/images/model-provider/grok_white.svg',
    background: 'light',
  },
  {
    match: ['glm', 'zhipu', 'z-ai', 'z.ai', 'zai'],
    name: 'GLM',
    icon: '/images/model-provider/glm.svg',
    whiteIcon: '/images/model-provider/glm_white.svg',
  },
  {
    match: ['happyhorse', 'happy-horse'],
    name: 'Happy Horse',
    icon: '/images/model-provider/happy_horse.svg',
    whiteIcon: '/images/model-provider/happy_horse_white.png',
  },
  {
    match: ['moonshot', 'kimi'],
    name: 'Kimi',
    icon: '/images/model-provider/kimi.webp',
    whiteIcon: '/images/model-provider/kimi_white.svg',
  },
  {
    match: ['minimax'],
    name: 'MiniMax',
    icon: '/images/model-provider/minimax.svg',
    whiteIcon: '/images/model-provider/minimax_white.svg',
  },
  {
    match: ['kling', 'kuaishou'],
    name: 'Kling',
    icon: '/images/model-provider/kling.svg',
    whiteIcon: '/images/model-provider/kling_white.png',
  },
  {
    match: ['openai', 'gpt', 'chatgpt'],
    name: 'OpenAI',
    icon: '/images/model-provider/openai.svg',
    whiteIcon: '/images/model-provider/openai_white.png',
  },
  {
    match: ['pixverse'],
    name: 'Pixverse',
    icon: '/images/model-provider/pixverse.svg',
    whiteIcon: '/images/model-provider/pixverse_white.svg',
  },
  {
    match: ['qwen', 'z-image'],
    name: 'Qwen',
    icon: '/images/model-provider/wan.svg',
    whiteIcon: '/images/model-provider/wan_white.png',
  },
  {
    match: ['wan'],
    name: 'Wan',
    icon: '/images/model-provider/wan.svg',
    whiteIcon: '/images/model-provider/wan_white.png',
  },
  {
    match: ['alibaba'],
    name: 'Alibaba',
    icon: '/images/model-provider/wan.svg',
    whiteIcon: '/images/model-provider/wan_white.png',
  },
  {
    match: ['seedance'],
    name: 'Seedance',
    icon: '/images/model-provider/bytedance.svg',
    whiteIcon: '/images/model-provider/bytedance_white.png',
  },
  {
    match: ['seedream'],
    name: 'Seedream',
    icon: '/images/model-provider/bytedance.svg',
    whiteIcon: '/images/model-provider/bytedance_white.png',
  },
  {
    match: ['bytedance'],
    name: 'ByteDance',
    icon: '/images/model-provider/bytedance.svg',
    whiteIcon: '/images/model-provider/bytedance_white.png',
  },
  {
    match: ['vidu'],
    name: 'Vidu',
    icon: '/images/model-provider/vidu.svg',
    whiteIcon: '/images/model-provider/vidu_white.svg',
  },
  {
    match: ['flux', 'black-forest-labs'],
    name: 'Black Forest Labs',
    icon: '/images/model-provider/flux.svg',
    whiteIcon: '/images/model-provider/flux_white.svg',
    background: 'light',
  },
  {
    match: ['flaq-ai', 'flaqai'],
    name: 'Flaq AI',
    icon: '/images/model-provider/flaq.svg',
    whiteIcon: '/images/model-provider/flaq_white.svg',
  },
];

export function getModelProviderIconConfig(value: string) {
  const lowerValue = value.toLowerCase();

  return MODEL_PROVIDER_ICON_CONFIGS.find((provider) => (
    provider.match.some((match) => lowerValue.startsWith(match))
  ));
}
