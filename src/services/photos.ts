import { api } from '@/config/api'

export async function deleteAlbum(albumID: string) {
  const { data } = await api.delete(`/albums/${albumID}`)
  return data
}

export async function updateAlbum(
  albumID: string,
  payload: { title?: string; description?: string }
) {
  const { data } = await api.put(`/albums/${albumID}`, payload)

  return data
}
