import { useState } from 'react'
import InfoIcon from '../icons/InfoIcon'

interface PrivacySwitchProps {
  isPrivate: boolean
  onChange: (checked: boolean) => void
}

export default function PrivacySwitch({
  isPrivate,
  onChange,
}: PrivacySwitchProps) {
  const [showTooltip, setShowTooltip] = useState(false)

  const stateLabel = isPrivate ? 'Private' : 'Public'
  const nextLabel = isPrivate ? 'Public' : 'Private'

  return (
    <div className="flex items-center gap-1.5 shrink-0">
      <button
        type="button"
        onClick={() => onChange(!isPrivate)}
        aria-pressed={isPrivate}
        aria-label={`Visibility: ${stateLabel}. Click to switch to ${nextLabel}.`}
        className="flex items-center gap-2 px-3 py-1.5 text-sm text-white border-none bg-wizard-gray-medium/20 rounded-md hover:bg-wizard-gray-medium/30 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wizard-orange/40 whitespace-nowrap"
      >
        <span className="text-white/70">{stateLabel === 'Public' ? 'Public' : 'Private'}</span>
      </button>

      <div className="relative flex items-center">
        <button
          type="button"
          onClick={() => setShowTooltip((prev) => !prev)}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wizard-orange/40 rounded-md"
          aria-label="Visibility information"
        >
          <InfoIcon className="h-3.5 w-3.5 cursor-help text-white/70" />
        </button>

        {showTooltip && (
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-2 bg-black/90 text-white text-xs rounded-lg z-20 animate-fadeIn">
            Public saves to the community gallery. Private keeps it out of the
            public gallery.
            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900"></div>
          </div>
        )}
      </div>
    </div>
  )
}
