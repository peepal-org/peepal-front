// app/contribute/add-restroom-success.tsx
import { Colors } from "@/constants/Colors";
import { useRouter } from "expo-router";
import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

export default function AddRestroomSuccessScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.text }]}>
          🎉 Toilet successfully added!
        </Text>
        <Text style={[styles.subtitle, { color: theme.textMuted }]}>
          Thank you for contributing to the Peepal community. 🚽
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: "#0B63CE" }]}
        onPress={() => router.replace("/(tabs)/contribute")}
      >
        <Text style={styles.buttonText}>Return to contribute section</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "space-between" },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 22,
  },
  button: {
    marginHorizontal: 24,
    marginBottom: 24,
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },
});
