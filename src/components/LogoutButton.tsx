import { useNavigate } from 'react-router-dom'
import { LogOut } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useAuth } from '../contexts/AuthContext'

export default function LogoutButton() {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <Button type="button" variant="default" onClick={handleLogout} className="gap-2">
      <LogOut className="h-4 w-4" />
      Sair
    </Button>
  )
}
