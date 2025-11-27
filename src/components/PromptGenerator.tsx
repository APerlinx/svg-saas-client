import { useState, type FormEvent } from 'react'
import type { SvgStyle, PromptFormData } from '../types/svg'

const styleOptions: { value: SvgStyle; label: string }[] = [
  { value: 'minimal', label: 'Minimal' },
  { value: 'modern', label: 'Modern' },
  { value: 'flat', label: 'Flat Design' },
  { value: 'gradient', label: 'Gradient' },
  { value: 'line-art', label: 'Line Art' },
  { value: '3d', label: '3D Style' },
]

export default function PromptGenerator() {
  const [formData, setFormData] = useState<PromptFormData>({
    prompt: '',
    style: 'minimal',
    isPrivate: false,
  })

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault()

    // TODO: Connect to backend
    console.log('Generating SVG with:', formData)

    // Backend integration will go here
    // const response = await axios.post('/api/generate', formData)
  }

  return (
    <div className="w-full max-w-2xl mx-auto ">
      <div className="">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Prompt Input */}
          <div>
            <label
              htmlFor="prompt"
              className="block text-md font-medium text-gray-700 mb-2"
            >
              Describe Your SVG
            </label>
            <textarea
              id="prompt"
              value={formData.prompt}
              onChange={(e) =>
                setFormData({ ...formData, prompt: e.target.value })
              }
              placeholder="Enter your prompt here... (e.g., 'A minimalist mountain landscape at sunset')"
              rows={6}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-shadow"
            />
          </div>

          {/* Style Selector */}
          <div>
            <label
              htmlFor="style"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Choose Style
            </label>
            <select
              id="style"
              value={formData.style}
              onChange={(e) =>
                setFormData({ ...formData, style: e.target.value as SvgStyle })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
            >
              {styleOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Privacy Switch */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <label
                htmlFor="privacy"
                className="text-sm font-medium text-gray-700"
              >
                Privacy Mode
              </label>
              <div className="relative group">
                <svg
                  className="w-4 h-4 text-gray-400 cursor-help"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-10">
                  If turned on, we will not add your generation to the public
                  collection
                  <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900"></div>
                </div>
              </div>
            </div>
            <label htmlFor="privacy" className="relative inline-block w-12 h-6">
              <input
                type="checkbox"
                id="privacy"
                checked={formData.isPrivate}
                onChange={(e) =>
                  setFormData({ ...formData, isPrivate: e.target.checked })
                }
                className="sr-only peer"
              />
              <div className="w-12 h-6 bg-gray-300 rounded-full peer peer-checked:bg-wizard-orange transition-colors"></div>
              <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-6"></div>
            </label>
          </div>

          {/* Generate Button */}
          <div className="flex justify-end">
            <button type="submit" className="">
              Generate SVG
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
