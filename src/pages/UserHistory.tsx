import { useEffect, useMemo, useRef, useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import {
  fetchGenerationHistory,
  type UserGeneration,
} from '../services/userService'

type LoadState = 'idle' | 'loading' | 'error'

function cn(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(' ')
}

export default function UserHistory() {
  const { user } = useAuth()
  const userId = user?.id

  const [items, setItems] = useState<UserGeneration[]>([])
  const [state, setState] = useState<LoadState>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const requestIdRef = useRef(0)

  const title = useMemo(() => {
    return userId ? 'User history' : 'User history'
  }, [userId])

  useEffect(() => {
    const requestId = ++requestIdRef.current

    const run = async () => {
      if (!userId) {
        setItems([])
        setState('idle')
        setErrorMessage(null)
        return
      }

      setState('loading')
      setErrorMessage(null)

      try {
        const all: UserGeneration[] = []
        let cursor: string | null = null

        for (;;) {
          const data = await fetchGenerationHistory({ limit: 50, cursor })
          all.push(...data.generations)
          if (!data.nextCursor) break
          cursor = data.nextCursor
        }

        if (requestId !== requestIdRef.current) return
        setItems(all)
        setState('idle')
      } catch (e) {
        if (requestId !== requestIdRef.current) return
        setState('error')
        setErrorMessage(
          e instanceof Error ? e.message : 'Failed to load history',
        )
      }
    }

    void run()
  }, [userId])

  const isLoading = state === 'loading'

  return (
    <div className="w-full max-w-none mx-auto py-10 sm:py-14 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
        <aside className="w-full lg:w-[260px] h-fit rounded-3xl border border-gray-200/60 bg-white/70 backdrop-blur-sm p-5">
          <div className="text-sm font-semibold text-gray-900">History</div>
          <div className="mt-2 text-sm text-gray-600">
            All of your generated SVGs.
          </div>

          {!userId ? (
            <div className="mt-6 rounded-2xl border border-gray-200/70 bg-white/60 px-4 py-3 text-sm text-gray-700">
              Sign in to view your history.
            </div>
          ) : null}

          {errorMessage ? (
            <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {errorMessage}
            </div>
          ) : null}
        </aside>

        <main>
          <div className="rounded-3xl bg-linear-to-r from-wizard-blue/15 to-wizard-gold/10 backdrop-blur-sm border border-gray-200/50 p-6 sm:p-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
              {title}
            </h1>
            <p className="text-gray-700 mt-2 max-w-2xl">
              Your personal gallery of generated SVGs.
            </p>
          </div>

          <div className="mt-6">
            {isLoading ? (
              <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(140px,1fr))]">
                {Array.from({ length: 24 }).map((_, i) => (
                  <div
                    key={i}
                    className="aspect-square rounded-2xl border border-gray-200/70 bg-white/60 overflow-hidden"
                    aria-label="Loading your SVG preview"
                  >
                    <div className="h-full w-full bg-white/45 flex items-center justify-center">
                      <div className="h-full w-full bg-gray-100 animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div
                className={cn(
                  'grid gap-4',
                  'grid-cols-[repeat(auto-fill,minmax(140px,1fr))]',
                )}
              >
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="aspect-square rounded-2xl border border-gray-200/70 bg-white/60 overflow-hidden"
                    aria-label="Your SVG preview"
                  >
                    <div className="h-full w-full bg-white/45 flex items-center justify-center">
                      {item.svgUrl ? (
                        <img
                          src={item.svgUrl}
                          alt=""
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-contain p-3"
                        />
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!isLoading && userId && items.length === 0 && !errorMessage ? (
              <div className="mt-6 rounded-3xl border border-gray-200/60 bg-white/60 p-8 sm:p-10 text-center shadow-sm">
                <div className="text-lg sm:text-xl font-semibold text-gray-900">
                  No SVGs to show yet
                </div>
                <div className="mt-2 text-sm text-gray-600 max-w-md mx-auto">
                  Generate your first SVG on the dashboard.
                </div>
              </div>
            ) : null}
          </div>
        </main>
      </div>
    </div>
  )
}
