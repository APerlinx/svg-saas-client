type LogoIconProps = {
  size?: string
  className?: string
}

export const Logo = ({ className, size }: LogoIconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size || '512'}
    height={size || '512'}
    viewBox="0 0 24 24"
    className={className}
  >
    <g
      fill="none"
      stroke="#101828"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    >
      <rect width="22" height="16" x="1" y="4" rx="3" />
      <circle cx="7" cy="10" r="1" />
      <circle cx="17" cy="10" r="1" />
      <path d="m5 20l3-4h8l3 4" />
    </g>
  </svg>
)
