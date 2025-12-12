import { Colors } from "@/constants/Colors";
import { Shadows } from "@/constants/Shadows";
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

export default function ContributeScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>
          Contribute
        </Text>
      </View>

      {/* ADD RESTROOM BLOCK */}
      <View style={styles.block}>
        <Text style={[styles.blockTitle, { color: theme.text }]}>
          Add a Restroom
        </Text>
        <Text style={[styles.blockDescription, { color: theme.textMuted }]}>
          Help others by adding a restroom that&apos;s not yet on the map.
        </Text>

        <TouchableOpacity
          style={[
            styles.primaryButton,
            { backgroundColor: theme.primary },
            Shadows.dp2,
          ]}
          onPress={() => router.push("/contribute/add-restroom")}
        >
          <Text style={[styles.primaryButtonText, { color: theme.card }]}>
            Add Restroom
          </Text>
        </TouchableOpacity>
      </View>

      {/* REPORT ISSUE BLOCK */}
      <View style={styles.block}>
        <Text style={[styles.blockTitle, { color: theme.text }]}>
          Report an Issue
        </Text>
        <Text style={[styles.blockDescription, { color: theme.textMuted }]}>
          Report issues like closures, cleanliness, or maintenance needs to keep
          our community informed.
        </Text>

        <TouchableOpacity
          style={[
            styles.secondaryButton,
            { backgroundColor: theme.card, borderColor: theme.border },
          ]}
          onPress={() => {
            // plus tard → écran de report
          }}
        >
          <Text
            style={[styles.secondaryButtonText, { color: theme.textMuted }]}
          >
            Report Issue
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
  },

  block: {
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  blockTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8,
  },
  blockDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },

  primaryButton: {
    paddingVertical: 14,
    borderRadius: 999,
    alignItems: "center",
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },

  secondaryButton: {
    paddingVertical: 12,
    borderRadius: 999,
    borderWidth: 1,
    alignItems: "center",
  },
  secondaryButtonText: {
    fontSize: 15,
    fontWeight: "500",
  },
});
