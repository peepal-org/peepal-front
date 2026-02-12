export type UserRole = "user" | "admin" | "moderator";

export type User = {
  id: number;
  name: string;
  email: string;
  createdAt: string; // ISO string
  role: UserRole;
  photoUrl?: string | null;
  points: number;
  level: number;
  bio?: string;
};
