import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { PublicLayout } from '../layouts/PublicLayout'
import { PrivateLayout } from '../layouts/PrivateLayout'

import AlbumsList from '../pages/private/Albums/AlbumsList'
import Profile from '../pages/private/Photos'
import LoginPage from '@/pages/public/auth/LoginPage'
import RegisterPage from '@/pages/public/auth/RegisterPage'

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        <Route element={<PrivateLayout />}>
          <Route path="/private/albums" element={<AlbumsList />} />
          <Route path="/private/photos" element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
