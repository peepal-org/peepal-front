export type Report = {
  userId: number;
  toiletId: number;
  type: "closed" | "dirty" | "maintenance" | "other";
  description: string;
};
