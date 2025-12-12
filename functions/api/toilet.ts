import { apiFetch } from "@/functions/api";
import type { ApiToilet } from "@/types/api/ApiToilet";

export function fetchToilets() {
  return apiFetch<ApiToilet[]>("/toilets");
}

export function fetchToiletById(id: number) {
  return apiFetch<ApiToilet>(`/toilets/${id}`);
}
