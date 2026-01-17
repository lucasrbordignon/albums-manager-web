import { IconButton } from '@mui/material'
import { DarkMode, LightMode } from '@mui/icons-material'
import { useTheme } from '../contexts/ThemeContext'

export function ThemeToggle() {
  const { mode, toggle } = useTheme()

  return (
    <IconButton onClick={toggle} color="inherit">
      {mode === 'dark' ? <LightMode /> : <DarkMode />}
    </IconButton>
  )
}