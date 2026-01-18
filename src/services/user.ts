import { api } from '@/config/api'

export async function findAlbumsByUser(userID: string) {
  const { data } = await api.get(`/users/${userID}/albums`)
  return data
}
