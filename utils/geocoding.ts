import * as Location from "expo-location";

export async function getAddressFromCoords(
  lat: number,
  lon: number,
): Promise<string> {
  try {
    const results = await Location.reverseGeocodeAsync({
      latitude: lat,
      longitude: lon,
    });

    if (results.length > 0) {
      const addr = results[0];

      const line1 = [addr.name, addr.street].filter(Boolean).join(" ");
      const line2 = [addr.postalCode, addr.city].filter(Boolean).join(" ");

      if (line1 && line2) return `${line1}, ${line2}`;
      if (line1) return line1;
      if (line2) return line2;
    }
  } catch (e) {
    console.error("Reverse geocoding error:", e);
  }

  return "Adresse inconnue";
}

export async function getCoordsFromAddress(address: string) {
  const results = await Location.geocodeAsync(address);
  if (results.length === 0) return null;
  return {
    latitude: results[0].latitude,
    longitude: results[0].longitude,
  };
}
