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
import { Pulse } from "react-native-animated-spinkit";
// import { Wave, ChasingDots, Circle } from "react-native-animated-spinkit";
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
    isLoading,
    apiError,
  } = useMapScreenViewModel();
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <Pulse size={60} color={theme.primary} />
          <Text style={styles.loadingText}>Chargement des toilettes…</Text>
        </View>
      )}
      {apiError && (
        <View style={styles.errorBanner}>
          <Text style={{ color: theme.text }}>Erreur : {apiError}</Text>
        </View>
      )}
      {/*  Map */}
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={FALLBACK_REGION}
        showsUserLocation
        followsUserLocation={false}
      >
        {filteredToilets
          .filter((toilet) => toilet.status === "accepted")
          .map((toilet) => (
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

      {filteredToilets.filter((toilet) => toilet.status === "accepted").length > 0 && (
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
      )}

      {showNearbyList && (
        <ToiletHorizontalList
          toilets={filteredToilets.filter((toilet) => toilet.status === "accepted")}
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
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
  },

  loadingText: {
    marginTop: 8,
    fontSize: 16,
    color: "white",
    fontWeight: "500",
  },

  locationBanner: {
    position: "absolute",
    top: 10,
    alignSelf: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "rgba(0,0,0,0.05)",
  },
  errorBanner: {
    position: "absolute",
    top: 50,
    alignSelf: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: "rgba(255, 0, 0, 0.12)",
    borderWidth: 1,
    borderColor: "rgba(255, 0, 0, 0.25)",
    zIndex: 120,
  },
  errorText: {
    fontSize: 13,
    fontWeight: "500",
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
