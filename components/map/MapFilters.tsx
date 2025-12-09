import { Colors } from "@/constants/Colors";
import { Shadows } from "@/constants/Shadows";
import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type MapFiltersProps = {
  filterFree: boolean;
  filterAccessible: boolean;
  filterOpenNow: boolean;
  onToggleFree: () => void;
  onToggleAccessible: () => void;
  onToggleOpenNow: () => void;
};

export function MapFilters({
  filterFree,
  filterAccessible,
  filterOpenNow,
  onToggleFree,
  onToggleAccessible,
  onToggleOpenNow,
}: MapFiltersProps) {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  return (
    <View style={[styles.filterBar, { top: insets.top + 64 }]}>
      {/* Gratuit */}
      <TouchableOpacity
        style={[
          styles.filterButton,
          { borderColor: theme.border, backgroundColor: theme.card },
          filterFree && {
            backgroundColor: theme.primary,
            borderColor: theme.primary,
          },
        ]}
        activeOpacity={0.7}
        onPress={onToggleFree}
      >
        <Text
          style={[
            styles.filterText,
            { color: theme.text },
            filterFree && { color: theme.card },
          ]}
        >
          Gratuit
        </Text>
      </TouchableOpacity>

      {/* PMR */}
      <TouchableOpacity
        style={[
          styles.filterButton,
          { borderColor: theme.border, backgroundColor: theme.card },
          filterAccessible && {
            backgroundColor: theme.primary,
            borderColor: theme.primary,
          },
        ]}
        activeOpacity={0.7}
        onPress={onToggleAccessible}
      >
        <Text
          style={[
            styles.filterText,
            { color: theme.text },
            filterAccessible && { color: theme.card },
          ]}
        >
          PMR
        </Text>
      </TouchableOpacity>

      {/* Ouvert maintenant */}
      <TouchableOpacity
        style={[
          styles.filterButton,
          { borderColor: theme.border, backgroundColor: theme.card },
          filterOpenNow && {
            backgroundColor: theme.primary,
            borderColor: theme.primary,
          },
        ]}
        activeOpacity={0.7}
        onPress={onToggleOpenNow}
      >
        <Text
          style={[
            styles.filterText,
            { color: theme.text },
            filterOpenNow && { color: theme.card },
          ]}
        >
          Ouvert
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  filterBar: {
    position: "absolute",
    flexDirection: "row",
    left: 16,
    right: 16,
    justifyContent: "space-between",
    gap: 8,
  },
  filterButton: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    ...Shadows.dp1,
    alignItems: "center",
  },
  filterText: {
    fontWeight: "500",
    fontSize: 13,
  },
});
