import { useEffect, useMemo, useRef, useState } from 'react'

type SvgCodeTypingPreviewProps = {
  percent: number
  label: string
  subtext: string
}

function getTemplateSvgCode() {
  const base = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- AI drafting SVG structure -->
    <linearGradient id="paint0" x1="64" y1="64" x2="448" y2="448" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0.10" />
      <stop offset="1" stop-color="#ffffff" stop-opacity="0.00" />
    </linearGradient>

    <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%" color-interpolation-filters="sRGB">
      <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
      <feColorMatrix in="blur" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.10 0" result="glow" />
      <feMerge>
        <feMergeNode in="glow" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>

  <rect x="56" y="56" width="400" height="400" rx="96" fill="url(#paint0)" />

  <path d="M160 312c44-92 148-92 192 0" stroke="#ffffff" stroke-opacity="0.75" stroke-width="18" stroke-linecap="round" />
  <path d="M188 312c31-62 105-62 136 0" stroke="#ffffff" stroke-opacity="0.75" stroke-width="18" stroke-linecap="round" />
  <path d="M220 312c18-36 54-36 72 0" stroke="#ffffff" stroke-opacity="0.75" stroke-width="18" stroke-linecap="round" />

  <circle cx="256" cy="344" r="14" fill="#ffffff" fill-opacity="0.85" />

  <!-- refining details -->
  <path d="M112 176c36-48 92-76 144-76s108 28 144 76" stroke="#ffffff" stroke-opacity="0.18" stroke-width="14" stroke-linecap="round" filter="url(#softGlow)" />
  <path d="M144 188c30-36 70-56 112-56s82 20 112 56" stroke="#ffffff" stroke-opacity="0.12" stroke-width="14" stroke-linecap="round" />
`

  const filler: string[] = []
  for (let i = 0; i < 160; i += 1) {
    const x = 96 + ((i * 13) % 320)
    const y = 120 + ((i * 19) % 280)
    const w = 32 + ((i * 7) % 120)
    const h = 10 + ((i * 11) % 60)
    const o = (10 + (i % 18)) / 100
    filler.push(
      `  <!-- tuning layer ${i + 1} -->\n  <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${Math.min(14, Math.floor(h / 2))}" fill="#ffffff" fill-opacity="${o.toFixed(2)}" />\n`,
    )
  }

  return `${base}${filler.join('')}
</svg>
`
}

export default function SvgCodeTypingPreview({
  percent,
  label,
  subtext,
}: SvgCodeTypingPreviewProps) {
  const normalizedPercent = Math.min(Math.max(percent, 0), 100)
  const template = useMemo(() => getTemplateSvgCode(), [])

  const prefersReducedMotion = useMemo(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  }, [])

  const [animatedPercent, setAnimatedPercent] = useState(
    () => normalizedPercent,
  )
  const displayedPercent = prefersReducedMotion
    ? normalizedPercent
    : animatedPercent

  const lastBackendMsRef = useRef<number>(0)
  const lastBackendPercentRef = useRef<number>(normalizedPercent)

  useEffect(() => {
    if (!lastBackendMsRef.current) {
      lastBackendPercentRef.current = normalizedPercent
      lastBackendMsRef.current = Date.now()
      return
    }

    if (
      Math.round(lastBackendPercentRef.current) !==
      Math.round(normalizedPercent)
    ) {
      lastBackendPercentRef.current = normalizedPercent
      lastBackendMsRef.current = Date.now()
    }
  }, [normalizedPercent])

  useEffect(() => {
    if (prefersReducedMotion) return

    const id = window.setInterval(() => {
      setAnimatedPercent((current) => {
        const backend = normalizedPercent
        const now = Date.now()
        const msSinceBackend = now - lastBackendMsRef.current

        // If backend finishes, ease to 100 (avoid snapping from e.g. 25 -> 100).
        if (backend >= 100 && current < 100) {
          const remaining = 100 - current
          const step = Math.min(1.1, Math.max(0.25, remaining * 0.1))
          return Math.min(100, current + step)
        }

        // Move toward backend quickly when it advances.
        if (backend > current) {
          const gap = backend - current
          const step = Math.min(gap, Math.max(0.18, gap * 0.08))
          return Math.min(backend, current + step)
        }

        // If backend is stalled (e.g. stuck at 25%), keep creeping up.
        // Cap below completion so we never "finish" before the SVG arrives.
        if (backend < 100 && msSinceBackend > 1200 && current < 95) {
          const remaining = 95 - current
          // Tuned so 25% -> ~95% takes ~30–45s (depending on throttling).
          const step = Math.min(0.12, Math.max(0.02, remaining * 0.006))
          return Math.min(95, current + step)
        }

        return current
      })
    }, 120)

    return () => window.clearInterval(id)
  }, [normalizedPercent, prefersReducedMotion])

  const [typedCount, setTypedCount] = useState(0)

  const progressTargetCount = useMemo(() => {
    const min = 64
    const max = template.length
    // Keep the typing believable for ~30–40s jobs by capping the amount of code
    // we try to "complete" in the animation.
    const effectiveMax = Math.min(max, 2800)
    const scaled = Math.floor((displayedPercent / 100) * effectiveMax)
    return Math.min(effectiveMax, Math.max(min, scaled))
  }, [displayedPercent, template.length])

  useEffect(() => {
    if (prefersReducedMotion) return

    // "Human" typing cadence. This intentionally lags behind percent updates so
    // the code keeps animating during long backend stalls.
    const charsPerSecond = 55
    let lastTickMs = Date.now()
    let carry = 0

    const id = window.setInterval(() => {
      setTypedCount((current) => {
        const desiredTarget = progressTargetCount

        if (current >= desiredTarget) return current

        const now = Date.now()
        const dt = Math.max(0, now - lastTickMs)
        lastTickMs = now

        carry += (dt / 1000) * charsPerSecond
        const step = Math.max(1, Math.min(6, Math.floor(carry)))
        carry = Math.max(0, carry - step)

        const remaining = desiredTarget - current
        const clampedStep = Math.min(
          step,
          Math.max(1, Math.ceil(remaining / 6)),
        )
        return Math.min(desiredTarget, current + clampedStep)
      })
    }, 50)

    return () => window.clearInterval(id)
  }, [prefersReducedMotion, progressTargetCount])

  const displayedCount = prefersReducedMotion ? progressTargetCount : typedCount
  const typedCode = template.slice(0, displayedCount)

  return (
    <div className="w-full max-w-2xl mx-auto text-left">
      <div className="mb-3">
        <p className="text-white font-semibold text-base sm:text-lg">
          {label}
          <span className="text-white/60 font-medium">
            {' '}
            — {Math.round(displayedPercent)}%
          </span>
        </p>
        <p className="text-white/70 text-sm mt-1">{subtext}</p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-3 sm:p-4 overflow-hidden">
        <pre className="text-[11px] sm:text-xs text-white/80 font-mono whitespace-pre-wrap break-all max-h-56 sm:max-h-64">
          <code>{typedCode}</code>
          <span className="inline-block w-2.5 text-white/70 animate-pulse">
            ▍
          </span>
        </pre>
      </div>
    </div>
  )
}
