import { createTheme } from '@mui/material/styles'

export const getMuiTheme = (mode: 'light' | 'dark') =>
  createTheme({
    palette: {
      mode,
      primary: {
        main: '#2563eb',
      },
    },
    shape: {
      borderRadius: 8,
    },
  })