import { Link } from 'react-router-dom'
import type { PublicGenerationItem } from '../../services/svgService'

type Props = {
  items: PublicGenerationItem[]
  isLoading: boolean
}

export default function CommunityRemixSection({ items, isLoading }: Props) {
  return (
    <section>
      <h2 className="text-center text-2xl sm:text-3xl font-bold text-gray-900">
        Remix SVGs from the community
      </h2>

      <div className="relative mt-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {isLoading
            ? Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-square rounded-2xl border border-gray-200/70 bg-white/60 overflow-hidden"
                  aria-label="Loading public SVG preview"
                >
                  <div className="h-full w-full bg-white/45 flex items-center justify-center">
                    <div className="h-full w-full bg-gray-100 animate-pulse" />
                  </div>
                </div>
              ))
            : items.map((item) => (
                <div
                  key={item.id}
                  className="aspect-square rounded-2xl border border-gray-200/70 bg-white/60 overflow-hidden"
                  aria-label="Public SVG preview"
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

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-linear-to-t from-white to-transparent" />
        <div className="absolute inset-x-0 bottom-8 flex justify-center">
          <Link
            to="/gallery"
            className="rounded-full px-5 py-2 text-sm font-semibold text-gray-900 bg-white/90 border border-gray-200/70 backdrop-blur-sm hover:bg-white transition-colors"
          >
            Show more in gallery
          </Link>
        </div>
      </div>
    </section>
  )
}
