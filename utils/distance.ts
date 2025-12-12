import type { Toilet } from "@/types/ui/Toilet";

export type LatLngLike = {
  latitude: number;
  longitude: number;
};

// Calculate the distance in km between two GPS points
// using the Haversine formula (distance on a sphere)
export function getDistanceKm(from: LatLngLike, to: LatLngLike): number {
  // R = average radius of the Earth in kilometers.
  const R = 6371;
  // difference in radians
  // conversion degrees in radians
  const dLat = ((to.latitude - from.latitude) * Math.PI) / 180;
  const dLon = ((to.longitude - from.longitude) * Math.PI) / 180;

  const lat1 = (from.latitude * Math.PI) / 180;
  const lat2 = (to.latitude * Math.PI) / 180;

  // Haversine formula
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);

  // Calculate the central angle between two points
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  // convert the angle to distance
  return R * c;
}

// Returns a readable label (e.g., "350 m" or "1.2 km")
export function getDistanceLabel(
  userLocation: { latitude: number; longitude: number } | null,
  toilet: Toilet
): string | null {
  if (!userLocation) return null;

  const distanceKm = getDistanceKm(userLocation, {
    latitude: toilet.latitude,
    longitude: toilet.longitude,
  });

  if (distanceKm < 1) {
    const meters = Math.round(distanceKm * 1000);
    return `${meters} m`;
  }

  return `${distanceKm.toFixed(1)} km`;
}

export function sortToiletsByDistance(
  toilets: Toilet[],
  userLocation: LatLngLike | null
): Toilet[] {
  if (!userLocation) return toilets;

  return [...toilets].sort((a, b) => {
    const distA = getDistanceKm(userLocation, {
      latitude: a.latitude,
      longitude: a.longitude,
    });
    const distB = getDistanceKm(userLocation, {
      latitude: b.latitude,
      longitude: b.longitude,
    });

    return distA - distB;
  });
}
