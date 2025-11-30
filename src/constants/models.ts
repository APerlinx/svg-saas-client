// frontend/src/constants/models.ts
/**
 * Valid AI models
 * IMPORTANT: Keep this in sync with the backend version!
 * Last updated: 2025-11-30
 */
export const AI_MODELS = [
  { value: 'gpt-5-mini', label: 'GPT-5 Mini' },
  { value: 'gpt-4', label: 'GPT-4' },
] as const

export const VALID_MODELS = AI_MODELS.map((m) => m.value)

export type AiModel = (typeof VALID_MODELS)[number]

export const DEFAULT_MODEL: AiModel = 'gpt-5-mini'
