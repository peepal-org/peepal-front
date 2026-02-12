import { MapFilters } from "@/components/map/MapFilters";
import { MapSearchBar } from "@/components/map/MapSearchBar";
import { ToiletListView } from "@/components/map/ToiletListView";
import { useToiletListViewModel } from "@/features/toilet/useToiletListViewModel";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ToiletListScreen() {
  const toiletListViewModel = useToiletListViewModel();

  const router = useRouter();

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: toiletListViewModel.theme.background },
      ]}
    >
      <View style={styles.header}>
        <Text
          style={[
            styles.headerTitle,
            { color: toiletListViewModel.theme.text },
          ]}
        >
          Toilettes à proximité
        </Text>
      </View>

      {/*Search bar */}
      <MapSearchBar
        value={toiletListViewModel.searchQuery}
        onChangeText={toiletListViewModel.setSearchQuery}
      />

      {/* Filters */}
      <MapFilters
        filterFree={toiletListViewModel.filterFree}
        filterAccessible={toiletListViewModel.filterAccessible}
        filterOpenNow={toiletListViewModel.filterOpenNow}
        onToggleFree={() => toiletListViewModel.setFilterFree((prev) => !prev)}
        onToggleAccessible={() =>
          toiletListViewModel.setFilterAccessible((prev) => !prev)
        }
        onToggleOpenNow={() =>
          toiletListViewModel.setFilterOpenNow((prev) => !prev)
        }
      />

      {/* List full pagee */}
      <View style={styles.listWrapper}>
        <ToiletListView
          toilets={toiletListViewModel.filteredToilets}
          userLocation={toiletListViewModel.userLocation}
          onPressToilet={toiletListViewModel.handlePressToilet}
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
    marginTop: 80,
  },

  // Floating back to card
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
