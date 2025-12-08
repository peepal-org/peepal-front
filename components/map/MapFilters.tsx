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
  onToggleFree: () => void;
};

export function MapFilters({ filterFree, onToggleFree }: MapFiltersProps) {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  return (
    <View style={[styles.filterBar, { top: insets.top + 64 }]}>
      {/* Free */}
      <TouchableOpacity
        style={[
          styles.filterButton,
          { backgroundColor: theme.card },
          filterFree && { backgroundColor: theme.primary },
        ]}
        onPress={onToggleFree}
      >
        <Text
          style={[
            styles.filterText,
            { color: theme.text },
            filterFree && { color: theme.card },
          ]}
        >
          Free
        </Text>
      </TouchableOpacity>

      {/* PMR */}
      <TouchableOpacity
        style={[styles.filterButton, { backgroundColor: theme.card }]}
      >
        <Text style={[styles.filterText, { color: theme.text }]}>PMR</Text>
      </TouchableOpacity>

      {/* Open Now */}
      <TouchableOpacity
        style={[styles.filterButton, { backgroundColor: theme.card }]}
      >
        <Text style={[styles.filterText, { color: theme.text }]}>Open Now</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  filterBar: {
    position: "absolute",
    flexDirection: "row",
    left: 20,
    right: 20,
    justifyContent: "space-around",
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    ...Shadows.dp1,
  },
  filterText: {
    fontWeight: "500",
  },
});
