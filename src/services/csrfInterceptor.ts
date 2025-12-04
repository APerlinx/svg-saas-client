import { getCsrfToken } from '../utils/csrf'
import type { InternalAxiosRequestConfig, AxiosInstance } from 'axios'

export function attachCsrfInterceptor(api: AxiosInstance) {
  api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = getCsrfToken()

    const method = (config.method || 'get').toUpperCase()
    const needsCsrf = ['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)

    if (needsCsrf && token) {
      config.headers.set('X-CSRF-Token', token)
    }

    return config
  })
}
