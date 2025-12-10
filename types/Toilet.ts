export type Toilet = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  free: boolean;
  accessible?: boolean;
  image?: string;
  isOpen?: boolean;
};
