import { Colors } from "@/constants/Colors";
import { useToilets } from "@/hooks/useToilets";
import { getErrorMessage } from "@/utils/errorHandler";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { useColorScheme } from "react-native";
import MapView, { Region } from "react-native-maps";

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
  const toilets = useToilets();

  const [showNearbyList, setShowNearbyList] = useState(true);
  const mapRef = useRef<MapView | null>(null);

  // Permission request + position retrieval
  useEffect(() => {
    if (toilets.userLocation) {
      mapRef.current?.animateToRegion(
        {
          latitude: toilets.userLocation.latitude,
          longitude: toilets.userLocation.longitude,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        },
        600,
      );
    }
  }, [toilets.userLocation]);

  // Center the card on user
  const recenterOnUser = useCallback(async () => {
    try {
      let coords = toilets.userLocation;

      if (!coords) {
        const loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });
        coords = {
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        };
        toilets.setUserLocation(coords);
      }

      if (coords) {
        mapRef.current?.animateToRegion(
          {
            latitude: coords.latitude,
            longitude: coords.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          },
          600,
        );
      }
    } catch (err: unknown) {
      toilets.setLocationError(
        getErrorMessage(err, "Impossible de recentrer sur votre position."),
      );
    }
  }, [toilets]);

  const goToContribute = useCallback(() => {
    router.push("/contribute");
  }, [router]);

  return {
    // theme
    theme,

    // show lst
    showNearbyList,
    setShowNearbyList,

    ...toilets,

    // actions
    recenterOnUser,
    goToContribute,

    // map
    mapRef,
    FALLBACK_REGION,
  };
}
