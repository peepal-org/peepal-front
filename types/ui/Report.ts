export type Report = {
  id: number;
  userId: number;
  userName: string;
  userPhotoUrl?: string | null;
  toiletId: number;
  toiletName: string;
  toiletImage?: string | null;
  type: "closed" | "dirty" | "maintenance" | "other";
  description: string;
  createdAt: string;
  dateLabel: string;
};