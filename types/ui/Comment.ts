export type Comment = {
  id: string;
  toiletId: string;
  rating: number;
  content: string;
  createdAt: string;
  dateLabel?: string;
  user: {
    id: string;
    name: string;
    photoUrl?: string | null;
  };
};
