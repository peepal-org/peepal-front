import { apiFetch } from "@/functions/api";
import type { ApiReport } from "@/types/api/ApiReport";

export function fetchReports() {
  return apiFetch<ApiReport[]>("/reports");
}

export function fetchReport(id: number) {
  return apiFetch<ApiReport>(`/reports/${id}`);
}

export function createReport(payload: {
  userId: number;
  toiletId: number;
  type: "closed" | "dirty" | "maintenance" | "other";
  description: string;
}) {
  return apiFetch<ApiReport>("/reports", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateReport(
  id: number,
  payload: {
    userId?: number;
    toiletId?: number;
    type?: "closed" | "dirty" | "maintenance" | "other";
    description?: string;
  }
) {
  return apiFetch<ApiReport>(`/reports/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export function deleteReport(id: number) {
  return apiFetch<void>(`/reports/${id}`, {
    method: "DELETE",
  });
}