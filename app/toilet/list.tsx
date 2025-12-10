import { MapFilters } from "@/components/map/MapFilters";
import { MapSearchBar } from "@/components/map/MapSearchBar";
import { ToiletListView } from "@/components/map/ToiletListView";
import { useMapScreenViewModel } from "@/features/map/useMapScreenViewModel";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ToiletListScreen() {
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
    filteredToilets,
    userLocation,
    handlePressToilet,
  } = useMapScreenViewModel();

  const router = useRouter();

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>
          Toilettes à proximité
        </Text>
      </View>

      {/*Search bar */}
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

      {/* List full pagee */}
      <View style={styles.listWrapper}>
        <ToiletListView
          toilets={filteredToilets}
          userLocation={userLocation}
          onPressToilet={handlePressToilet}
        />
      </View>

      {/* Floating buttonback to the map*/}
      <TouchableOpacity
        style={styles.floatingBack}
        onPress={() => router.back()}
        activeOpacity={0.7}
      >
        <Text style={styles.floatingBackIcon}>🗺️</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "600",
  },

  listWrapper: {
    flex: 1,
    marginTop: 80, // laisse la place à la search bar + filtres
  },

  // 🔘 Floating retour carte
  floatingBack: {
    position: "absolute",
    right: 20,
    bottom: 24,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(0,0,0,0.35)",
    alignItems: "center",
    justifyContent: "center",
  },
  floatingBackIcon: {
    fontSize: 22,
    fontWeight: "600",
    color: "white",
  },
});
