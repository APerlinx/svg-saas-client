// frontend/src/constants/svgStyles.ts
/**
 * Valid SVG styles supported by the application
 * IMPORTANT: Keep this in sync with the backend version!
 * Last updated: 2025-11-30
 */
export const SVG_STYLES = [
  { value: 'outline', label: 'Outline' },
  { value: 'filled', label: 'Filled' },
  { value: 'minimal', label: 'Minimal' },
  { value: 'modern', label: 'Modern' },
  { value: 'flat', label: 'Flat' },
  { value: 'gradient', label: 'Gradient' },
  { value: 'line-art', label: 'Line Art' },
  { value: '3d', label: '3D' },
  { value: 'cartoon', label: 'Cartoon' },
] as const

export const VALID_SVG_STYLES = SVG_STYLES.map((s) => s.value)

export type SvgStyle = (typeof VALID_SVG_STYLES)[number]

export const DEFAULT_STYLE: SvgStyle = 'outline'
