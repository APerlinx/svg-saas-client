type CoffeeProps = {
  size?: string
  className?: string
}

const PricingIcon = ({ size = '20', className = 'shrink-0' }: CoffeeProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    className={className}
    aria-hidden="true"
    fill="none"
  >
    <defs>
      <linearGradient
        id="supportCoffeeGradient"
        x1="0%"
        y1="0%"
        x2="100%"
        y2="100%"
      >
        <stop offset="0%" stopColor="#c55a30" />
        <stop offset="55%" stopColor="#d57835" />
        <stop offset="100%" stopColor="#5887b4" />
      </linearGradient>
    </defs>

    <g
      stroke="url(#supportCoffeeGradient)"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7 10h8.5a1 1 0 0 1 1 1v2a4.5 4.5 0 0 1-4.5 4.5h-1A4.5 4.5 0 0 1 6.5 13v-2a1 1 0 0 1 1-1Z" />
      <path d="M16.5 11h1.2a2.4 2.4 0 0 1 0 4.8h-1.2" />
      <path d="M9 6.3c0 .9-.8 1.3-.8 2.2" />
      <path d="M12 5.8c0 1-.9 1.4-.9 2.4" />
      <path d="M15 6.3c0 .9-.8 1.3-.8 2.2" />
      <path d="M6 20h13" />
    </g>
  </svg>
)

export default PricingIcon
