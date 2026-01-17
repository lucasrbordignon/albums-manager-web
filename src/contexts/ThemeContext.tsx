import { createContext, useContext, useEffect, useState } from 'react'
import { ThemeProvider as MuiThemeProvider, CssBaseline } from '@mui/material'
import { getMuiTheme } from '../styles/theme'

type ThemeMode = 'light' | 'dark'

type ThemeContextType = {
  mode: ThemeMode
  toggle: () => void
}

const ThemeContext = createContext<ThemeContextType | null>(null)

const STORAGE_KEY = 'theme-mode'

export function AppThemeProvider({ children }: { children: React.ReactNode }) {
  const getInitialTheme = (): ThemeMode => {
    const stored = localStorage.getItem(STORAGE_KEY) as ThemeMode | null
    if (stored) return stored

    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light'
  }

  const [mode, setMode] = useState<ThemeMode>(getInitialTheme)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', mode === 'dark')
    localStorage.setItem(STORAGE_KEY, mode)
  }, [mode])

  const toggle = () =>
    setMode(prev => (prev === 'dark' ? 'light' : 'dark'))

  return (
    <ThemeContext.Provider value={{ mode, toggle }}>
      <MuiThemeProvider theme={getMuiTheme(mode)}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used inside AppThemeProvider')
  }
  return context
}
