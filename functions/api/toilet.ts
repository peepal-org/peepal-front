import { apiFetch } from "@/functions/api";
import type { ApiToilet } from "@/types/api/ApiToilet";
import { Statut } from "../../types/Statut";

export function fetchToilets() {
  return apiFetch<ApiToilet[]>("/toilets");
}

export function fetchToiletById(id: number) {
  return apiFetch<ApiToilet>(`/toilets/${id}`);
}

export function updateToilet(id: number, data: Partial<Pick<ApiToilet, "status">>) {
  return apiFetch<ApiToilet>(`/toilets/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}
