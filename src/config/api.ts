import axios from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

let isRefreshing = false
let failedQueue: any[] = []

const processQueue = (error: any, token: string | null) => {
  failedQueue.forEach(prom => {
    if (error) prom.reject(error)
    else prom.resolve(token)
  })

  failedQueue = []
}

api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`
          return api(originalRequest)
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      const stored = localStorage.getItem('auth')
      if (!stored) return Promise.reject(error)

      const { refreshToken } = JSON.parse(stored)

      try {
        const { data } = await api.post('/auth/refresh-token', { refreshToken })

        const newAuth = {
          ...JSON.parse(stored),
          accessToken: data.accessToken,
        }

        localStorage.setItem('auth', JSON.stringify(newAuth))

        api.defaults.headers.common.Authorization = `Bearer ${data.accessToken}`

        processQueue(null, data.accessToken)
        return api(originalRequest)
      } catch (err) {
        processQueue(err, null)
        localStorage.removeItem('auth')
        window.location.href = '/'
        return Promise.reject(err)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)
