import { useState, type FormEvent, useRef, useEffect } from 'react'
import type { PromptFormData } from '../types/svg'
import InfoIcon from '../assets/info.svg'
import generate from '../assets/generate.svg'
import chatGptIcon from '../assets/chat-gpt.svg'
import googleIcon from '../assets/google.svg'
import { SVG_STYLES } from '../constants/svgStyles'
import { AI_MODELS } from '../constants/models'

// TODO: Frontend work list for today.
// TODO: fix ither menus and slectes to look good, no border..
// TODO: find generate icon
// TODO: fix the prompt area to be better looking based on the screen shot
// TODO: clean the code here, cut into pieces and structure the files correctly.
// TODO: maybe even before that connect to backend so we can test the full flow. and dont forget to update backend about model and privacy..
// TODO: Menus design , scroll bar, padding etc.
const ChevronDownIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m6 9 6 6 6-6" />
  </svg>
)

export default function PromptGenerator() {
  const [formData, setFormData] = useState<PromptFormData>({
    prompt: '',
    style: 'minimal',
    isPrivate: false,
    model: 'gpt-5-mini',
  })

  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault()
    console.log('Generating SVG with:', formData)
    // TODO: Connect to backend
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpenDropdown(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const selectedStyleLabel =
    SVG_STYLES.find((opt) => opt.value === formData.style)?.label || 'Style'
  const selectedModel = AI_MODELS.find((opt) => opt.value === formData.model)
  const selectedModelLabel = selectedModel?.label || 'Model'
  const selectedModelIcon = selectedModel?.icon

  const getIcon = (iconName?: string) => {
    if (iconName === 'chat-gpt') return chatGptIcon
    if (iconName === 'google') return googleIcon
    return null
  }

  const renderDropdown = (
    name: string,
    label: string,
    options: readonly {
      value: string
      label: string
      icon?: string
      section?: string
    }[],
    field: keyof PromptFormData
  ) => {
    const isModel = name === 'model'
    const modelIcon = isModel ? getIcon(selectedModelIcon) : null

    // Group models by section
    const partnerModels = options.filter((opt) => opt.section === 'partner')
    const comingSoonModels = options.filter(
      (opt) => opt.section === 'coming-soon'
    )

    return (
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpenDropdown(openDropdown === name ? null : name)}
          className={`flex items-center gap-2 px-3 py-1.5 text-sm text-white border-none ${
            name === 'style' ? 'bg-wizard-gray-medium/20 rounded-md' : ''
          }`}
        >
          {isModel && modelIcon && (
            <div className="w-5 h-5 bg-white rounded flex items-center justify-center shrink-0">
              <img src={modelIcon} alt="" className="w-3.5 h-3.5" />
            </div>
          )}
          {label}
          <ChevronDownIcon />
        </button>
        {openDropdown === name && (
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
                  const isSelected = formData.model === option.value
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        setFormData({ ...formData, [field]: option.value })
                        setOpenDropdown(null)
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-wizard-gray-medium/20 flex items-center gap-2"
                    >
                      {icon && (
                        <div className="w-6 h-6 bg-white rounded flex items-center justify-center shrink-0">
                          <img src={icon} alt="" className="w-4 h-4" />
                        </div>
                      )}
                      <span className="flex-1">{option.label}</span>
                      {isSelected && (
                        <svg
                          className="w-4 h-4 text-green-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
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
                  const isSelected = formData.model === option.value
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        setFormData({ ...formData, [field]: option.value })
                        setOpenDropdown(null)
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-wizard-gray-medium/20 flex items-center gap-2 last:rounded-b-lg"
                    >
                      {icon && (
                        <div className="w-6 h-6 bg-white rounded flex items-center justify-center shrink-0">
                          <img src={icon} alt="" className="w-4 h-4" />
                        </div>
                      )}
                      <span className="flex-1">{option.label}</span>
                      {isSelected && (
                        <svg
                          className="w-4 h-4 text-green-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
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
                  onClick={() => {
                    setFormData({ ...formData, [field]: option.value })
                    setOpenDropdown(null)
                  }}
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

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-[linear-gradient(180deg,rgb(0_0_0/4%)_0%,rgb(0_0_0/20%)_100%)] backdrop-blur-xl border-rgba(255, 255, 255, 0.08) rounded-3xl shadow-xl p-4">
        <form onSubmit={handleSubmit} className="p-1.5">
          <div className="relative bg-[rgb(17_17_17/55%)] rounded-3xl">
            <textarea
              id="prompt"
              value={formData.prompt}
              onChange={(e) =>
                setFormData({ ...formData, prompt: e.target.value })
              }
              placeholder="Choose a style and describe what you want to generate..."
              rows={5}
              required
              className="w-full bg-transparent text-white placeholder-white rounded-xl p-4 pr-6 pb-16 resize-none focus:outline-none "
            />

            <div
              className="absolute bottom-0 left-0 right-0 flex items-center justify-between p-3"
              ref={dropdownRef}
            >
              {/* Left Controls */}
              <div className="flex items-center gap-2 flex-wrap">
                {renderDropdown(
                  'style',
                  selectedStyleLabel,
                  SVG_STYLES,
                  'style'
                )}
                {renderDropdown(
                  'model',
                  selectedModelLabel,
                  AI_MODELS,
                  'model'
                )}

                {/* Privacy Switch */}
                <div className="flex items-center gap-2 pl-2">
                  <label
                    htmlFor="privacy"
                    className="text-sm font-medium text-white cursor-pointer"
                  >
                    Private
                  </label>
                  <div className="relative group flex items-center">
                    <img
                      src={InfoIcon}
                      alt="Info"
                      className="h-3.5 w-3.5 cursor-help"
                    />
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-2 bg-black/90 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-20">
                      When enabled, your generation will not be saved to the
                      public gallery or generation history
                      <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900"></div>
                    </div>
                  </div>
                  <label
                    htmlFor="privacy"
                    className="relative inline-block w-10 h-5"
                  >
                    <input
                      type="checkbox"
                      id="privacy"
                      checked={formData.isPrivate}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          isPrivate: e.target.checked,
                        })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-10 h-5 bg-black/50 rounded-full peer peer-checked:bg-wizard-orange transition-colors"></div>
                    <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
                  </label>
                </div>
              </div>

              {/* Right Controls */}
              <div className="flex items-center gap-4">
                {/* Generate Button */}
                <button
                  type="submit"
                  className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-black bg-white/90 rounded-3xl hover:bg-white transition-all disabled:none"
                  disabled={!formData.prompt}
                >
                  <img src={generate} alt="Generate" className="w-5 h-5" />
                  Generate
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
