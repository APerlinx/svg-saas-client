import { useId } from 'react'

type Props = {
  className?: string
}

export default function PillSnakeBorder({ className }: Props) {
  const id = useId()
  const seamMaskId = `pillSnakeSeamMask-${id}`

  return (
    <svg
      className={className}
      viewBox="0 0 100 40"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <mask id={seamMaskId} maskUnits="userSpaceOnUse">
          <rect x="0" y="0" width="100" height="40" fill="white" />
          <circle cx="98" cy="20" r="3.25" fill="black" />
        </mask>
      </defs>

      <path
        d="M98 20 A18 18 0 0 1 80 38 H20 A18 18 0 0 1 2 20 A18 18 0 0 1 20 2 H80 A18 18 0 0 1 98 20 Z"
        fill="none"
        strokeWidth="1.5"
        vectorEffect="non-scaling-stroke"
        pathLength="100"
        mask={`url(#${seamMaskId})`}
        className="pill-snake-border__snake"
      />
    </svg>
  )
}
