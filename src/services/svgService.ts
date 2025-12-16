import axios, { AxiosError } from 'axios'
import { attachCsrfInterceptor } from '../services/csrfInterceptor'
import { logger } from './logger'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  withCredentials: true,
})
attachCsrfInterceptor(api)

interface ApiError {
  message?: string
  error?: string
}

interface GenerateSvgResponse {
  svgCode: string
}

function normalizeError(error: unknown): never {
  if (axios.isAxiosError(error)) {
    const err = error as AxiosError<ApiError>
    const msg =
      err.response?.data?.error ||
      err.response?.data?.message ||
      err.response?.statusText ||
      'Unexpected server error'
    throw new Error(msg)
  }
  throw error as Error
}

export async function generateSvg({
  prompt,
  style,
  privacy,
  model,
}: {
  prompt: string
  style: string
  privacy: boolean
  model: string
}): Promise<GenerateSvgResponse> {
  try {
    logger.debug('Generating SVG', { prompt, style, privacy, model })
    const response = await api.post<GenerateSvgResponse>('/svg/generate-svg', {
      prompt,
      style,
      privacy,
      model,
    })
    return response.data
  } catch (error) {
    logger.error('Error generating SVG', error, { prompt, style, model })
    normalizeError(error)
  }
}
