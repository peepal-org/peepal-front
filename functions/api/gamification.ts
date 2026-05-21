import { apiFetch } from "@/functions/api";
import type {
  ApiBadge,
  ApiGamificationStats,
  ApiQuest,
  ApiUserQuestProgress,
} from "@/types/api/ApiGamification";

export function fetchGamificationStats() {
  return apiFetch<ApiGamificationStats>("/gamification/stats");
}

export function fetchUserBadges() {
  return apiFetch<ApiBadge[]>("/gamification/badges");
}

export function fetchAvailableBadges() {
  return apiFetch<ApiBadge[]>("/gamification/badges/available");
}

export function fetchAvailableQuests() {
  return apiFetch<ApiQuest[]>("/gamification/quests");
}

export function updateQuestProgress(questId: number, progress: number) {
  return apiFetch<ApiUserQuestProgress>(
    `/gamification/quest/${questId}/progress`,
    {
      method: "POST",
      body: JSON.stringify({ progress }),
    },
  );
}
