import { ApiError } from "@/types/errors/ApiError";

export function getErrorMessage(
  err: unknown,
  fallback = "Une erreur est survenue.",
): string {
  if (err instanceof ApiError && err.isNetworkError) {
    return "Pas de connexion. Vérifie ton réseau.";
  }

  if (err instanceof Error) {
    return err.message;
  }

  return fallback;
}
