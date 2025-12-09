import { Colors } from "@/constants/Colors";
import { Shadows } from "@/constants/Shadows";
import { Toilet } from "@/types/Toilet";
import React from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";

type Props = {
  toilets: Toilet[];
  onPressToilet: (id: string) => void;
  userLocation: { latitude: number; longitude: number } | null;
};

// Calculate the distance in km between two GPS points
// using the Haversine formula (distance on a sphere)
function getDistanceKm(
  from: { latitude: number; longitude: number },
  to: { latitude: number; longitude: number }
): number {
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
function getDistanceLabel(
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

export function ToiletHorizontalList({
  toilets,
  onPressToilet,
  userLocation,
}: Props) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  if (!toilets.length) {
    return null;
  }

  // Sort toilets by distance when user location is available (no hook)
  const sortedToilets = !userLocation
    ? toilets
    : [...toilets].sort((a, b) => {
        const distA = getDistanceKm(userLocation, {
          latitude: a.latitude,
          longitude: a.longitude,
        });
        const distB = getDistanceKm(userLocation, {
          latitude: b.latitude,
          longitude: b.longitude,
        });

        return distA - distB; // closest first
      });

  return (
    <View style={styles.cardList}>
      <FlatList
        data={sortedToilets}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => {
          const distanceLabel = getDistanceLabel(userLocation, item);

          return (
            <TouchableOpacity
              style={[
                styles.card,
                Shadows.dp2,
                { backgroundColor: theme.card },
              ]}
              onPress={() => onPressToilet(item.id)}
            >
              <Image source={{ uri: item.image }} style={styles.cardImage} />
              <View style={styles.cardTextContainer}>
                <View style={styles.titleRow}>
                  <Text style={[styles.cardTitle, { color: theme.text }]}>
                    {item.name}
                  </Text>

                  {item.accessible && (
                    <Text style={styles.accessibleIcon}>♿</Text>
                  )}
                </View>

                <View style={styles.cardMetaRow}>
                  <Text
                    style={[
                      styles.cardSubtitle,
                      {
                        color: item.free ? theme.success : theme.error,
                      },
                    ]}
                  >
                    {item.free ? "Free" : "Payant"}
                  </Text>

                  {distanceLabel && (
                    <Text
                      style={[styles.cardDistance, { color: theme.textMuted }]}
                    >
                      · {distanceLabel}
                    </Text>
                  )}
                  <Text
                    style={[
                      styles.cardSubtitle,
                      { color: item.isOpen ? theme.success : theme.error },
                    ]}
                  >
                    {item.isOpen ? "Ouvert" : "Fermé"}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  cardList: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    maxHeight: 260,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 12,
    marginBottom: 12,
  },
  cardImage: {
    width: 70,
    height: 70,
    borderRadius: 10,
    marginRight: 10,
  },
  cardTextContainer: {
    flex: 1,
  },
  cardTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
  },
  cardMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  cardDistance: {
    fontSize: 13,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  accessibleIcon: {
    fontSize: 16,
    color: "#3BAF74",
  },
});
