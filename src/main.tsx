import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { AuthProvider } from './contexts/AuthContext'
import { HealthCheckProvider } from './contexts/HealthCheckContext'
import { ThemeProvider } from './components/theme-provider'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HealthCheckProvider>
      <AuthProvider>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <App />
        </ThemeProvider>
      </AuthProvider>
    </HealthCheckProvider>
  </React.StrictMode>
)
