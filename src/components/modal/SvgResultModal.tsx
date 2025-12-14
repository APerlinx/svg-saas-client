import { useEffect, useRef, useState } from 'react'
import Modal from './Modal'
import { CodeIcon } from '../icons/CodeIcon'
import { ReactIcon } from '../icons/ReactIcon'
import { TypeScriptIcon } from '../icons/TypeScriptIcon'
import { LinkIcon } from '../icons/LinkIcon'
import { DownloadIcon } from '../icons/DownloadIcon'
import { ImageIcon } from '../icons/ImageIcon'
import { CheckIcon } from '../icons/CheckIcon'
import { EditIcon } from '../icons/EditIcon'

interface SvgResultModalProps {
  isOpen: boolean
  onClose: () => void
  svgCode: string
  prompt?: string
}

export default function SvgResultModal({
  isOpen,
  onClose,
  svgCode,
  prompt,
}: SvgResultModalProps) {
  const [copiedButton, setCopiedButton] = useState<string | null>(null)
  const previewRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!isOpen) return

    const svgEl = previewRef.current?.querySelector('svg')
    if (!svgEl) return

    // Ensure the SVG scales to the container and stays centered.
    if (!svgEl.getAttribute('preserveAspectRatio')) {
      svgEl.setAttribute('preserveAspectRatio', 'xMidYMid meet')
    }
    svgEl.setAttribute('width', '100%')
    svgEl.setAttribute('height', '100%')
    ;(svgEl as unknown as HTMLElement).style.maxWidth = '100%'
    ;(svgEl as unknown as HTMLElement).style.maxHeight = '100%'
    ;(svgEl as unknown as HTMLElement).style.display = 'block'
  }, [isOpen, svgCode])

  // Convert SVG to React component format
  const convertToReact = (svg: string): string => {
    const reactSvg = svg
      .replace(/class=/g, 'className=')
      .replace(/stroke-width/g, 'strokeWidth')
      .replace(/stroke-linecap/g, 'strokeLinecap')
      .replace(/stroke-linejoin/g, 'strokeLinejoin')
      .replace(/fill-rule/g, 'fillRule')
      .replace(/clip-rule/g, 'clipRule')
      .replace(/clip-path/g, 'clipPath')
      .replace(/<svg/, '<svg {...props}')

    return `export const SvgIcon = (props) => (
  ${reactSvg}
)`
  }

  // Convert SVG to TypeScript component
  const convertToTypeScript = (svg: string): string => {
    const reactSvg = convertToReact(svg)
    return `interface SvgIconProps {
  className?: string
  size?: number
}

export const SvgIcon = ({ className, size = 24 }: SvgIconProps) => (
  ${reactSvg.replace(
    '<svg',
    '<svg className={className} width={size} height={size}'
  )}
)`
  }

  // Generate CDN-ready SVG (data URI)
  const convertToCDN = (svg: string): string => {
    const encoded = encodeURIComponent(svg)
    return `data:image/svg+xml,${encoded}`
  }

  const handleCopy = async (content: string, buttonId: string) => {
    try {
      await navigator.clipboard.writeText(content)
      setCopiedButton(buttonId)
      setTimeout(() => setCopiedButton(null), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleDownloadSVG = () => {
    const blob = new Blob([svgCode], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `generated-svg-${Date.now()}.svg`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleDownloadPNG = () => {
    // Coming soon - will convert SVG to PNG
    alert('PNG download coming soon!')
  }

  const handleEdit = () => {
    // Coming soon - open editor
    alert('Edit feature coming soon!')
  }

  const copyButtons = [
    {
      id: 'plain',
      label: 'SVG Code',
      content: svgCode,
      icon: <CodeIcon className="w-4 h-4" />,
    },
    {
      id: 'react',
      label: 'React',
      content: convertToReact(svgCode),
      icon: <ReactIcon className="w-4 h-4" />,
    },
    {
      id: 'typescript',
      label: 'TypeScript',
      content: convertToTypeScript(svgCode),
      icon: <TypeScriptIcon className="w-4 h-4" />,
    },
    {
      id: 'cdn',
      label: 'Data URI',
      content: convertToCDN(svgCode),
      icon: <LinkIcon className="w-4 h-4" />,
    },
  ]

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      fullScreenOnMobile
      disableContentScroll
      contentClassName="px-3 sm:px-8 pt-10 sm:pt-16 pb-3 sm:pb-8"
    >
      <div
        className="flex flex-col lg:grid lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 h-full min-h-0 min-w-0"
        data-testid="svg-result-modal"
      >
        {/* Left side - SVG Preview */}
        <div className="flex flex-col gap-3 sm:gap-4 min-h-0 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="text-base sm:text-lg font-semibold text-white">
              Preview
            </h3>
            {prompt && (
              <span className="text-xs text-white/60 italic max-w-[50vw] sm:max-w-xs truncate">
                "{prompt}"
              </span>
            )}
          </div>

          {/* SVG Preview Container */}
          <div
            className="bg-[rgba(150,149,149,0.55)] rounded-2xl p-3 sm:p-6 lg:p-8 flex items-center justify-center h-52 sm:h-80 lg:h-[400px] border-2 border-wizard-orange/20 relative overflow-hidden min-w-0"
            style={{
              backgroundImage: `
                radial-gradient(circle, rgba(255, 255, 255, 0.2) 1px, transparent 1px),
                radial-gradient(circle, rgba(255, 255, 255, 0.2) 1px, transparent 1px)
              `,
              backgroundSize: '20px 20px',
              backgroundPosition: '0 0, 10px 10px',
            }}
          >
            <div
              ref={previewRef}
              className="svg-preview w-full h-full min-w-0"
              dangerouslySetInnerHTML={{ __html: svgCode }}
            />
          </div>

          {/* Download Buttons */}
          <div className="flex gap-2 sm:gap-3">
            <button
              onClick={handleDownloadSVG}
              className="flex-1 flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 bg-wizard-orange text-white rounded-lg font-medium hover:bg-wizard-orange/90 transition-all shadow-md hover:shadow-lg text-sm"
            >
              <DownloadIcon className="w-5 h-5" />
              Download SVG
            </button>

            <button
              onClick={handleDownloadPNG}
              className="flex-1 flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 bg-white/10 text-white/70 rounded-lg font-medium hover:bg-white/20 transition-all relative group text-sm"
            >
              <ImageIcon className="w-5 h-5" />
              PNG
              <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-black/90 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                Coming Soon
              </span>
            </button>
          </div>
        </div>

        {/* Right side - Code & Actions */}
        <div className="flex flex-col gap-3 sm:gap-4 min-h-0 min-w-0">
          <h3 className="text-base sm:text-lg font-semibold text-white">
            Export Options
          </h3>

          {/* Copy Buttons Grid */}
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            {copyButtons.map((button) => (
              <button
                key={button.id}
                onClick={() => handleCopy(button.content, button.id)}
                className={`flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg font-medium transition-all text-sm ${
                  copiedButton === button.id
                    ? 'bg-green-500 text-white'
                    : 'bg-[rgb(17_17_17/55%)] text-white/90 hover:bg-[rgb(17_17_17/70%)] border border-wizard-orange/20'
                }`}
              >
                {copiedButton === button.id ? (
                  <>
                    <CheckIcon className="w-4 h-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    {button.icon}
                    {button.label}
                  </>
                )}
              </button>
            ))}
          </div>

          {/* Code Preview */}
          <div className="bg-[rgb(17_17_17/55%)] rounded-lg p-3 sm:p-4 border border-wizard-orange/20 overflow-hidden relative">
            <pre className="text-[11px] sm:text-xs text-white/80 font-mono whitespace-pre-wrap break-all max-h-20 sm:max-h-40 overflow-hidden">
              <code>{svgCode}</code>
            </pre>
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-linear-to-t from-[rgb(17_17_17/70%)] to-transparent" />
          </div>

          {/* Edit Button */}
          <button
            onClick={handleEdit}
            className="w-full flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 bg-white/10 text-white/70 rounded-lg font-medium hover:bg-white/20 transition-all relative group text-sm"
          >
            <EditIcon className="w-5 h-5" />
            Edit SVG
            <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-black/90 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              Coming Soon
            </span>
          </button>

          {/* Info Text */}
          <p className="text-[11px] sm:text-xs text-white/50 text-center">
            💡 Tip: Data URI can be used directly in{' '}
            <code className="bg-white/10 px-1 rounded text-wizard-orange">
              img src
            </code>{' '}
            or CSS backgrounds
          </p>
        </div>
      </div>
    </Modal>
  )
}
