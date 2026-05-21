import { ApiUser } from "./ApiUser";

import { Statut } from "../../types/Statut";

export type ApiToilet = {
  id: number;
  name: string;
  external_id: string;
  address: string;
  latitude: number;
  longitude: number;
  types: string[];
  accessible: boolean;
  free: boolean;
  clean: boolean;
  opening_hours: string;
  createdAt: string;
  status?: Statut;
  likes?: number;
  dislikes?: number;
  createdBy?: ApiUser | { id: number } | null;
};

export type CreateToiletPayload = Omit<
  ApiToilet,
  "id" | "createdAt" | "createdBy"
> & {
  createdBy: number;
};
