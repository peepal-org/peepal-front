import type { ApiToilet } from "@/types/api/ApiToilet";
import type { Toilet } from "@/types/ui/Toilet";

export function mapApiToilet(api: ApiToilet): Toilet {
  return {
    id: String(api.id),
    name: api.name,
    latitude: api.latitude,
    longitude: api.longitude,
    free: api.free,
    accessible: api.accessible,

    address: api.address,
    openingHours: api.opening_hours,
    type: api.type,
    // UI computed later
    image: undefined,
    isOpen: undefined,
  };
}
