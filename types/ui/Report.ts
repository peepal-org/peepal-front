export type ReportTargetType = "toilet" | "comment";
export type ReportIssueType =
  | "closed"
  | "dirty"
  | "maintenance"
  | "spam"
  | "offensive"
  | "other";

export type Report = {
  id: number;
  userId: number;
  userName: string;
  userPhotoUrl?: string | null;
  toiletId: number;
  toiletName: string;
  toiletImage?: string | null;
  commentId?: number;
  type: ReportIssueType;
  description: string;
  createdAt: string;
  dateLabel: string;
  targetType: ReportTargetType;
};