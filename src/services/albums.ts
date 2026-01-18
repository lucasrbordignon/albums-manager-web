import { api } from '@/config/api'

type createAlbumPayload = { title: string; description: string; userId: string }

export async function createAlbum(payload: createAlbumPayload) {
  const { data } = await api.post('/albums', payload)

  if (!data) {
    throw new Error('Erro ao criar álbum')
  }

  return data
}

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

export async function getPhotosByAlbum(albumID: string) {
  const { data } = await api.get(`/albums/${albumID}/photos`)
  return data
}
