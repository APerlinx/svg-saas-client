import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { logger } from '../../services/logger'
import { downloadSvg, getSvgCode } from '../../services/svgService'
import { deleteGeneration } from '../../services/userService'
import {
  svgToDataUri,
  svgToReactComponent,
  svgToTypeScriptComponent,
} from '../../utils/svgExport'
import { downloadBlob, svgTextToPngBlob } from '../../utils/svgPng'
import { QuickActionsIcon } from '../icons/QuickActionsIcon'
import { CodeIcon } from '../icons/CodeIcon'
import { ReactIcon } from '../icons/ReactIcon'
import { TypeScriptIcon } from '../icons/TypeScriptIcon'
import { LinkIcon } from '../icons/LinkIcon'
import { DownloadIcon } from '../icons/DownloadIcon'
import { ImageIcon } from '../icons/ImageIcon'
import InfoIcon from '../icons/InfoIcon'
import { EditIcon } from '../icons/EditIcon'
import { TrashIcon } from '../icons/TrashIcon'

type Props = {
  generationId: string
  svgUrl: string | null | undefined
  variant: 'public' | 'private'
  onDeleted?: (generationId: string) => void
}

type MenuAction = {
  id: string
  label: string
  icon: React.ReactNode
  danger?: boolean
  disabled?: boolean
  onSelect: () => void | Promise<void>
}

function cn(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(' ')
}

const QUICK_ACTIONS_HOVER_EVENT = 'svgqa:hover'

type QuickActionsHoverDetail = {
  generationId: string
}

