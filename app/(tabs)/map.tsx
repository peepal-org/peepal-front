import { MapFilters } from "@/components/map/MapFilters";
import { MapFloatingButtons } from "@/components/map/MapFloatingButtons";
import { MapSearchBar } from "@/components/map/MapSearchBar";
import { ToiletHorizontalList } from "@/components/map/ToiletHorizontalList";
import { ToiletMarker } from "@/components/map/ToiletMarker";
import { Shadows } from "@/constants/Shadows";
import { useMapScreenViewModel } from "@/features/map/useMapScreenViewModel";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MapView from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MapScreen() {
  const {
    theme,
    filterFree,
    setFilterFree,
    filterAccessible,
    setFilterAccessible,
    filterOpenNow,
    setFilterOpenNow,
    searchQuery,
    setSearchQuery,
    showNearbyList,
    setShowNearbyList,
    filteredToilets,
    userLocation,
    locationError,
    recenterOnUser,
    handlePressToilet,
    goToContribute,
    mapRef,
    FALLBACK_REGION,
  } = useMapScreenViewModel();
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      {/*  Map */}
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={FALLBACK_REGION}
        showsUserLocation
        followsUserLocation={false}
      >
        {filteredToilets.map((toilet) => (
          <ToiletMarker
            key={toilet.id}
            toilet={toilet}
            theme={theme}
            onPress={() => handlePressToilet(toilet.id)}
          />
        ))}
      </MapView>

      {/* Search Bar */}
      <MapSearchBar value={searchQuery} onChangeText={setSearchQuery} />

      {/* Filters */}
      <MapFilters
        filterFree={filterFree}
        filterAccessible={filterAccessible}
        filterOpenNow={filterOpenNow}
        onToggleFree={() => setFilterFree((prev) => !prev)}
        onToggleAccessible={() => setFilterAccessible((prev) => !prev)}
        onToggleOpenNow={() => setFilterOpenNow((prev) => !prev)}
      />

      {/* Show/Hide nearby toilets list button */}
      <TouchableOpacity
        style={[styles.nearbyToggle, { bottom: showNearbyList ? 270 : 40 }]}
        onPress={() => setShowNearbyList((prev) => !prev)}
      >
        <Text style={styles.nearbyToggleText}>
          {showNearbyList
            ? "Masquer les toilettes proches ▾"
            : "Afficher les toilettes proches ▴"}
        </Text>
      </TouchableOpacity>

      {showNearbyList && (
        <ToiletHorizontalList
          toilets={filteredToilets}
          userLocation={userLocation}
          onPressToilet={handlePressToilet}
        />
      )}

      {/* Recenter + Add a toilet */}
      <MapFloatingButtons
        onRecenter={recenterOnUser}
        onAddToilet={goToContribute}
        onOpenList={() => router.push("/toilet/list")}
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
    backgroundColor: "rgba(0,0,0,0.35)",
    ...Shadows.dp1,
  },
  nearbyToggleText: {
    fontSize: 13,
    fontWeight: "500",
    color: "white",
  },
  listButton: {
    position: "absolute",
    top: 10,
    right: 16,
    zIndex: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  listButtonText: {
    color: "white",
    fontSize: 13,
    fontWeight: "500",
  },
});
