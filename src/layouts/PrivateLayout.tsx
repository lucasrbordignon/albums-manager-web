import { Outlet, Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import LogoutButton from '../components/LogoutButton'
import { ModeToggle } from '@/components/mode-toggle'
import { ImageUpIcon } from 'lucide-react'

export function PrivateLayout() {
  const { isAuthenticated, user } = useAuth()

  const firstName = user?.name.split(' ')[0] || 'Usuário'

  if (!isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="min-h-screen">
      <header className="flex justify-between p-4 border-b">
        <div className="flex items-center gap-4">
          <ImageUpIcon className="h-8 w-8 text-primary" />
          <h1 className="text-xl font-semibold text-shadow-2xs">Meus álbuns de fotos</h1>
        </div>
        <div className="flex items-center gap-4">
          <h3 className="hidden sm:block text-muted-foreground">Seja bem-vindo, {firstName}!</h3>
          <ModeToggle />
          <LogoutButton />
        </div>
      </header>
      <Outlet />
    </div>
  )
}
