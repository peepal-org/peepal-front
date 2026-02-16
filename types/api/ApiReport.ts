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