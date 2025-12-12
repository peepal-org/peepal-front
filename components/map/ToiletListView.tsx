import { Colors } from "@/constants/Colors";
import { DEFAULT_TOILET_IMAGE } from "@/constants/Images";
import { Shadows } from "@/constants/Shadows";
import type { Toilet } from "@/types/ui/Toilet";
import { getDistanceLabel } from "@/utils/distance";
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

export function ToiletListView({
  toilets,
  onPressToilet,
  userLocation,
}: Props) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  if (!toilets.length) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={[styles.emptyText, { color: theme.textMuted }]}>
          Aucune toilette trouvée avec ces filtres.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.listContainer}>
      <FlatList
        data={toilets}
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
              <Image
                source={{ uri: item.image ?? DEFAULT_TOILET_IMAGE }}
                style={styles.cardImage}
              />

              <View style={styles.cardTextContainer}>
                <Text style={[styles.cardTitle, { color: theme.text }]}>
                  {item.name}
                </Text>

                <View style={styles.cardMetaRow}>
                  <Text
                    style={[
                      styles.cardSubtitle,
                      { color: item.free ? theme.success : theme.error },
                    ]}
                  >
                    {item.free ? "Gratuit" : "Payant"}
                  </Text>

                  {item.accessible && (
                    <Text
                      style={[
                        styles.cardAccessible,
                        { color: theme.textMuted },
                      ]}
                    >
                      · ♿ Accessible
                    </Text>
                  )}

                  {distanceLabel && (
                    <Text
                      style={[styles.cardDistance, { color: theme.textMuted }]}
                    >
                      · {distanceLabel}
                    </Text>
                  )}
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
  listContainer: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 8,
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
    flexWrap: "wrap",
  },
  cardAccessible: {
    fontSize: 13,
  },
  cardDistance: {
    fontSize: 13,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  emptyText: {
    fontSize: 14,
    textAlign: "center",
  },
});
