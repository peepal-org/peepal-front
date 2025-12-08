// components/map/MapFloatingButtons.tsx
import { Colors } from "@/constants/Colors";
import { Shadows } from "@/constants/Shadows";
import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
} from "react-native";

type Props = {
  onRecenter: () => void;
  onAddToilet: () => void;
};

export function MapFloatingButtons({ onRecenter, onAddToilet }: Props) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  return (
    <>
      {/* Recenter on user */}
      <TouchableOpacity
        style={[
          styles.fab,
          Shadows.dp4,
          { bottom: 80, backgroundColor: theme.card },
        ]}
        onPress={onRecenter}
      >
        <Text style={styles.fabIcon}>📍</Text>
      </TouchableOpacity>

      {/* ＋ Add toilet */}
      <TouchableOpacity
        style={[
          styles.fab,
          Shadows.dp4,
          { bottom: 20, backgroundColor: theme.accent },
        ]}
        onPress={onAddToilet}
      >
        <Text style={styles.fabIcon}>＋</Text>
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  fabIcon: {
    fontSize: 20,
  },
});
