import axios from 'axios'
import type {
  AdminMetricsResponse,
  AdminRequestAccessResponse,
  AdminLogoutResponse,
} from '../types/admin'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const adminApi = axios.create({
  baseURL: `${API_BASE_URL}/api/admin`,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

export async function requestAdminAccess(
  email: string,
): Promise<AdminRequestAccessResponse> {
  const response = await adminApi.post<AdminRequestAccessResponse>(
    '/request-access',
    { email },
  )
  return response.data
}

export async function fetchAdminMetrics(): Promise<AdminMetricsResponse> {
  const response = await adminApi.get<AdminMetricsResponse>('/metrics')
  return response.data
}

export async function logoutAdmin(): Promise<AdminLogoutResponse> {
  const response = await adminApi.post<AdminLogoutResponse>('/logout')
  return response.data
}
