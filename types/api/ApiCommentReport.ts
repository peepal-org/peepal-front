import type { ApiComment } from "./ApiComment";
import type { ApiUser } from "./ApiUser";

export type ApiCommentReport = {
  id: number;
  user: ApiUser;
  comment: ApiComment;
  type: "spam" | "offensive" | "other";
  description: string;
  createdAt: string;
};
