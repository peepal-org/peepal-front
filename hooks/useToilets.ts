import { apiFetch } from "@/functions/api";
import { mapApiToilet } from "@/functions/mappers/toilet";
import type { ApiToilet } from "@/types/api/ApiToilet";
import type { Toilet } from "@/types/ui/Toilet";
import { getErrorMessage } from "@/utils/errorHandler";
import { filterToilets } from "@/utils/filterToilets";
import { useQuery } from "@tanstack/react-query";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { LatLng } from "react-native-maps";

export function useToilets() {
  const router = useRouter();

  // Filters & search
  const [filterFree, setFilterFree] = useState(false);
  const [filterAccessible, setFilterAccessible] = useState(false);
  const [filterOpenNow, setFilterOpenNow] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Location
  const [userLocation, setUserLocation] = useState<LatLng | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Fetch
  const {
    data: toilets = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["toilets"],
    queryFn: () => apiFetch<ApiToilet[]>("/toilets"),
    select: (apiToilets) => apiToilets.map(mapApiToilet) as Toilet[],
  });

  const apiError = error
    ? getErrorMessage(error, "Erreur de chargement des toilettes.")
    : null;

  // Location permission
  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setLocationError("Localisation désactivée");
          return;
        }

        const loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });

        setUserLocation({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        });
      } catch (err: unknown) {
        setLocationError(
          getErrorMessage(err, "Impossible de récupérer la position."),
        );
      }
    })();
  }, []);

  // Apply filters and search
  const filteredToilets = filterToilets(toilets, {
    filterFree,
    filterAccessible,
    filterOpenNow,
    searchQuery,
  });

  const handlePressToilet = useCallback(
    (id: string) => router.push(`/toilet/${id}`),
    [router],
  );

  return {
    // Filters
    filterFree,
    setFilterFree,
    filterAccessible,
    setFilterAccessible,
    filterOpenNow,
    setFilterOpenNow,
    searchQuery,
    setSearchQuery,

    // Data
    filteredToilets,
    userLocation,
    setUserLocation,
    locationError,
    setLocationError,
    isLoading,
    apiError,
    refetchToilets: refetch,

    // Actions
    handlePressToilet,
  };
}
