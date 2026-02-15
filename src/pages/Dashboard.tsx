import AmbientWaves from '../assets/Dashboard-background/AmbientWaves'
import PromptGenerator from '../components/PromptGenerator'
import { CodeIcon } from '../components/icons/CodeIcon'
import DocsIcon from '../components/icons/DocsIcon'
import { useEffect, useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { fetchGenerationHistory } from '../services/userService'
import RecentHistorySection, {
  type RecentHistoryItem,
} from '../components/dashboard/RecentHistorySection'

export default function Dashboard() {
  const { user } = useAuth()
  const userId = user?.id

  const [historyItems, setHistoryItems] = useState<RecentHistoryItem[] | null>(
    null,
  )

  useEffect(() => {
    let cancelled = false

    const run = async () => {
      if (!userId) {
        setHistoryItems(null)
        return
      }

      try {
        const data = await fetchGenerationHistory({ limit: 6, cursor: null })
        const mapped: RecentHistoryItem[] = data.generations.map((g) => ({
          id: g.id,
          svgUrl: g.svgUrl,
          prompt: g.prompt,
          createdAt: g.createdAt,
        }))
        if (!cancelled) setHistoryItems(mapped)
      } catch {
        if (!cancelled) setHistoryItems([])
      }
    }

    void run()
    return () => {
      cancelled = true
    }
  }, [userId])

  return (
    <>
      <AmbientWaves />

      <div className="w-full max-w-7xl mx-auto px-4">
        <div className="min-h-[calc(100svh-6rem)] grid grid-rows-[1fr_auto]">
          <div className="pt-6 sm:pt-10 flex items-center">
            <div id="prompt-section" className="w-full">
              <div className="text-center mb-6 sm:mb-8">
                <div className="text-sm font-semibold text-gray-700">
                  Welcome to ChatSVG
                </div>
                <h1 className="mt-2 text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900">
                  Your AI-powered SVG creator
                </h1>
              </div>
              <PromptGenerator />
            </div>
          </div>

          <section className="pb-6 sm:pb-10">
            <h2 className="text-center text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
              New ways to create
            </h2>

            <div className="grid lg:grid-cols-3 gap-4">
              <div className="group relative overflow-hidden rounded-3xl border border-gray-200/60 bg-white/60 p-6 shadow-sm transition-colors hover:bg-white/70 motion-safe:transition-[transform,box-shadow,background-color] motion-safe:duration-300 motion-safe:ease-out motion-safe:hover:-translate-y-1 motion-safe:hover:scale-[1.01] hover:shadow-md">
                <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <div className="absolute inset-0 bg-linear-to-br from-wizard-orange/6 to-wizard-gold/4" />
                  <div className="absolute -inset-y-10 -left-1/2 w-1/3 rotate-12 bg-white/25 blur-sm motion-safe:translate-x-[-140%] motion-safe:transition-transform motion-safe:duration-700 motion-safe:ease-out group-hover:motion-safe:translate-x-[520%]" />
                </div>
                <div className="flex items-start gap-4">
                  <span className="shrink-0 inline-flex h-10 w-10 min-w-10 items-center justify-center rounded-2xl bg-linear-to-br from-wizard-orange/20 to-wizard-gold/10 border border-wizard-orange/20 motion-safe:transition-transform motion-safe:duration-300 motion-safe:ease-out group-hover:motion-safe:scale-110">
                    <CodeIcon size="18" className="text-gray-900" />
                  </span>

                  <div>
                    <div className="text-sm font-semibold text-gray-900">
                      Web App
                    </div>
                    <div className="mt-1 text-lg font-bold text-gray-900">
                      Generate with AI
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      Create custom SVGs instantly—describe what you want, pick
                      a style, and download.
                    </div>
                  </div>
                </div>
              </div>

              <div className="group relative overflow-hidden rounded-3xl border border-gray-200/60 bg-white/60 p-6 shadow-sm transition-colors hover:bg-white/70 motion-safe:transition-[transform,box-shadow,background-color] motion-safe:duration-300 motion-safe:ease-out motion-safe:hover:-translate-y-1 motion-safe:hover:scale-[1.01] hover:shadow-md">
                <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <div className="absolute inset-0 bg-linear-to-br from-wizard-blue/6 to-wizard-purple/4" />
                  <div className="absolute -inset-y-10 -left-1/2 w-1/3 rotate-12 bg-white/25 blur-sm motion-safe:translate-x-[-140%] motion-safe:transition-transform motion-safe:duration-700 motion-safe:ease-out group-hover:motion-safe:translate-x-[520%]" />
                </div>
                <div className="flex items-start gap-4">
                  <span className="shrink-0 inline-flex h-10 w-10 min-w-10 items-center justify-center rounded-2xl bg-linear-to-br from-wizard-blue/20 to-wizard-purple/10 border border-wizard-blue/20 motion-safe:transition-transform motion-safe:duration-300 motion-safe:ease-out group-hover:motion-safe:scale-110">
                    <DocsIcon size="18" className="text-gray-900" />
                  </span>

                  <div>
                    <div className="text-sm font-semibold text-gray-900">
                      API Service
                    </div>
                    <div className="mt-1 text-lg font-bold text-gray-900">
                      Integrate Anywhere
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      REST API for programmatic SVG generation. Generate
                      on-demand in your apps.
                    </div>
                  </div>
                </div>
              </div>

              <div className="group relative overflow-hidden rounded-3xl border border-gray-200/60 bg-white/60 p-6 shadow-sm transition-colors hover:bg-white/70 motion-safe:transition-[transform,box-shadow,background-color] motion-safe:duration-300 motion-safe:ease-out motion-safe:hover:-translate-y-1 motion-safe:hover:scale-[1.01] hover:shadow-md">
                <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <div className="absolute inset-0 bg-linear-to-br from-purple-500/8 to-blue-500/4" />
                  <div className="absolute -inset-y-10 -left-1/2 w-1/3 rotate-12 bg-white/25 blur-sm motion-safe:translate-x-[-140%] motion-safe:transition-transform motion-safe:duration-700 motion-safe:ease-out group-hover:motion-safe:translate-x-[520%]" />
                </div>
                <div className="flex items-start gap-4">
                  <span className="shrink-0 inline-flex h-10 w-10 min-w-10 items-center justify-center rounded-2xl bg-linear-to-br from-purple-500/20 to-blue-500/10 border border-purple-500/20 motion-safe:transition-transform motion-safe:duration-300 motion-safe:ease-out group-hover:motion-safe:scale-110">
                    <svg
                      className="w-[18px] h-[18px] text-gray-900"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </span>

                  <div>
                    <div className="text-sm font-semibold text-gray-900">
                      MCP Server
                    </div>
                    <div className="mt-1 text-lg font-bold text-gray-900">
                      Claude Integration
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      Coming soon: Generate SVGs directly from Claude Desktop,
                      Cursor, and more.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="mt-10 sm:mt-12">
          <RecentHistorySection
            items={user ? historyItems : null}
            onDeleted={(generationId) => {
              setHistoryItems((prev) =>
                prev ? prev.filter((it) => it.id !== generationId) : prev,
              )
            }}
          />
        </div>
      </div>
    </>
  )
}
