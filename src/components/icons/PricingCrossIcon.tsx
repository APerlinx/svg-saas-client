type Props = {
  className?: string
}

export default function PricingCrossIcon({
  className = 'w-5 h-5 text-gray-300 shrink-0 mt-0.5',
}: Props) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  )
}
