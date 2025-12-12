export type ApiUser = {
  id: number;
  name: string;
  email: string;
  photo_url?: string | null;
  points?: number;
  level?: number;
  createdAt?: string;
};
