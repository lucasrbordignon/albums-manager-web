const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3333'

type createAlbumPayload = { title: string; description: string; userId: string }

export async function createAlbum(payload: createAlbumPayload) {
  const res = await fetch(`${API_URL}/albums`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error('Erro ao criar álbum')
  return res.json()
}

export async function deleteAlbum(albumID: string) {
  const res = await fetch(`${API_URL}/albums/${albumID}`, {
    method: 'DELETE',
  })
  if (!res.ok) throw new Error('Erro ao deletar álbum')
  return res.json()
}

export async function updateAlbum(
  albumID: string,
  payload: { title?: string; description?: string }
) {
  const res = await fetch(`${API_URL}/albums/${albumID}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error('Erro ao atualizar álbum')
  return res.json()
}
