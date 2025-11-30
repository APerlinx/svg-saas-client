import InfoIcon from '../../assets/info.svg'

interface PrivacySwitchProps {
  isPrivate: boolean
  onChange: (checked: boolean) => void
}

export default function PrivacySwitch({
  isPrivate,
  onChange,
}: PrivacySwitchProps) {
  return (
    <div className="flex items-center gap-2 pl-2">
      <label
        htmlFor="privacy"
        className="text-sm font-medium text-white cursor-pointer"
      >
        Private
      </label>
      <div className="relative group flex items-center">
        <img src={InfoIcon} alt="Info" className="h-3.5 w-3.5 cursor-help" />
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-2 bg-black/90 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-20">
          When enabled, your generation will not be saved to the public gallery
          or generation history
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900"></div>
        </div>
      </div>
      <label htmlFor="privacy" className="relative inline-block w-10 h-5">
        <input
          type="checkbox"
          id="privacy"
          checked={isPrivate}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only peer"
        />
        <div className="w-10 h-5 bg-black/50 rounded-full peer peer-checked:bg-wizard-orange transition-colors"></div>
        <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
      </label>
    </div>
  )
}
