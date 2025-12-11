export type Comment = {
  id: string;
  toiletId: string;
  userId: string;
  rating: number;
  content: string;
  createdAt: string; // ISO string
  dateLabel?: string;
};
