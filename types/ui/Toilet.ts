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
};
