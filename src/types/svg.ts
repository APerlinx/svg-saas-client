// frontend/src/types/svg.ts
import type { SvgStyle } from '../constants/svgStyles'
import type { AiModel } from '../constants/models'

export interface PromptFormData {
  prompt: string
  style: SvgStyle
  isPrivate: boolean
  model: AiModel
}
