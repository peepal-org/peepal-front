export type QuestFrequency = "daily" | "weekly" | "advanced" | "elite";

export type QuestType =
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

export type Quest = {
  id: number;
  name: string;
  description: string;
  frequency: QuestFrequency;
  type: QuestType;
  requiredCount: number;
  currentProgress: number;
  rewardPoints: number;
  isCompleted: boolean;
};
