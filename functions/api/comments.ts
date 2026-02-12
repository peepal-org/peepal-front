import { apiFetch } from "@/functions/api";
import type { ApiComment } from "@/types/api/ApiComment";

export function fetchComments() {
  return apiFetch<ApiComment[]>("/comments");
}

export function createComment(payload: {
  userId: number;
  toiletId: number;
  content: string;
  rating: number;
}) {
  return apiFetch<ApiComment>("/comments", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function deleteComment(commentId: number) {
  return apiFetch<void>(`/comments/${commentId}`, {
    method: "DELETE",
  });
}
