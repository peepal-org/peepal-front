import type {
  ApiBadge,
  ApiQuest,
  ApiQuestWithProgress,
  ApiUserQuestProgress,
} from "@/types/api/ApiGamification";
import type { Badge } from "@/types/ui/Badge";
import type { Quest } from "@/types/ui/Quest";

export function mapApiBadge(api: ApiBadge, obtained: boolean): Badge {
  return {
    id: String(api.id),
    name: api.name,
    description: api.description ?? "",
    image: api.icon_url ?? undefined,
    rarity: api.rarity,
    minPoints: api.minPoints,
    obtained,
  };
}

export function mapApiQuest(
  api: ApiQuest,
  progress?: ApiUserQuestProgress | null,
): Quest {
  return {
    id: api.id,
    name: api.name,
    description: api.description ?? "",
    frequency: api.frequency,
    type: api.type,
    requiredCount: api.requiredCount,
    currentProgress: progress?.currentProgress ?? 0,
    rewardPoints: api.rewardPoints,
    isCompleted: progress?.isCompleted ?? false,
  };
}

export function mapApiQuestWithProgress(item: ApiQuestWithProgress): Quest {
  return mapApiQuest(item.quest, item.progress);
}
