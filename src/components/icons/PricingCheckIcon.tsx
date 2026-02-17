type Props = {
  className?: string
}

export default function PricingCheckIcon({
  className = 'w-5 h-5 text-green-600 shrink-0 mt-0.5',
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
        d="M5 13l4 4L19 7"
      />
    </svg>
  )
}
