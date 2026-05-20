import type { ApiCommentReport } from "@/types/api/ApiCommentReport";
import type { ApiReport } from "@/types/api/ApiReport";
import type { Report } from "@/types/ui/Report";

/**
 * Convertit une date en format relatif (ex: "il y a 2 heures", "hier", "3 jours")
 */
function getRelativeTimeLabel(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSeconds < 60) {
    return "à l'instant";
  } else if (diffMinutes < 60) {
    return `il y a ${diffMinutes} min`;
  } else if (diffHours < 24) {
    return `il y a ${diffHours}h`;
  } else if (diffDays === 1) {
    return "hier";
  } else if (diffDays < 7) {
    return `il y a ${diffDays} jours`;
  } else {
    const options: Intl.DateTimeFormatOptions = { 
      day: 'numeric', 
      month: 'short', 
      year: diffDays > 365 ? 'numeric' : undefined 
    };
    return date.toLocaleDateString('fr-FR', options);
  }
}

export function mapApiReport(apiReport: ApiReport): Report {
  return {
    id: apiReport.id,
    userId: apiReport.user.id,
    userName: apiReport.user.name,
    userPhotoUrl: apiReport.user.photo_url,
    toiletId: apiReport.toilet.id,
    toiletName: apiReport.toilet.name,
    toiletImage: null,
    type: apiReport.type,
    description: apiReport.description,
    createdAt: apiReport.createdAt,
    dateLabel: getRelativeTimeLabel(apiReport.createdAt),
    targetType: "toilet",
  };
}

export function mapApiCommentReport(apiReport: ApiCommentReport): Report {
  return {
    id: apiReport.id,
    userId: apiReport.user.id,
    userName: apiReport.user.name,
    userPhotoUrl: apiReport.user.photo_url,
    toiletId: apiReport.comment.toilet.id,
    toiletName: apiReport.comment.toilet.name,
    toiletImage: null,
    commentId: apiReport.comment.id,
    type: apiReport.type,
    description: apiReport.description,
    createdAt: apiReport.createdAt,
    dateLabel: getRelativeTimeLabel(apiReport.createdAt),
    targetType: "comment",
  };
}