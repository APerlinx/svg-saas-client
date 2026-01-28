// frontend/src/constants/models.ts
/**
 * Valid AI models
 * IMPORTANT: Keep this in sync with the backend version! except coming soon models
 * Last updated: 2025-12-9
 */
export const AI_MODELS = [
  {
    value: 'gpt-4o',
    label: 'GPT-4o',
    icon: 'chat-gpt',
    section: 'partner',
  },
  {
    value: 'gpt-5-mini-2025-08-07',
    label: 'GPT-5',
    icon: 'chat-gpt',
    section: 'partner',
  },
  { value: 'gemini', label: 'Gemini', icon: 'google', section: 'coming-soon' },
  {
    value: 'claude-3-5-sonnet',
    label: 'Claude 3.5 Sonnet',
    icon: 'claude',
    section: 'coming-soon',
  },
] as const

export const VALID_MODELS = AI_MODELS.map((m) => m.value)

export type AiModel = (typeof VALID_MODELS)[number]

export const DEFAULT_MODEL: AiModel = 'gpt-4o'
