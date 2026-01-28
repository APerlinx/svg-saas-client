import { useEffect, useMemo, useRef, useState } from 'react'
import { AI_MODELS } from '../constants/models'
import { SVG_STYLES } from '../constants/svgStyles'
import ChatGptIcon from '../components/icons/ChatGptIcon'
import GoogleIcon from '../components/icons/GoogleIcon'
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
    <div className="w-full max-w-none mx-auto py-10 sm:py-14 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
        <div className="h-fit">
          <aside className="w-full lg:fixed lg:top-44 lg:w-[260px] h-fit rounded-3xl border border-gray-200/60 bg-white/70 backdrop-blur-sm p-5">
            <div className="text-sm font-semibold text-gray-900">Filters</div>

            <div className="mt-4">
              <div className="text-xs font-semibold text-gray-700">Style</div>
              <div className="mt-2 flex flex-col gap-0.5">
                {styleOptions.map((opt) => {
                  const isActive = styleFilter === opt.value
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      className={cn(
                        'w-full text-left text-sm transition-colors rounded-md px-2 py-1',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wizard-orange/40',
                        isActive
                          ? 'text-gray-900 font-semibold'
                          : 'text-gray-600 hover:text-gray-900',
                      )}
                      onClick={() => setStyleFilter(opt.value)}
                    >
                      {opt.label}
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="mt-6">
              <div className="text-xs font-semibold text-gray-700">Model</div>
              <div className="mt-2 flex flex-col gap-0.5">
                {modelOptions.map((opt) => {
                  const isActive = modelFilter === opt.value
                  const icon =
                    opt.value === 'all'
                      ? undefined
                      : (opt as (typeof AI_MODELS)[number]).icon

                  return (
                    <button
                      key={opt.value}
                      type="button"
                      className={cn(
                        'w-full text-left text-sm transition-colors rounded-md px-2 py-1',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wizard-orange/40',
                        isActive
                          ? 'text-gray-900 font-semibold'
                          : 'text-gray-600 hover:text-gray-900',
                      )}
                      onClick={() => setModelFilter(opt.value)}
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
              <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {errorMessage}
              </div>
            )}
          </aside>
        </div>

        <main>
          <div className="rounded-3xl bg-linear-to-r from-wizard-blue/15 to-wizard-gold/10 backdrop-blur-sm border border-gray-200/50 p-6 sm:p-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Community Gallery
            </h1>
            <p className="text-gray-700 mt-2 max-w-2xl">
              Browse public SVGs generated by the community. Filter by style or
              model and load more as you explore.
            </p>
          </div>

          <div className="mt-6">
            {isLoading ? (
              <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(140px,1fr))]">
                {Array.from({ length: 18 }).map((_, i) => (
                  <div
                    key={i}
                    className="aspect-square rounded-2xl border border-gray-200/60 bg-white/70 p-6"
                  >
                    <div className="h-full w-full rounded-xl bg-gray-100 animate-pulse" />
                  </div>
                ))}
              </div>
            ) : items.length === 0 ? (
              <div className="rounded-3xl border border-gray-200/60 bg-white/70 p-10 text-center">
                <h2 className="text-xl font-semibold text-gray-900">
                  No results
                </h2>
                <p className="text-gray-600 mt-2">Try adjusting the filters.</p>
              </div>
            ) : (
              <>
                <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(140px,1fr))]">
                  {items.map((item) => {
                    const clickable = Boolean(item.svgUrl)
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleOpenItem(item)}
                        disabled={!clickable}
                        className={cn(
                          'group aspect-square rounded-2xl border border-gray-200/60 bg-white/70 p-6 flex items-center justify-center transition-all',
                          clickable
                            ? 'cursor-pointer hover:bg-white hover:shadow-sm hover:-translate-y-0.5'
                            : 'cursor-default opacity-70',
                        )}
                        aria-label={
                          clickable
                            ? 'Open SVG preview'
                            : 'SVG preview unavailable'
                        }
                      >
                        {item.svgUrl ? (
                          <img
                            src={item.svgUrl}
                            alt=""
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <div className="text-sm text-gray-500">
                            No preview
                          </div>
                        )}
                      </button>
                    )
                  })}
                </div>

                <div className="mt-8 flex items-center justify-center">
                  {nextCursor ? (
                    <button
                      type="button"
                      onClick={() => void loadMore()}
                      disabled={isLoadingMore}
                      className="rounded-full px-6 py-3 font-semibold text-gray-900 bg-white border border-gray-200/70 hover:bg-gray-50 transition-colors disabled:opacity-60"
                    >
                      {isLoadingMore ? 'Loading…' : 'Load more'}
                    </button>
                  ) : (
                    <div className="text-sm text-gray-500">
                      You’ve reached the end.
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
