import ChatGptIcon from '../icons/ChatGptIcon'
import GoogleIcon from '../icons/GoogleIcon'
import ChevronDownIcon from '../icons/ChevronDownIcon'
import CheckmarkIcon from '../icons/CheckmarkIcon'
import type { PromptFormData } from '../../types/svg'

interface DropdownProps {
  name: string
  label: string
  options: readonly {
    value: string
    label: string
    icon?: string
    section?: string
  }[]
  field: keyof PromptFormData
  isOpen: boolean
  selectedValue: string
  selectedIcon?: string
  onToggle: () => void
  onChange: (field: keyof PromptFormData, value: string) => void
}

const getIcon = (iconName?: string) => {
  if (iconName === 'chat-gpt') return 'chat-gpt'
  if (iconName === 'google') return 'google'
  return null
}

export default function Dropdown({
  name,
  label,
  options,
  field,
  isOpen,
  selectedValue,
  selectedIcon,
  onToggle,
  onChange,
}: DropdownProps) {
  const isModel = name === 'model'
  const modelIcon = isModel ? getIcon(selectedIcon) : null

  const partnerModels = options.filter((opt) => opt.section === 'partner')
  const comingSoonModels = options.filter(
    (opt) => opt.section === 'coming-soon'
  )

  return (
    <div className="relative">
      <button
        type="button"
        onClick={onToggle}
        className={`flex items-center gap-2 px-3 py-1.5 text-sm text-white border-none ${
          name === 'style' ? 'bg-wizard-gray-medium/20 rounded-md' : ''
        }`}
      >
        {isModel && modelIcon && (
          <div className="w-5 h-5 bg-white rounded flex items-center justify-center shrink-0">
            {modelIcon === 'chat-gpt' ? (
              <ChatGptIcon className="w-3.5 h-3.5 text-black" />
            ) : (
              <GoogleIcon className="w-3.5 h-3.5" />
            )}
          </div>
        )}
        <span className={isModel ? 'hidden sm:inline' : ''}>{label}</span>
        <ChevronDownIcon />
      </button>
      {isOpen && (
        <div className="absolute bottom-full bg-black left-0 mb-2 pb-2 w-64 rounded-lg z-10 overflow-y-auto animate-in fade-in slide-in-from-bottom-2 duration-300 ease-out">
          {isModel ? (
            <>
              {/* Partner Models Section */}
              <div className="px-4 pt-3 pb-2">
                <div className="text-white font-semibold text-sm">
                  Partner models
                </div>
                <div className="text-gray-400 text-xs mt-0.5">
                  Active models
                </div>
              </div>
              {partnerModels.map((option) => {
                const icon = getIcon(option.icon)
                const isSelected = selectedValue === option.value
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => onChange(field, option.value)}
                    className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-wizard-gray-medium/20 flex items-center gap-2"
                  >
                    {icon && (
                      <div className="w-6 h-6 bg-white rounded flex items-center justify-center shrink-0">
                        {icon === 'chat-gpt' ? (
                          <ChatGptIcon className="w-4 h-4 text-black" />
                        ) : (
                          <GoogleIcon className="w-4 h-4" />
                        )}
                      </div>
                    )}
                    <span className="flex-1">{option.label}</span>
                    {isSelected && (
                      <CheckmarkIcon className="w-4 h-4 text-green-500" />
                    )}
                  </button>
                )
              })}

              {/* Divider */}
              <div className="mx-4 my-2 border-t border-gray-700"></div>

              {/* Coming Soon Section */}
              <div className="px-4 pt-2 pb-2">
                <div className="text-white font-semibold text-sm">
                  Coming soon
                </div>
                <div className="text-gray-400 text-xs mt-0.5">
                  Models we are working to incorporate
                </div>
              </div>
              {comingSoonModels.map((option) => {
                const icon = getIcon(option.icon)
                const isSelected = selectedValue === option.value
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => onChange(field, option.value)}
                    className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-wizard-gray-medium/20 flex items-center gap-2 last:rounded-b-lg"
                  >
                    {icon && (
                      <div className="w-6 h-6 bg-white rounded flex items-center justify-center shrink-0">
                        {icon === 'chat-gpt' ? (
                          <ChatGptIcon className="w-4 h-4" />
                        ) : (
                          <GoogleIcon className="w-4 h-4" />
                        )}
                      </div>
                    )}
                    <span className="flex-1">{option.label}</span>
                    {isSelected && (
                      <CheckmarkIcon className="w-4 h-4 text-green-500" />
                    )}
                  </button>
                )
              })}
            </>
          ) : (
            options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => onChange(field, option.value)}
                className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-wizard-gray-medium/20 first:rounded-t-lg last:rounded-b-lg"
              >
                {option.label}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  )
}
