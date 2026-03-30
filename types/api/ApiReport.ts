import type { ApiUser } from "./ApiUser";
import type { ApiToilet } from "./ApiToilet";

export type ApiReport = {
  id: number;
  user: ApiUser;
  toilet: ApiToilet;
  type: "closed" | "dirty" | "maintenance" | "other";
  description: string;
  createdAt: string;
};

export type Report = {
  userId: number;
  toiletId: number;
  type: "closed" | "dirty" | "maintenance" | "other";
  description: string;
};

export type ReportCommentDto = {
  userId: number;
  commentId: number;
  type: "spam" | "offensive" | "other";
  description: string;
};