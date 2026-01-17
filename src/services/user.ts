const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3333'

export async function findAlbumsByUser(userID: string) {
  const res = await fetch(`${API_URL}/users/${userID}/albums`, {
    method: 'GET',
  })
  if (!res.ok) throw new Error('Erro ao buscar álbuns do usuário')
  return res.json()
}
