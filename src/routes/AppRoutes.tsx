import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { PublicLayout } from '../layouts/PublicLayout'
import { PrivateLayout } from '../layouts/PrivateLayout'

import AuthPage from '../pages/public/auth/AuthPage'  
import Dashboard from '../pages/private/Albums'
import Profile from '../pages/private/Photos'

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/auth" element={<AuthPage />} />
        </Route>

        <Route element={<PrivateLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
