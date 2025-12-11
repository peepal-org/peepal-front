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
  onOpenList?: () => void;
};

export function MapFloatingButtons({
  onRecenter,
  onAddToilet,
  onOpenList,
}: Props) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  // translucent background
  const translucentBg =
    colorScheme === "dark"
      ? "rgba(20,20,20,0.65)" // elegant dark
      : "rgba(255,255,255,0.75)"; // elegant light

  return (
    <>
      {/* View list */}
      {onOpenList && (
        <TouchableOpacity
          style={[
            styles.fab,
            Shadows.dp4,
            { bottom: 140, backgroundColor: translucentBg },
          ]}
          activeOpacity={0.7}
          onPress={onOpenList}
        >
          <Text style={[styles.fabIcon, { color: theme.text }]}>☰</Text>
        </TouchableOpacity>
      )}
      {/* Center */}
      <TouchableOpacity
        style={[
          styles.fab,
          Shadows.dp4,
          { bottom: 80, backgroundColor: translucentBg },
        ]}
        activeOpacity={0.7}
        onPress={onRecenter}
      >
        <Text style={[styles.fabIcon, { color: theme.text }]}>⌖</Text>
      </TouchableOpacity>

      {/* ＋ Add toilet */}
      <TouchableOpacity
        style={[
          styles.fab,
          Shadows.dp4,
          { bottom: 20, backgroundColor: translucentBg },
        ]}
        activeOpacity={0.7}
        onPress={onAddToilet}
      >
        <Text style={[styles.fabIcon, { color: theme.text }]}>＋</Text>
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
    // iOS only, ignore on Android
    backdropFilter: "blur(6px)",
  },
  fabIcon: {
    fontSize: 22,
    fontWeight: "600",
  },
});
