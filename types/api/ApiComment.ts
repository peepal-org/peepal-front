import type { ApiUser } from "./ApiUser";

export type ApiComment = {
  id: number;
  content: string;
  rating: number;
  createdAt: string;
  user: ApiUser;
  toilet: { id: number };
};
