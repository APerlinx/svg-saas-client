import axios from 'axios'
import { setCsrfToken } from '../utils/csrf'

export async function bootstrapCsrf(): Promise<void> {
  const client = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
    withCredentials: true,
  })

  const res = await client.get('/csrf')
  const token = res.data?.csrfToken

  if (!token) throw new Error('No csrfToken returned from /csrf')
  setCsrfToken(token)
}
