import { useState, type FormEvent, useRef, useEffect } from 'react'
import type { PromptFormData } from '../types/svg'
import { Pencil } from './icons/PencilIcon'
import { SVG_STYLES } from '../constants/svgStyles'
import { AI_MODELS } from '../constants/models'
import Dropdown from './ui/Dropdown'
import PrivacySwitch from './ui/PrivacySwitch'
import SvgResultModal from './modal/SvgResultModal'

export default function PromptGenerator() {
  const [formData, setFormData] = useState<PromptFormData>({
    prompt: '',
    style: 'minimal',
    isPrivate: false,
    model: 'gpt-5-mini',
  })

  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [generatedSvg, setGeneratedSvg] = useState<string>('')

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault()
    console.log('Generating SVG with:', formData)

    // TODO: Connect to backend and get actual SVG
    // For now, using a sample SVG
    const sampleSvg = `<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="80" fill="#FF6B35" />
      <text x="100" y="110" font-size="24" text-anchor="middle" fill="white">Sample</text>
    </svg>`

    setGeneratedSvg(sampleSvg)
    setIsModalOpen(true)
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

  const handleDropdownChange = (field: keyof PromptFormData, value: string) => {
    setFormData({ ...formData, [field]: value })
    setOpenDropdown(null)
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
                <Dropdown
                  name="style"
                  label={selectedStyleLabel}
                  options={SVG_STYLES}
                  field="style"
                  isOpen={openDropdown === 'style'}
                  selectedValue={formData.style}
                  onToggle={() =>
                    setOpenDropdown(openDropdown === 'style' ? null : 'style')
                  }
                  onChange={handleDropdownChange}
                />
                <Dropdown
                  name="model"
                  label={selectedModelLabel}
                  options={AI_MODELS}
                  field="model"
                  isOpen={openDropdown === 'model'}
                  selectedValue={formData.model}
                  selectedIcon={selectedModelIcon}
                  onToggle={() =>
                    setOpenDropdown(openDropdown === 'model' ? null : 'model')
                  }
                  onChange={handleDropdownChange}
                />

                <PrivacySwitch
                  isPrivate={formData.isPrivate}
                  onChange={(checked) =>
                    setFormData({ ...formData, isPrivate: checked })
                  }
                />
              </div>

              {/* Right Controls */}
              <div className="flex items-center gap-4">
                <button
                  type="submit"
                  className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-black bg-white/90 rounded-3xl hover:bg-white transition-all disabled:none"
                  disabled={!formData.prompt}
                >
                  <Pencil size="20" className="text-black" />
                  Generate
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      <SvgResultModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        svgCode={generatedSvg}
        prompt={formData.prompt}
      />
    </div>
  )
}
