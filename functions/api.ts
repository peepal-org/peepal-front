import { triggerForceLogout } from "@/auth/authEvents";
import { getToken, logout } from "@/auth/authService";
import { API_URL } from "@/config/env";
import { ApiError } from "@/types/errors/ApiError";

async function getHeaders() {
  const token = await getToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const headers = await getHeaders();
  const url = `${API_URL}/${path.replace(/^\//, "")}`;

  let res: Response;

  try {
    res = await fetch(url, {
      ...options,
      headers: { ...headers, ...(options.headers ?? {}) },
    });
  } catch {
    throw new ApiError("Pas de connexion. Vérifie ton réseau.", 0, true);
  }

  if (!res.ok) {
    const serverMessage = await parseErrorBody(res);

    if (res.status === 401) {
      await logout();
      triggerForceLogout();
      throw new ApiError("Session expirée. Reconnecte-toi.", 401);
    }

    throw new ApiError(serverMessage, res.status);
  }

  const raw = await res.text();
  return raw ? (JSON.parse(raw) as T) : (undefined as T);
}

async function parseErrorBody(res: Response): Promise<string> {
  try {
    const text = await res.text();
    const json = JSON.parse(text);
    const msg = Array.isArray(json.message)
      ? json.message.join(" | ")
      : json.message;
    return msg || `Erreur HTTP ${res.status}`;
  } catch {
    return `Erreur HTTP ${res.status}`;
  }
}
