export type SvgStyle =
  | 'minimal'
  | 'modern'
  | 'flat'
  | 'gradient'
  | 'line-art'
  | '3d'

export interface PromptFormData {
  prompt: string
  style: SvgStyle
  isPrivate: boolean
}
