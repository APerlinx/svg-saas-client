import AmbientWaves from '../assets/Dashboard-background/AmbientWaves'
import PromptGenerator from '../components/PromptGenerator'
import GalleryIcon from '../components/icons/GalleryIcon'
import { CodeIcon } from '../components/icons/CodeIcon'
import InfoIcon from '../components/icons/InfoIcon'
import MoonEmptyStateIcon from '../components/icons/MoonEmptyStateIcon'

type CommunityItem = {
  id: string
  title: string
  subtitle: string
  accent: 'orange' | 'blue' | 'purple'
}

const COMMUNITY_PREVIEW: CommunityItem[] = [
  {
    id: 'wireframe-hero',
    title: 'Landing Hero',
    subtitle: 'Minimal • Flat • No background',
    accent: 'orange',
  },
  {
    id: 'icon-set',
    title: 'Icon Set',
    subtitle: 'Consistent strokes',
    accent: 'blue',
  },
  {
    id: 'empty-state',
    title: 'Empty State',
    subtitle: 'Product UI illustration',
    accent: 'purple',
  },
  {
    id: 'diagram',
    title: 'Diagram',
    subtitle: 'Clear labels & shapes',
    accent: 'blue',
  },
  {
    id: 'badge',
    title: 'Badge',
    subtitle: 'Brand-ready mark',
    accent: 'orange',
  },
  {
    id: 'mascot',
    title: 'Mascot',
    subtitle: 'Simple silhouette',
    accent: 'purple',
  },
]

function accentBg(accent: CommunityItem['accent']) {
  switch (accent) {
    case 'orange':
      return 'from-wizard-orange/25 to-wizard-gold/10'
    case 'blue':
      return 'from-wizard-blue/25 to-wizard-purple/10'
    case 'purple':
      return 'from-wizard-purple/20 to-wizard-blue/10'
  }
}

export default function Dashboard() {
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
          <section>
            <div className="flex items-end justify-between gap-4 flex-wrap">
              <div className="w-full text-center">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Recent stuff
                </h2>
              </div>

              <div className="w-full sm:w-auto sm:ml-auto flex justify-end">
                <button
                  type="button"
                  className="text-sm font-semibold text-gray-700 hover:text-gray-900 transition-colors"
                >
                  View all
                </button>
              </div>
            </div>

            <div className="rounded-3xl border border-gray-200/60 bg-white/60 p-8 sm:p-10 text-center shadow-sm">
              <div className="mx-auto flex items-center justify-center">
                <MoonEmptyStateIcon className="h-36 w-36 sm:h-44 sm:w-44" />
              </div>
              <div className="text-lg sm:text-xl font-semibold text-gray-900">
                No SVGs to show yet
              </div>
              <div className="mt-2 text-sm text-gray-600 max-w-md mx-auto">
                Your generated SVGs will appear here.
              </div>
            </div>
          </section>

          {/* Community */}
          <section>
            <h2 className="text-center text-2xl sm:text-3xl font-bold text-gray-900">
              Remix SVGs from the community
            </h2>

            <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {COMMUNITY_PREVIEW.map((item) => (
                <div
                  key={item.id}
                  className={`aspect-square rounded-2xl border border-gray-200/70 bg-linear-to-br ${accentBg(item.accent)} overflow-hidden`}
                  aria-label="Public SVG preview"
                >
                  <div className="h-full w-full bg-white/45 flex items-center justify-center"></div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  )
}
