import { useId } from 'react'

type MoonEmptyStateIconProps = {
  className?: string
}

export default function MoonEmptyStateIcon({
  className = 'h-6 w-6',
}: MoonEmptyStateIconProps) {
  const reactId = useId().replace(/[:]/g, '')
  const maskId = `moon-crescent-mask-${reactId}`

  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <mask id={maskId}>
          <rect width="100" height="100" fill="black" />
          <circle cx="50" cy="50" r="28" fill="white" />
          <circle cx="62" cy="42" r="28" fill="black" />
        </mask>
      </defs>

      {/* Base moon */}
      <g className="text-wizard-gold/35">
        <circle
          cx="50"
          cy="50"
          r="28"
          fill="currentColor"
          mask={`url(#${maskId})`}
        />
      </g>

      {/* Soft warm shadow */}
      <g className="text-wizard-orange/10">
        <circle
          cx="54"
          cy="56"
          r="22"
          fill="currentColor"
          mask={`url(#${maskId})`}
          opacity="0.65"
        />
      </g>

      {/* Highlight */}
      <g className="text-white/55">
        <circle
          cx="44"
          cy="42"
          r="16"
          fill="currentColor"
          mask={`url(#${maskId})`}
          opacity="0.35"
        />
      </g>

      {/* Light crater texture */}
      <g className="text-gray-900/10">
        <circle cx="46" cy="56" r="2.2" fill="currentColor" opacity="0.55" />
        <circle cx="56" cy="58" r="1.6" fill="currentColor" opacity="0.45" />
        <circle cx="50" cy="48" r="1.4" fill="currentColor" opacity="0.35" />
        <circle cx="42" cy="48" r="1.1" fill="currentColor" opacity="0.3" />
      </g>
    </svg>
  )
}
