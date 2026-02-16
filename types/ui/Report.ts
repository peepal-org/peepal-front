export type Report = {
  id: number;
  userId: number;
  userName: string;
  userPhotoUrl?: string | null;
  toiletId: number;
  toiletName: string;
  type: "closed" | "dirty" | "maintenance" | "other";
  description: string;
  createdAt: string;
  dateLabel: string;
};