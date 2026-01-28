type Props = { size?: string; className?: string }

export default function ClaudeIcon({
  size = '20',
  className = 'text-current',
}: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="-64 -64 128 128"
      className={className}
      role="img"
      aria-label="Starburst icon"
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="12"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M0 0 L0 -48" />
        <path d="M0 0 L0 -48" transform="rotate(30)" />
        <path d="M0 0 L0 -48" transform="rotate(60)" />
        <path d="M0 0 L0 -48" transform="rotate(90)" />
        <path d="M0 0 L0 -48" transform="rotate(120)" />
        <path d="M0 0 L0 -48" transform="rotate(150)" />
        <path d="M0 0 L0 -48" transform="rotate(180)" />
        <path d="M0 0 L0 -48" transform="rotate(210)" />
        <path d="M0 0 L0 -48" transform="rotate(240)" />
        <path d="M0 0 L0 -48" transform="rotate(270)" />
        <path d="M0 0 L0 -48" transform="rotate(300)" />
        <path d="M0 0 L0 -48" transform="rotate(330)" />

        <circle
          cx="0"
          cy="0"
          r="10"
          fill="currentColor"
          stroke="none"
          opacity="0.9"
        />
      </g>
    </svg>
  )
}
