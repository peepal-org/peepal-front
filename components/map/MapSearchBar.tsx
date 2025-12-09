import { Colors } from "@/constants/Colors";
import React from "react";
import { StyleSheet, TextInput, useColorScheme } from "react-native";
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
    <TextInput
      placeholder="Rechercher une adresse ou un lieu"
      placeholderTextColor={theme.textMuted}
      value={value}
      onChangeText={onChangeText}
      style={[
        styles.searchBar,
        {
          backgroundColor: theme.card,
          color: theme.text,
          top: insets.top + 12,
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  searchBar: {
    position: "absolute",
    left: 20,
    right: 20,
    borderRadius: 10,
    padding: 10,
  },
});
