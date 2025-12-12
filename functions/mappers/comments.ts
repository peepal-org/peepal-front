import { timeAgoFr } from "@/functions/formatters/timeAgo";
import type { ApiComment } from "@/types/api/ApiComment";
import type { Comment } from "@/types/ui/Comment";

export function mapApiComment(api: ApiComment): Comment {
  return {
    id: String(api.id),
    toiletId: String(api.toilet.id),
    rating: api.rating,
    content: api.content,
    createdAt: api.createdAt,
    dateLabel: timeAgoFr(api.createdAt),
    user: {
      id: String(api.user.id),
      name: api.user.name,
      photoUrl: api.user.photo_url ?? null,
    },
  };
}
