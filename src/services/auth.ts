const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3333";

type LoginPayload = { email: string; password: string };
type RegisterPayload = { name: string; email: string; password: string };

export async function login(payload: LoginPayload) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Login inválido");
  return res.json();
}

export async function register(payload: RegisterPayload) {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Erro ao registrar");
  return res.json();
}

export async function isAuthenticated(token: string) {
  const res = await fetch(`${API_URL}/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Não autenticado");
  return res.json();
}
