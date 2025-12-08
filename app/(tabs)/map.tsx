import { MapFilters } from "@/components/map/MapFilters";
import { MapFloatingButtons } from "@/components/map/MapFloatingButtons";
import { MapSearchBar } from "@/components/map/MapSearchBar";
import { ToiletHorizontalList } from "@/components/map/ToiletHorizontalList";
import { Colors } from "@/constants/Colors";
import { toilets } from "@/data/toilets";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Shadows } from "@/constants/Shadows";
import * as Location from "expo-location";
import MapView, { LatLng, Marker, Region } from "react-native-maps";

const FALLBACK_REGION: Region = {
  latitude: 48.867, // Paris fallback
  longitude: 2.363,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

export default function MapScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  const [filterFree, setFilterFree] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showNearbyList, setShowNearbyList] = useState(true);

  const [userLocation, setUserLocation] = useState<LatLng | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  const mapRef = useRef<MapView | null>(null);

  //  Request for permission + retrieval of position
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

  //  Refocus the map on the user
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

  // "Free" filter
  let filteredToilets = filterFree ? toilets.filter((t) => t.free) : toilets;
  // search on toilet name for now
  if (searchQuery.trim().length > 0) {
    const q = searchQuery.trim().toLowerCase();
    filteredToilets = filteredToilets.filter((t) =>
      t.name.toLowerCase().includes(q)
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/*Map */}
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={FALLBACK_REGION}
        showsUserLocation
        followsUserLocation={false}
      >
        {filteredToilets.map((toilet) => (
          <Marker
            key={toilet.id}
            coordinate={{
              latitude: toilet.latitude,
              longitude: toilet.longitude,
            }}
            title={toilet.name}
            description={toilet.free ? "Gratuit" : "Payant"}
            onPress={() => router.push(`/toilet/${toilet.id}`)}
            pinColor={theme.primary}
          />
        ))}
      </MapView>

      {/*  Search bar */}
      <MapSearchBar value={searchQuery} onChangeText={setSearchQuery} />

      {/* Filter bar */}
      <MapFilters
        filterFree={filterFree}
        onToggleFree={() => setFilterFree((prev) => !prev)}
      />

      {/* Horizontal list of nearby toilets */}
      <TouchableOpacity
        style={[
          styles.nearbyToggle,
          { bottom: showNearbyList ? 270 : 40 }, // 270 ≈ maxHeight 260 + marge
        ]}
        onPress={() => setShowNearbyList((prev) => !prev)}
      >
        <Text style={styles.nearbyToggleText}>
          {showNearbyList ? "Hide nearby toilets ▾" : "Show nearby toilets ▴"}
        </Text>
      </TouchableOpacity>

      {showNearbyList && (
        <ToiletHorizontalList
          toilets={filteredToilets}
          userLocation={userLocation}
          onPressToilet={(id) => router.push(`/toilet/${id}`)}
        />
      )}

      {/* Recenter on user & contribute */}
      <MapFloatingButtons
        onRecenter={recenterOnUser}
        onAddToilet={() => router.push("/contribute")}
      />

      {locationError && (
        <View style={styles.locationBanner}>
          <Text style={{ color: theme.text }}>{locationError}</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: StyleSheet.absoluteFillObject,

  locationBanner: {
    position: "absolute",
    top: 10,
    alignSelf: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "rgba(0,0,0,0.05)",
  },
  nearbyToggle: {
    position: "absolute",
    alignSelf: "center",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "rgba(0,0,0,0.05)",
    ...Shadows.dp1,
  },
  nearbyToggleText: {
    fontSize: 13,
    fontWeight: "500",
    color: "white",
  },
});
