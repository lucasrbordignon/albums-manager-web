const API_URL = import.meta.env.VITE_API_URL

export async function healthcheck() {
  const res = await fetch(`${API_URL}/health`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  })
  if (!res.ok) throw new Error('API offline')
  return res.json()
}
