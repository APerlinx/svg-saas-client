function normalizeForJsx(svg: string) {
  return svg
    .replace(/class=/g, 'className=')
    .replace(/stroke-width/g, 'strokeWidth')
    .replace(/stroke-linecap/g, 'strokeLinecap')
    .replace(/stroke-linejoin/g, 'strokeLinejoin')
    .replace(/fill-rule/g, 'fillRule')
    .replace(/clip-rule/g, 'clipRule')
    .replace(/clip-path/g, 'clipPath')
}

export function svgToReactComponent(svg: string): string {
  const reactSvg = normalizeForJsx(svg).replace(/<svg/, '<svg {...props}')

  return `export const SvgIcon = (props) => (
  ${reactSvg}
)`
}

export function svgToTypeScriptComponent(svg: string): string {
  const reactSvg = svgToReactComponent(svg)

  return `interface SvgIconProps {
  className?: string
  size?: number
}

export const SvgIcon = ({ className, size = 24 }: SvgIconProps) => (
  ${reactSvg.replace(
    '<svg',
    '<svg className={className} width={size} height={size}',
  )}
)`
}

export function svgToDataUri(svg: string): string {
  const encoded = encodeURIComponent(svg)
  return `data:image/svg+xml,${encoded}`
}
