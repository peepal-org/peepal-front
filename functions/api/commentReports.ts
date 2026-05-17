import { apiFetch } from "@/functions/api";
import type { ApiCommentReport } from "@/types/api/ApiCommentReport";

export function fetchMyCommentReports() {
  return apiFetch<ApiCommentReport[]>("/comment-report/me");
}

export function fetchAdminCommentReports() {
  return apiFetch<ApiCommentReport[]>("/admin/comment-reports");
}
