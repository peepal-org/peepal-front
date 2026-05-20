import { Statut } from "../Statut";

export type Toilet = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  free: boolean;
  accessible: boolean;
  address?: string;
  openingHours?: string;
  // later will be "mall", "highway_rest_area", etc.
  type?: string;
  image?: string;
  isOpen?: boolean;
  statut: Statut;
  likes?: number;
  dislikes?: number;
};

export type RestroomType =
  | "public"
  | "cafe"
  | "restaurant"
  | "centre_commercial"
  | "autre";

export type Accessibility = "accessible" | "non_accessible" | "inconnue";
export type Opening = "24_7" | "horaires_comm" | "inconnus";

export type CreateToiletForm = {
  name: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
  restroomType: RestroomType;
  accessibility: Accessibility;
  opening: Opening;
};