export default function SvgQuickActionsMenu({
  generationId,
  svgUrl,
  variant,
  onDeleted,
}: Props) {
  const [open, setOpen] = useState(false)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [svgSource, setSvgSource] = useState<string | null>(null)

  const [deleteArmed, setDeleteArmed] = useState(false)

  const [placement, setPlacement] = useState<'down' | 'up'>('down')
  const [menuMaxHeight, setMenuMaxHeight] = useState<number | null>(null)

  const [inlineStatus, setInlineStatus] = useState<{
    actionId: string
    kind: 'success' | 'error'
    label: string
  } | null>(null)

  const inlineStatusTimerRef = useRef<ReturnType<
    typeof window.setTimeout
  > | null>(null)

  const rootRef = useRef<HTMLDivElement | null>(null)
  const menuRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const onHover = (e: Event) => {
      const detail = (e as CustomEvent<QuickActionsHoverDetail>).detail
      const hoveredId = detail?.generationId
      if (!hoveredId) return
      if (hoveredId !== generationId) setOpen(false)
    }

    window.addEventListener(QUICK_ACTIONS_HOVER_EVENT, onHover)
    return () => window.removeEventListener(QUICK_ACTIONS_HOVER_EVENT, onHover)
  }, [generationId])

  useEffect(() => {
    return () => {
      if (inlineStatusTimerRef.current) {
        window.clearTimeout(inlineStatusTimerRef.current)
        inlineStatusTimerRef.current = null
      }
    }
  }, [])

  const flashInlineStatus = (
    actionId: string,
    kind: 'success' | 'error',
    label: string,
  ) => {
    setInlineStatus({ actionId, kind, label })

    if (inlineStatusTimerRef.current) {
      window.clearTimeout(inlineStatusTimerRef.current)
    }

    inlineStatusTimerRef.current = window.setTimeout(() => {
      setInlineStatus(null)
      inlineStatusTimerRef.current = null
    }, 2000)
  }

  useEffect(() => {
    if (!open) return

    const onMouseDown = (e: MouseEvent) => {
      const target = e.target as Node
      if (rootRef.current && !rootRef.current.contains(target)) {
        setOpen(false)
      }
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }

    document.addEventListener('mousedown', onMouseDown)
    document.addEventListener('keydown', onKeyDown)

    return () => {
      document.removeEventListener('mousedown', onMouseDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  useEffect(() => {
    if (!open) setDeleteArmed(false)
  }, [open])

  useLayoutEffect(() => {
    if (!open) return

    const updatePlacement = () => {
      const root = rootRef.current
      const menu = menuRef.current
      if (!root || !menu) return

      const triggerRect = root.getBoundingClientRect()
      const menuHeight = Math.max(menu.scrollHeight, menu.offsetHeight)
      const viewportH = window.innerHeight
      const padding = 12

      const spaceBelow = viewportH - triggerRect.bottom - padding
      const spaceAbove = triggerRect.top - padding

      const shouldFlipUp = menuHeight > spaceBelow && spaceAbove > spaceBelow
      const nextPlacement: 'down' | 'up' = shouldFlipUp ? 'up' : 'down'
      setPlacement(nextPlacement)

      const available = nextPlacement === 'up' ? spaceAbove : spaceBelow
      const capped = Math.max(0, Math.min(360, available))
      setMenuMaxHeight(capped)
    }

    updatePlacement()

    const onScroll = () => updatePlacement()
    const onResize = () => updatePlacement()

    window.addEventListener('scroll', onScroll, true)
    window.addEventListener('resize', onResize)

    return () => {
      window.removeEventListener('scroll', onScroll, true)
      window.removeEventListener('resize', onResize)
    }
  }, [open])

  const ensureSvgSource = async (): Promise<string> => {
    if (svgSource) return svgSource

    const res = await getSvgCode(generationId)
    const svg = res.svg
    if (!svg) {
      // Fallback: try pulling SVG text from the URL (works only if CORS allows it).
      if (svgUrl) {
        const urlRes = await fetch(svgUrl)
        if (!urlRes.ok) {
          throw new Error(`Failed to fetch SVG source (HTTP ${urlRes.status}).`)
        }
        const text = await urlRes.text()
        if (!text.includes('<svg')) {
          throw new Error('SVG source is not available for this item yet.')
        }
        setSvgSource(text)
        return text
      }

      throw new Error('SVG source is not available for this item yet.')
    }

    setSvgSource(svg)
    return svg
  }

  const handleAction = async (
    actionId: string,
    fn: () => Promise<void>,
    opts?: {
      successLabel?: string
      errorLabel?: string
      closeOnDone?: boolean
      closeOnError?: boolean
      showInlineSuccess?: boolean
      showInlineError?: boolean
    },
  ) => {
    if (busyId) return
    setBusyId(actionId)
    try {
      await fn()
      if (opts?.showInlineSuccess !== false) {
        flashInlineStatus(actionId, 'success', opts?.successLabel ?? 'Done')
      }
      if (opts?.closeOnDone) setOpen(false)
    } catch (e) {
      if (opts?.showInlineError !== false) {
        flashInlineStatus(actionId, 'error', opts?.errorLabel ?? 'Failed')
      }
      logger.error(`QuickActions failed: ${actionId}`, e)
      if (opts?.closeOnError) setOpen(false)
    } finally {
      setBusyId(null)
    }
  }

  const comingSoon = () => {
    // Intentionally no toast/feedback for now.
  }

  const actions: MenuAction[] = [
    {
      id: 'copy-svg',
      label: 'Copy SVG',
      icon: <CodeIcon className="w-4 h-4" />,
      onSelect: async () => {
        await handleAction(
          'copy-svg',
          async () => {
            const svg = await ensureSvgSource()
            await navigator.clipboard.writeText(svg)
          },
          { successLabel: 'Copied' },
        )
      },
    },
    {
      id: 'copy-ts',
      label: 'Copy TypeScript',
      icon: <TypeScriptIcon className="w-4 h-4" />,
      onSelect: async () => {
        await handleAction(
          'copy-ts',
          async () => {
            const svg = await ensureSvgSource()
            await navigator.clipboard.writeText(svgToTypeScriptComponent(svg))
          },
          { successLabel: 'Copied' },
        )
      },
    },
    {
      id: 'copy-react',
      label: 'Copy React',
      icon: <ReactIcon className="w-4 h-4" />,
      onSelect: async () => {
        await handleAction(
          'copy-react',
          async () => {
            const svg = await ensureSvgSource()
            await navigator.clipboard.writeText(svgToReactComponent(svg))
          },
          { successLabel: 'Copied' },
        )
      },
    },
    {
      id: 'copy-uri',
      label: 'Copy URI',
      icon: <LinkIcon className="w-4 h-4" />,
      onSelect: async () => {
        await handleAction(
          'copy-uri',
          async () => {
            const svg = await ensureSvgSource()
            await navigator.clipboard.writeText(svgToDataUri(svg))
          },
          { successLabel: 'Copied' },
        )
      },
    },
    {
      id: 'details',
      label: 'Details',
      icon: <InfoIcon size="16" className="text-gray-700" />,
      disabled: true,
      onSelect: () => comingSoon(),
    },
    {
      id: 'edit',
      label: 'Edit SVG',
      icon: <EditIcon className="w-4 h-4" />,
      disabled: true,
      onSelect: () => comingSoon(),
    },
    {
      id: 'download-svg',
      label: 'Download SVG',
      icon: <DownloadIcon className="w-4 h-4" />,
      onSelect: async () => {
        await handleAction(
          'download-svg',
          async () => {
            try {
              const res = await downloadSvg(generationId)
              const downloadUrl = res.downloadUrl
              if (!downloadUrl) throw new Error('Download link is missing')

              const fileResponse = await fetch(downloadUrl)
              if (!fileResponse.ok) {
                throw new Error(
                  `Failed to download (HTTP ${fileResponse.status}).`,
                )
              }

              const blob = await fileResponse.blob()
              downloadBlob(blob, `chatsvg-${generationId}.svg`)
            } catch (e) {
              // Fallback: download directly from svgUrl if available.
              if (!svgUrl) throw e

              const fileResponse = await fetch(svgUrl)
              if (!fileResponse.ok) {
                throw new Error(
                  `Failed to download (HTTP ${fileResponse.status}).`,
                )
              }

              const blob = await fileResponse.blob()
              downloadBlob(blob, `chatsvg-${generationId}.svg`)
            }
          },
          { successLabel: 'Downloading' },
        )
      },
    },
    {
      id: 'download-png',
      label: 'Download PNG',
      icon: <ImageIcon className="w-4 h-4" />,
      onSelect: async () => {
        await handleAction(
          'download-png',
          async () => {
            const svg = await ensureSvgSource()
            const pngBlob = await svgTextToPngBlob(svg)
            downloadBlob(pngBlob, `chatsvg-${generationId}.png`)
          },
          { successLabel: 'Downloading' },
        )
      },
    },
  ]

  if (variant === 'private') {
    actions.push({
      id: 'delete',
      label: 'Delete SVG',
      danger: true,
      icon: <TrashIcon className="w-4 h-4" />,
      onSelect: async () => {
        if (busyId) return

        if (!deleteArmed) {
          setDeleteArmed(true)
          return
        }

        setDeleteArmed(false)
        await handleAction(
          'delete',
          async () => {
            await deleteGeneration(generationId)
            window.setTimeout(() => {
              onDeleted?.(generationId)
            }, 2000)
          },
          {
            successLabel: 'Deleted successfully',
            errorLabel: 'Delete failed',
            showInlineSuccess: true,
            showInlineError: true,
            closeOnDone: true,
          },
        )
      },
    })
  }

  return (
    <div ref={rootRef} className="absolute top-2 right-2 z-20">
      <button
        type="button"
        aria-label="Quick actions"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={(e) => {
          e.stopPropagation()
          setOpen((v) => !v)
        }}
        className={cn(
          'h-8 w-8 ',
          'flex items-center justify-center',
          'text-gray-800',
          'opacity-0 group-hover:opacity-100 transition-opacity',
          'focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wizard-orange/40',
        )}
      >
        <QuickActionsIcon className="text-gray-800" />
      </button>

      {open ? (
        <div
          ref={menuRef}
          role="menu"
          aria-label="Quick actions"
          className={cn(
            'absolute right-0 w-52 rounded-xl border border-gray-200/60 bg-white/95 backdrop-blur-md shadow-lg overflow-hidden z-30',
            placement === 'up' ? 'bottom-full mb-2' : 'top-full mt-2',
          )}
          style={
            menuMaxHeight !== null
              ? { maxHeight: `${menuMaxHeight}px` }
              : undefined
          }
          onClick={(e) => e.stopPropagation()}
        >
          <div className="sticky top-0 px-3 py-1.5 text-[11px] font-semibold text-gray-500 uppercase tracking-wide bg-white/95 backdrop-blur-md">
            Quick actions
          </div>
          <div className="pt-1 pb-2 overflow-y-auto overscroll-contain">
            {actions.map((action) => {
              const isBusy = busyId === action.id
              const isDisabled = Boolean(action.disabled) || Boolean(busyId)

              const isInline = inlineStatus?.actionId === action.id
              const inlineKind = isInline ? inlineStatus!.kind : null
              const inlineLabel = isInline ? inlineStatus!.label : null

              const rowTone = isInline
                ? inlineKind === 'success'
                  ? 'bg-green-50 text-green-700'
                  : 'bg-red-50 text-red-700'
                : ''

              return (
                <button
                  key={action.id}
                  type="button"
                  role="menuitem"
                  disabled={isDisabled}
                  onClick={() => {
                    if (action.disabled) {
                      action.onSelect()
                      return
                    }
                    void action.onSelect()
                  }}
                  className={cn(
                    'w-full px-3 py-2 text-sm flex items-center gap-2 text-left transition-colors',
                    action.danger
                      ? 'text-red-600 hover:bg-red-50'
                      : 'text-gray-700 hover:bg-gray-100/60',
                    rowTone,
                    isDisabled && !action.disabled
                      ? 'opacity-60 cursor-wait'
                      : action.disabled
                        ? 'opacity-50 cursor-not-allowed'
                        : '',
                  )}
                >
                  <span
                    className={cn(
                      'shrink-0',
                      action.danger ? 'text-red-600' : 'text-gray-700',
                    )}
                  >
                    {isInline ? (
                      inlineKind === 'success' ? (
                        <span className="text-sm font-bold leading-none">
                          ✓
                        </span>
                      ) : (
                        <span className="text-sm font-bold leading-none">
                          ×
                        </span>
                      )
                    ) : (
                      action.icon
                    )}
                  </span>
                  <span className="min-w-0 flex-1 truncate">
                    {isInline
                      ? inlineLabel
                      : isBusy
                        ? 'Working…'
                        : action.id === 'delete' && deleteArmed
                          ? 'Confirm'
                          : action.label}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      ) : null}
    </div>
  )
}
