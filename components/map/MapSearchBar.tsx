import { Colors } from "@/constants/Colors";
import React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type MapSearchBarProps = {
  value: string;
  onChangeText: (text: string) => void;
};

export function MapSearchBar({ value, onChangeText }: MapSearchBarProps) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {
          top: insets.top + 12,
          backgroundColor:
            colorScheme === "dark"
              ? "rgba(30,30,30,0.85)"
              : "rgba(255,255,255,0.85)",
        },
      ]}
    >
      {/* 🔍 Icon */}
      <TextInput
        placeholder="Rechercher une adresse ou un lieu"
        placeholderTextColor={theme.textMuted}
        value={value}
        onChangeText={onChangeText}
        style={[styles.input, { color: theme.text }]}
      />

      {/* ✖ Clear button */}
      {value.length > 0 && (
        <TouchableOpacity onPress={() => onChangeText("")} style={styles.clear}>
          <Text style={styles.clearText}>×</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 16,
    right: 16,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    borderRadius: 50,
    height: 46,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  input: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 8,
  },
  clear: {
    padding: 6,
  },
  clearText: {
    fontSize: 20,
    color: "#000",
    lineHeight: 20,
  },
});
