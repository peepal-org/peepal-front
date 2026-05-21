export type ApiBadgeRarity = "bronze" | "silver" | "gold";

export type ApiBadge = {
  id: number;
  name: string;
  description?: string | null;
  icon_url?: string | null;
  rarity: ApiBadgeRarity;
  minPoints: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type ApiQuestFrequency = "daily" | "weekly" | "advanced" | "elite";

export type ApiQuestType =
  | "add_toilet"
  | "add_photo"
  | "like_toilets"
  | "add_validated_toilets"
  | "make_reports"
  | "complete_fiches"
  | "verify_pending"
  | "detect_duplicates"
  | "merge_duplicates"
  | "resolve_reports";

export type ApiQuest = {
  id: number;
  name: string;
  description?: string | null;
  frequency: ApiQuestFrequency;
  type: ApiQuestType;
  minLevel: number;
  requiredCount: number;
  rewardPoints: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type ApiUserQuestProgress = {
  id: number;
  currentProgress: number;
  isCompleted: boolean;
  startedAt: string;
  completedAt: string | null;
  updatedAt: string;
};

export type ApiQuestWithProgress = {
  quest: ApiQuest;
  progress: ApiUserQuestProgress | null;
};

export type ApiGamificationStats = {
  level: number;
  levelLabel?: string;
  points: number;
  trustWeight: number;
  badges: ApiBadge[];
  dailyQuests: ApiQuestWithProgress[];
  weeklyQuests: ApiQuestWithProgress[];
};

export type ApiThemeType = "basic" | "premium" | "animated" | "exclusive";

export type ApiTheme = {
  id: number;
  name: string;
  description?: string | null;
  type: ApiThemeType;
  minLevel: number;
  colorPrimary?: string | null;
  colorSecondary?: string | null;
  accentColor?: string | null;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type ApiThemeWithUnlock = ApiTheme & {
  unlocked: boolean;
};
