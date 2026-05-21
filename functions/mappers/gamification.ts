import type {
  ApiBadge,
  ApiQuest,
  ApiQuestWithProgress,
  ApiThemeWithUnlock,
  ApiUserQuestProgress,
} from "@/types/api/ApiGamification";
import type { Badge } from "@/types/ui/Badge";
import type { Quest } from "@/types/ui/Quest";
import type { Theme } from "@/types/ui/Theme";

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

export function mapApiTheme(api: ApiThemeWithUnlock): Theme {
  return {
    id: api.id,
    name: api.name,
    description: api.description ?? "",
    type: api.type,
    minLevel: api.minLevel,
    colorPrimary: api.colorPrimary ?? undefined,
    colorSecondary: api.colorSecondary ?? undefined,
    accentColor: api.accentColor ?? undefined,
    unlocked: api.unlocked,
  };
}
