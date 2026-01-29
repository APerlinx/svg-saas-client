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
import { logger } from '../../services/logger'
import { downloadSvg } from '../../services/svgService'
import {
  svgToDataUri,
  svgToReactComponent,
  svgToTypeScriptComponent,
} from '../../utils/svgExport'
import { downloadBlob, svgTextToPngBlob } from '../../utils/svgPng'

interface SvgResultModalProps {
  isOpen: boolean
  onClose: () => void
  svgCode: string
  generationId?: string | null
  prompt?: string
  isGenerating?: boolean
  progress?: {
    percent: number
    label: string
    subtext?: string
  }
  error?: string | null
}

export default function SvgResultModal({
  isOpen,
  onClose,
  svgCode,
  generationId,
  prompt,
  isGenerating,
  progress,
  error,
}: SvgResultModalProps) {
  const [copiedButton, setCopiedButton] = useState<string | null>(null)
  const [isDownloading, setIsDownloading] = useState(false)
  const [downloadError, setDownloadError] = useState<string | null>(null)
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

  const handleCopy = async (content: string, buttonId: string) => {
    try {
      await navigator.clipboard.writeText(content)
      setCopiedButton(buttonId)
      setTimeout(() => setCopiedButton(null), 2000)
    } catch (err) {
      logger.error('Failed to copy to clipboard', err)
    }
  }

  const handleDownloadSVG = async () => {
    if (isDownloading) return

    setDownloadError(null)

    if (!generationId) {
      const blob = new Blob([svgCode], { type: 'image/svg+xml' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `generated-svg-${Date.now()}.svg`
      a.click()
      URL.revokeObjectURL(url)
      return
    }
    try {
      setIsDownloading(true)

      const response = await downloadSvg(generationId)
      const downloadUrl = response.downloadUrl
      if (!downloadUrl) {
        throw new Error('Download link is missing.')
      }

      const fileResponse = await fetch(downloadUrl)
      if (!fileResponse.ok) {
        throw new Error(`Failed to download (HTTP ${fileResponse.status}).`)
      }

      const blob = await fileResponse.blob()
      const objectUrl = URL.createObjectURL(blob)
      const filename = `chatsvg-${generationId}.svg`

      const link = document.createElement('a')
      link.href = objectUrl
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      // Give the browser a tick to start reading the Blob.
      setTimeout(() => URL.revokeObjectURL(objectUrl), 1000)
    } catch (err) {
      logger.error('Failed to download SVG', err)
      setDownloadError(
        'Download failed, Please try again later or contact support.',
      )
    } finally {
      setIsDownloading(false)
    }
  }

  const handleDownloadPNG = async () => {
    if (!svgCode) return
    try {
      setDownloadError(null)
      const pngBlob = await svgTextToPngBlob(svgCode)
      const name = generationId
        ? `chatsvg-${generationId}.png`
        : `generated-svg-${Date.now()}.png`
      downloadBlob(pngBlob, name)
    } catch (err) {
      logger.error('Failed to download PNG', err)
      setDownloadError(
        'Download failed, Please try again later or contact support.',
      )
    }
  }

  const handleEdit = () => {
    // Coming soon - open editor
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
      content: svgToReactComponent(svgCode),
      icon: <ReactIcon className="w-4 h-4" />,
    },
    {
      id: 'typescript',
      label: 'TypeScript',
      content: svgToTypeScriptComponent(svgCode),
      icon: <TypeScriptIcon className="w-4 h-4" />,
    },
    {
      id: 'cdn',
      label: 'Data URI',
      content: svgToDataUri(svgCode),
      icon: <LinkIcon className="w-4 h-4" />,
    },
  ]

  const progressPercent = Math.min(Math.max(progress?.percent ?? 0, 0), 100)
  const progressLabel = progress?.label ?? 'Preparing your SVG'
  const progressSubtext =
    progress?.subtext ?? 'Hang tight while we bring your idea to life.'

  const isPreviewReady = Boolean(svgCode) && !isGenerating && !error
  const showProgressState = !isPreviewReady && !error
  const showErrorState = Boolean(error)
  const disableExportActions = !isPreviewReady

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      fullScreenOnMobile
      disableContentScroll
      showCloseButton={!isGenerating}
      panelClassName="sm:max-h-[90vh]"
      contentClassName="px-3 sm:px-6 lg:px-8 pt-10 sm:pt-12 lg:pt-16 pb-4 sm:pb-6 lg:pb-8"
    >
      <div
        className="flex flex-col sm:grid sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 h-full min-h-0 min-w-0"
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
          <div className="bg-[rgb(17_17_17/55%)] rounded-2xl sm:rounded-3xl p-3 sm:p-6 lg:p-8 flex items-center justify-center h-52 sm:h-72 lg:h-[400px] border border-white/10 relative overflow-hidden min-w-0">
            {showProgressState && (
              <div className="w-full max-w-lg text-center flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-full border-2 border-dashed border-white/40 flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-linear-to-br from-wizard-blue to-wizard-orange animate-pulse" />
                </div>
                <div>
                  <p className="text-white font-semibold text-base sm:text-lg">
                    {progressLabel}
                  </p>
                  <p className="text-white/70 text-sm mt-1">
                    {progressSubtext}
                  </p>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-linear-to-r from-wizard-blue via-wizard-orange/80 to-wizard-orange transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <p className="text-[12px] text-white/60 uppercase tracking-[0.2em]">
                  Live status updates
                </p>
              </div>
            )}

            {showErrorState && (
              <div className="text-center max-w-md space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-wizard-orange/10 flex items-center justify-center border border-wizard-orange/40">
                  <svg
                    className="w-8 h-8 text-wizard-orange"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v4m0 4h.01M5.07 19h13.86c1.54 0 2.5-1.67 1.73-3L13.73 4c-.77-1.33-2.69-1.33-3.46 0L3.34 16c-.77 1.33.19 3 1.73 3z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-white text-lg font-semibold">
                    We couldn't finish this one
                  </p>
                  <p className="text-white/70 text-sm leading-relaxed">
                    {error}
                  </p>
                </div>
              </div>
            )}

            {isPreviewReady && (
              <div
                ref={previewRef}
                className="svg-preview w-full h-full min-w-0"
                dangerouslySetInnerHTML={{ __html: svgCode }}
              />
            )}
          </div>

          {/* Download Buttons */}
          <div className="flex gap-2 sm:gap-3">
            <button
              onClick={handleDownloadSVG}
              disabled={disableExportActions || isDownloading}
              className={`flex-1 flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg font-medium transition-all shadow-md text-sm ${
                disableExportActions || isDownloading
                  ? 'bg-white/10 text-white/40 cursor-not-allowed'
                  : 'bg-wizard-orange text-white hover:bg-wizard-orange/90 hover:shadow-lg'
              }`}
            >
              <DownloadIcon className="w-5 h-5" />
              {isDownloading ? 'Preparing download...' : 'Download SVG'}
            </button>

            <button
              type="button"
              onClick={handleDownloadPNG}
              disabled={disableExportActions}
              className={`flex-1 flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg font-medium transition-all relative text-sm ${
                disableExportActions
                  ? 'bg-white/5 text-white/30 cursor-not-allowed'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              <ImageIcon className="w-5 h-5" />
              Download PNG
            </button>
          </div>

          {downloadError && (
            <p className="text-red-400 text-xs mt-2">{downloadError}</p>
          )}
        </div>

        {/* Right side - Code & Actions */}
        <div className="flex flex-col gap-3 sm:gap-4 min-h-0 min-w-0">
          <h3 className="text-base sm:text-lg font-semibold text-white">
            {showErrorState ? 'What happened?' : 'Export Options'}
          </h3>

          {showErrorState ? (
            <div className="bg-[rgb(17_17_17/55%)] border border-red-500/30 rounded-2xl p-4 text-white/80 space-y-3">
              <p className="text-sm leading-relaxed">
                Something went wrong while completing your request. Check the
                preview panel for the exact message. Close this modal and try
                again, if the issue persists, contact support and include the
                message shown.
              </p>
              <button
                onClick={onClose}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-wizard-orange text-white rounded-lg font-semibold hover:bg-wizard-orange/90 transition-all"
              >
                Back to editor
              </button>
            </div>
          ) : (
            <>
              {/* Copy Buttons Grid */}
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                {copyButtons.map((button) => (
                  <button
                    key={button.id}
                    onClick={() => handleCopy(button.content, button.id)}
                    disabled={disableExportActions}
                    className={`flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg font-medium transition-all text-sm ${
                      disableExportActions
                        ? 'bg-[rgb(17_17_17/40%)] text-white/30 cursor-not-allowed'
                        : copiedButton === button.id
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
              <div className="bg-[rgb(17_17_17/55%)] rounded-2xl sm:rounded-3xl p-3 sm:p-4 border border-white/10 overflow-hidden relative min-h-[120px] flex flex-col">
                {isPreviewReady ? (
                  <pre className="text-[11px] sm:text-xs text-white/80 font-mono whitespace-pre-wrap break-all max-h-20 sm:max-h-40 overflow-hidden flex-1">
                    <code>{svgCode}</code>
                  </pre>
                ) : (
                  <div className="flex-1 flex flex-col justify-center items-start gap-2 text-white/50 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-wizard-orange animate-pulse" />
                      Preparing code snippets...
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-white/40 animate-pulse" />
                      Export options unlock once your SVG is ready.
                    </div>
                  </div>
                )}
                {isPreviewReady && (
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-linear-to-t from-[rgb(17_17_17/70%)] to-transparent" />
                )}
              </div>

              {/* Edit Button */}
              <button
                onClick={handleEdit}
                disabled={disableExportActions}
                className={`w-full flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg font-medium transition-all relative group text-sm ${
                  disableExportActions
                    ? 'bg-white/5 text-white/30 cursor-not-allowed'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
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
            </>
          )}
        </div>
      </div>
    </Modal>
  )
}
