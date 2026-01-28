import AmbientWaves from '../assets/Dashboard-background/AmbientWaves'
import PromptGenerator from '../components/PromptGenerator'
import GalleryIcon from '../components/icons/GalleryIcon'
import { CodeIcon } from '../components/icons/CodeIcon'
import InfoIcon from '../components/icons/InfoIcon'
import { useEffect, useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import {
  getPublicSvgs,
  type PublicGenerationItem,
} from '../services/svgService'
import { fetchGenerationHistory } from '../services/userService'
import RecentHistorySection, {
  type RecentHistoryItem,
} from '../components/dashboard/RecentHistorySection'
import CommunityRemixSection from '../components/dashboard/CommunityRemixSection'

export default function Dashboard() {
  const { user } = useAuth()
  const userId = user?.id

  const [historyItems, setHistoryItems] = useState<RecentHistoryItem[] | null>(
    null,
  )
  const [communityItems, setCommunityItems] = useState<PublicGenerationItem[]>(
    [],
  )
  const [isCommunityLoading, setIsCommunityLoading] = useState(false)

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

  useEffect(() => {
    let cancelled = false

    const run = async () => {
      setIsCommunityLoading(true)
      try {
        const data = await getPublicSvgs(12)
        if (!cancelled) setCommunityItems(data.publicGenerations)
      } finally {
        if (!cancelled) setIsCommunityLoading(false)
      }
    }

    void run()
    return () => {
      cancelled = true
    }
  }, [])

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
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-linear-to-br from-wizard-orange/20 to-wizard-gold/10 border border-wizard-orange/20 motion-safe:transition-transform motion-safe:duration-300 motion-safe:ease-out group-hover:motion-safe:scale-110">
                    <CodeIcon size="18" className="text-gray-900" />
                  </span>

                  <div>
                    <div className="text-sm font-semibold text-gray-900">
                      Prompt
                    </div>
                    <div className="mt-1 text-lg font-bold text-gray-900">
                      Generate an SVG
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      Describe what you want, pick a style, ship the SVG.
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
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-linear-to-br from-wizard-blue/20 to-wizard-purple/10 border border-wizard-blue/20 motion-safe:transition-transform motion-safe:duration-300 motion-safe:ease-out group-hover:motion-safe:scale-110">
                    <InfoIcon size="18" className="text-gray-900" />
                  </span>

                  <div>
                    <div className="text-sm font-semibold text-gray-900">
                      Docs
                    </div>
                    <div className="mt-1 text-lg font-bold text-gray-900">
                      Learn the workflow
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      Prompt recipes, best practices, and collaboration tips.
                    </div>
                  </div>
                </div>
              </div>

              <div className="group relative overflow-hidden rounded-3xl border border-gray-200/60 bg-white/60 p-6 shadow-sm transition-colors hover:bg-white/70 motion-safe:transition-[transform,box-shadow,background-color] motion-safe:duration-300 motion-safe:ease-out motion-safe:hover:-translate-y-1 motion-safe:hover:scale-[1.01] hover:shadow-md">
                <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <div className="absolute inset-0 bg-linear-to-br from-wizard-purple/5 to-wizard-blue/4" />
                  <div className="absolute -inset-y-10 -left-1/2 w-1/3 rotate-12 bg-white/25 blur-sm motion-safe:translate-x-[-140%] motion-safe:transition-transform motion-safe:duration-700 motion-safe:ease-out group-hover:motion-safe:translate-x-[520%]" />
                </div>
                <div className="flex items-start gap-4">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-linear-to-br from-wizard-purple/15 to-wizard-blue/10 border border-wizard-purple/20 motion-safe:transition-transform motion-safe:duration-300 motion-safe:ease-out group-hover:motion-safe:scale-110">
                    <GalleryIcon size="18" className="text-gray-900" />
                  </span>

                  <div>
                    <div className="text-sm font-semibold text-gray-900">
                      Gallery
                    </div>
                    <div className="mt-1 text-lg font-bold text-gray-900">
                      Browse styles
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      Explore public SVGs for inspiration and remix.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="mt-10 sm:mt-12 space-y-10 sm:space-y-12">
          <RecentHistorySection items={user ? historyItems : null} />

          <CommunityRemixSection
            items={communityItems}
            isLoading={isCommunityLoading}
          />
        </div>
      </div>
    </>
  )
}
