export type ApiToilet = {
  id: number;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  type: "public" | "private";
  accessible: boolean;
  free: boolean;
  clean: boolean;
  opening_hours: string;
  createdAt: string;
};
