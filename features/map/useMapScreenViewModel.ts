import { Colors } from "@/constants/Colors";
import { apiFetch } from "@/functions/api";
import { useQuery } from "@tanstack/react-query";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { useColorScheme } from "react-native";
import MapView, { LatLng, Region } from "react-native-maps";

const FALLBACK_REGION: Region = {
  latitude: 48.867, // Paris fallback
  longitude: 2.363,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

export function useMapScreenViewModel() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  const [filterFree, setFilterFree] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showNearbyList, setShowNearbyList] = useState(true);
  const [filterAccessible, setFilterAccessible] = useState(false);
  const [filterOpenNow, setFilterOpenNow] = useState(false);

  const [userLocation, setUserLocation] = useState<LatLng | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  const mapRef = useRef<MapView | null>(null);

  const {
    data: toilets = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["toilets"],
    queryFn: () => apiFetch<any[]>("/toilets"),
  });

  const apiError =
    error instanceof Error ? error.message : error ? String(error) : null;

  // Permission request + position retrieval
  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== "granted") {
          setLocationError("Localisation désactivée");
          return;
        }

        const loc = await Location.getCurrentPositionAsync({
          //A little more precision
          accuracy: Location.Accuracy.High,
        });

        const coords: LatLng = {
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        };

        setUserLocation(coords);

        const targetRegion: Region = {
          latitude: coords.latitude,
          longitude: coords.longitude,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        };

        mapRef.current?.animateToRegion(targetRegion, 600);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (e) {
        setLocationError("Impossible de récupérer la position");
      }
    })();
  }, []);

  // Center the card on user
  const recenterOnUser = useCallback(async () => {
    try {
      let coords = userLocation;

      if (!coords) {
        const loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });
        coords = {
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        };
        setUserLocation(coords);
      }

      if (coords) {
        const targetRegion: Region = {
          latitude: coords.latitude,
          longitude: coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        };
        mapRef.current?.animateToRegion(targetRegion, 600);
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      setLocationError("Impossible de recentrer sur votre position");
    }
  }, [userLocation]);

  //  Apply filters and search
  let filteredToilets = toilets;

  if (filterFree) {
    filteredToilets = filteredToilets.filter((t) => t.free);
  }

  if (filterAccessible) {
    filteredToilets = filteredToilets.filter((t) => t.accessible);
  }

  if (filterOpenNow) {
    filteredToilets = filteredToilets.filter(
      (t: any) => (t as any).isOpen ?? true
    );
  }

  if (searchQuery.trim().length > 0) {
    const q = searchQuery.trim().toLowerCase();
    filteredToilets = filteredToilets.filter((t) =>
      t.name.toLowerCase().includes(q)
    );
  }

  const handlePressToilet = useCallback(
    (id: string) => {
      router.push(`/toilet/${id}`);
    },
    [router]
  );

  const goToContribute = useCallback(() => {
    router.push("/contribute");
  }, [router]);

  return {
    // theme
    theme,

    // filters & search
    filterFree,
    setFilterFree,
    filterAccessible,
    setFilterAccessible,
    filterOpenNow,
    setFilterOpenNow,
    searchQuery,
    setSearchQuery,

    // show lst
    showNearbyList,
    setShowNearbyList,

    // datas
    filteredToilets,
    userLocation,
    locationError,

    isLoading,
    apiError,
    refetchToilets: refetch,

    // actions
    recenterOnUser,
    handlePressToilet,
    goToContribute,

    // map
    mapRef,
    FALLBACK_REGION,
  };
}
