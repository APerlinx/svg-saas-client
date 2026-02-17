import type {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from 'axios'
import { refreshAccessToken } from './authService'

type RetryableConfig = InternalAxiosRequestConfig & {
  _retry?: boolean
}

let refreshPromise: Promise<boolean> | null = null

function isAuthEndpoint(url: string): boolean {
  return (
    url.includes('/auth/login') ||
    url.includes('/auth/register') ||
    url.includes('/auth/logout') ||
    url.includes('/auth/refresh') ||
    url.includes('/auth/forgot-password') ||
    url.includes('/auth/reset-password')
  )
}

export function attachAuthRefreshInterceptor(api: AxiosInstance) {
  api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const status = error.response?.status
      const originalRequest = error.config as RetryableConfig | undefined

      if (!originalRequest || status !== 401) {
        return Promise.reject(error)
      }

      const requestUrl = originalRequest.url ?? ''
      if (originalRequest._retry || isAuthEndpoint(requestUrl)) {
        return Promise.reject(error)
      }

      originalRequest._retry = true

      if (!refreshPromise) {
        refreshPromise = refreshAccessToken().finally(() => {
          refreshPromise = null
        })
      }

      const refreshed = await refreshPromise
      if (!refreshed) {
        return Promise.reject(error)
      }

      return api(originalRequest)
    },
  )
}
