import { ApiUser } from "./ApiUser";

export type ApiToilet = {
  id: number;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  types: string[];
  accessible: boolean;
  free: boolean;
  clean: boolean;
  opening_hours: string;
  createdAt: string;
  createdBy?: ApiUser | { id: number } | null;
};

export type CreateToiletPayload = Omit<
  ApiToilet,
  "id" | "createdAt" | "createdBy"
> & {
  createdBy: number;
};
