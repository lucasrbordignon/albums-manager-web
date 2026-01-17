import { api } from '@/config/api'
import { isAuthenticated, refreshToken } from '@/services/auth'
import { createContext, useContext, useEffect, useState } from 'react'

type User = {
  id: string
  name: string
  email: string
}

type AuthTokens = {
  accessToken: string
  refreshToken: string
}

type AuthContextType = {
  user: User | null
  tokens: AuthTokens | null
  isAuthenticated: boolean
  login: (payload: { user: User; accessToken: string; refreshToken: string }) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [tokens, setTokens] = useState<AuthTokens | null>(null)

  useEffect(() => {
    const restoreSession = async () => {
      const stored = localStorage.getItem('auth')
      if (!stored) return

      const parsed = JSON.parse(stored)

      api.defaults.headers.common.Authorization = `Bearer ${parsed.accessToken}`

      try {
        await isAuthenticated()

        setUser(parsed.user)
        setTokens({
          accessToken: parsed.accessToken,
          refreshToken: parsed.refreshToken,
        })
      } catch {
        try {
          const response = await refreshToken(parsed.refreshToken)

          const { accessToken } = response.data

          api.defaults.headers.common.Authorization = `Bearer ${accessToken}`

          setUser(parsed.user)
          setTokens({
            accessToken,
            refreshToken: parsed.refreshToken,
          })

          localStorage.setItem(
            'auth',
            JSON.stringify({
              ...parsed,
              accessToken,
            })
          )
        } catch {
          logout()
        }
      }
    }

    restoreSession()
  }, [])

  const login = (payload: { user: User; accessToken: string; refreshToken: string }) => {
    setUser(payload.user)
    setTokens({ accessToken: payload.accessToken, refreshToken: payload.refreshToken })
    localStorage.setItem('auth', JSON.stringify(payload))

    api.defaults.headers.common.Authorization = `Bearer ${payload.accessToken}`
  }

  const logout = () => {
    setUser(null)
    setTokens(null)
    localStorage.removeItem('auth')

    delete api.defaults.headers.common.Authorization
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        tokens,
        isAuthenticated: !!user && !!tokens?.accessToken,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }
  return context
}
