import { useEffect, useMemo, useRef, useState } from 'react'
import { AI_MODELS } from '../constants/models'
import { SVG_STYLES } from '../constants/svgStyles'
import ChatGptIcon from '../components/icons/ChatGptIcon'
import GoogleIcon from '../components/icons/GoogleIcon'
import ClaudeIcon from '../components/icons/ClaudeIcon'
import SvgQuickActionsMenu from '../components/ui/SvgQuickActionsMenu'
import type {
  PublicGenerationsResponse,
  PublicGenerationItem,
} from '../services/svgService'
import { getPublicSvgs } from '../services/svgService'

const LIMIT = 50

type LoadState = 'idle' | 'loading' | 'loadingMore' | 'error'

function cn(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(' ')
}

function ModelIcon({ icon }: { icon?: string }) {
  if (!icon) return null
  if (icon === 'chat-gpt') {
    return <ChatGptIcon size="16" className="text-gray-800" />
  }
  if (icon === 'google') {
    return <GoogleIcon size="16" className="h-4 w-4" />
  }
  if (icon === 'claude') {
    return <ClaudeIcon size="16" className="text-wizard-orange" />
  }
  return null
}

export default function Gallery() {
  const [styleFilter, setStyleFilter] = useState<string>('all')
  const [modelFilter, setModelFilter] = useState<string>('all')

  const [items, setItems] = useState<PublicGenerationItem[]>([])
  const [nextCursor, setNextCursor] = useState<string | null>(null)
  const [state, setState] = useState<LoadState>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const requestIdRef = useRef(0)
  const filtersRef = useRef<HTMLElement | null>(null)

  const styleOptions = useMemo(
    () => [{ value: 'all', label: 'All' }, ...SVG_STYLES],
    [],
  )

  const modelOptions = useMemo(
    () => [{ value: 'all', label: 'All' }, ...AI_MODELS],
    [],
  )

  const effectiveStyle = styleFilter === 'all' ? undefined : styleFilter
  const effectiveModel = modelFilter === 'all' ? undefined : modelFilter

  const fetchPage = async (opts: {
    reset: boolean
    cursor?: string
  }): Promise<PublicGenerationsResponse> => {
    return await getPublicSvgs(
      LIMIT,
      opts.cursor,
      effectiveStyle,
      effectiveModel,
    )
  }

  const loadInitial = async () => {
    const requestId = ++requestIdRef.current
    setState('loading')
    setErrorMessage(null)

    try {
      const data = await fetchPage({ reset: true })
      if (requestId !== requestIdRef.current) return
      setItems(data.publicGenerations)
      setNextCursor(data.nextCursor)
      setState('idle')
    } catch (e) {
      if (requestId !== requestIdRef.current) return
      setState('error')
      setErrorMessage(e instanceof Error ? e.message : 'Failed to load gallery')
    }
  }

  const loadMore = async () => {
    if (!nextCursor) return
    const requestId = ++requestIdRef.current
    setState('loadingMore')
    setErrorMessage(null)

    try {
      const data = await fetchPage({ reset: false, cursor: nextCursor })
      if (requestId !== requestIdRef.current) return
      setItems((prev) => [...prev, ...data.publicGenerations])
      setNextCursor(data.nextCursor)
      setState('idle')
    } catch (e) {
      if (requestId !== requestIdRef.current) return
      setState('error')
      setErrorMessage(e instanceof Error ? e.message : 'Failed to load more')
    }
  }

  useEffect(() => {
    void loadInitial()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [styleFilter, modelFilter])

  const isLoading = state === 'loading'
  const isLoadingMore = state === 'loadingMore'

  const handleOpenItem = (item: PublicGenerationItem) => {
    if (!item.svgUrl) return
    window.open(item.svgUrl, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="w-full max-w-[1600px] mx-auto py-10 sm:py-14 px-4">
      {/* Page Header */}
      <div className="mb-8">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Community Gallery
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore thousands of AI-generated SVG icons created by our
            community. Filter by style or model to find inspiration.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
        <aside
          id="gallery-filters"
          ref={filtersRef}
          className="w-full lg:w-[280px] h-fit rounded-2xl border border-gray-200 bg-white shadow-sm p-6 sticky top-6"
        >
          <div className="flex items-center gap-2 mb-6">
            <svg
              className="w-5 h-5 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
            <div className="text-lg font-bold text-gray-900">Filters</div>
          </div>

          <div className="mb-6">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Style
            </div>
            <div className="flex flex-col gap-1">
              {styleOptions.map((opt) => {
                const isActive = styleFilter === opt.value
                return (
                  <button
                    key={opt.value}
                    type="button"
                    className={cn(
                      'w-full text-left text-sm transition-all rounded-lg px-3 py-2',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40',
                      isActive
                        ? 'bg-linear-to-r from-blue-500 to-blue-600 text-white font-semibold shadow-sm'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900',
                    )}
                    onClick={() => setStyleFilter(opt.value)}
                  >
                    {opt.label}
                  </button>
                )
              })}
            </div>
          </div>

          <div>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Model
            </div>
            <div className="flex flex-col gap-1">
              {modelOptions.map((opt) => {
                const isActive = modelFilter === opt.value
                const icon =
                  opt.value === 'all'
                    ? undefined
                    : (opt as (typeof AI_MODELS)[number]).icon

                const isComingSoon =
                  opt.value !== 'all' &&
                  (opt as (typeof AI_MODELS)[number]).section === 'coming-soon'

                return (
                  <button
                    key={opt.value}
                    type="button"
                    className={cn(
                      'w-full text-left text-sm transition-all rounded-lg px-3 py-2',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40',
                      isComingSoon
                        ? 'text-gray-400 cursor-not-allowed opacity-60'
                        : isActive
                          ? 'bg-linear-to-r from-blue-500 to-blue-600 text-white font-semibold shadow-sm'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900',
                    )}
                    onClick={() => {
                      if (!isComingSoon) setModelFilter(opt.value)
                    }}
                    disabled={isComingSoon}
                  >
                    <span className="inline-flex items-center gap-2">
                      <ModelIcon icon={icon} />
                      <span>{opt.label}</span>
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {errorMessage && (
            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {errorMessage}
            </div>
          )}
        </aside>

        <main>
          {isLoading ? (
            <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(160px,1fr))]">
              {Array.from({ length: 18 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-square rounded-2xl border border-gray-200 bg-white shadow-sm p-6"
                >
                  <div className="h-full w-full rounded-xl bg-linear-to-br from-gray-100 to-gray-200 animate-pulse" />
                </div>
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                No results found
              </h2>
              <p className="text-gray-600">
                Try adjusting your filters to see more SVGs.
              </p>
            </div>
          ) : (
            <>
              <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(160px,1fr))]">
                {items.map((item) => {
                  const clickable = Boolean(item.svgUrl)
                  return (
                    <div
                      key={item.id}
                      role={clickable ? 'button' : undefined}
                      tabIndex={clickable ? 0 : undefined}
                      onMouseEnter={() => {
                        window.dispatchEvent(
                          new CustomEvent('svgqa:hover', {
                            detail: { generationId: item.id },
                          }),
                        )
                      }}
                      onFocus={() => {
                        window.dispatchEvent(
                          new CustomEvent('svgqa:hover', {
                            detail: { generationId: item.id },
                          }),
                        )
                      }}
                      onClick={() => {
                        if (clickable) handleOpenItem(item)
                      }}
                      onKeyDown={(e) => {
                        if (!clickable) return
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          handleOpenItem(item)
                        }
                      }}
                      className={cn(
                        'relative z-0 hover:z-30 focus-within:z-30 group aspect-square rounded-2xl border border-gray-200 bg-white shadow-sm p-6 flex items-center justify-center transition-all duration-200',
                        clickable
                          ? 'cursor-pointer hover:shadow-md hover:border-blue-300 hover:-translate-y-1 hover:scale-[1.02]'
                          : 'cursor-default',
                      )}
                      aria-label={
                        clickable
                          ? 'Open SVG preview'
                          : 'SVG preview unavailable'
                      }
                    >
                      <SvgQuickActionsMenu
                        generationId={item.id}
                        svgUrl={item.svgUrl}
                        variant="public"
                      />
                      {item.svgUrl ? (
                        <img
                          src={item.svgUrl}
                          alt=""
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <div className="text-sm text-gray-500 opacity-70">
                          No preview
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>

              <div className="mt-10 flex items-center justify-center">
                {nextCursor ? (
                  <button
                    type="button"
                    onClick={() => void loadMore()}
                    disabled={isLoadingMore}
                    className="rounded-xl px-8 py-3 font-semibold text-white bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-sm hover:shadow-md transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isLoadingMore ? (
                      <span className="flex items-center gap-2">
                        <svg
                          className="animate-spin h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Loading…
                      </span>
                    ) : (
                      'Load More'
                    )}
                  </button>
                ) : (
                  <div className="text-gray-500 bg-gray-50 rounded-full px-6 py-3 border border-gray-200">
                    ✓ You've reached the end
                  </div>
                )}
              </div>
            </>
          )}
        </main>
      </div>

      <button
        type="button"
        onClick={() => {
          filtersRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          })
        }}
        className="lg:hidden fixed bottom-6 right-6 z-40 rounded-xl px-5 py-3 text-sm font-semibold text-white bg-linear-to-r from-blue-600 to-blue-700 shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-blue-800 backdrop-blur-sm transition-all"
      >
        <span className="flex items-center gap-2">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
            />
          </svg>
          Filters
        </span>
      </button>
    </div>
  )
}
