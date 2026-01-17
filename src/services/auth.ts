import { api } from '@/config/api'

export async function login(payload: { email: string; password: string }) {
  const { data } = await api.post('/auth/login', payload)
  return data
}

export async function register(payload: { name: string; email: string; password: string }) {
  const { data } = await api.post('/auth/register', payload)
  return data
}

export async function refreshToken(refreshToken: string) {
  const { data } = await api.post('/auth/refresh-token', { refreshToken })
  return data
}

export async function isAuthenticated() {
  const { data } = await api.get('/auth/me')
  return data
}
