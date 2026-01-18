import { api } from '@/config/api'

export async function uploadPhoto(formData: FormData, token?: string) {
  const { data } = await api.post('/photos/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  })
  return data
}

export async function deletePhoto(photoID: string) {
  const { data } = await api.delete(`/photos/${photoID}`)
  return data
}
