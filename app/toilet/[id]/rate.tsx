import { Colors } from "@/constants/Colors";
import { useRateViewModel } from "@/features/toilet/useRateViewModel";
import React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RateToiletScreen() {
  const rateViewModel = useRateViewModel();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      {/* HEADER */}
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <TouchableOpacity
          onPress={rateViewModel.goBack}
          style={styles.headerBack}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={[styles.headerBackIcon, { color: theme.text }]}>←</Text>
        </TouchableOpacity>

        <Text style={[styles.headerTitle, { color: theme.text }]}>
          Noter ces toilettes
        </Text>

        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.content}>
        <Text style={[styles.label, { color: theme.text }]}>
          Ta note globale
        </Text>

        {/* stars */}
        <View style={styles.starsRow}>
          {Array.from({ length: 5 }).map((_, index) => {
            const starValue = index + 1;
            const filled = starValue <= rateViewModel.rating;
            return (
              <TouchableOpacity
                key={starValue}
                onPress={() => rateViewModel.handleSelectRating(starValue)}
                disabled={rateViewModel.isPending}
              >
                <Text
                  style={[
                    styles.star,
                    { color: filled ? "#FBBF24" : theme.textMuted },
                  ]}
                >
                  {filled ? "★" : "☆"}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={[styles.label, { color: theme.text, marginTop: 24 }]}>
          Ton commentaire
        </Text>

        <TextInput
          style={[
            styles.input,
            { borderColor: theme.border, color: theme.text },
          ]}
          placeholder="Ex : Très propre, accès facile, un peu d'attente…"
          placeholderTextColor={theme.textMuted}
          multiline
          value={rateViewModel.comment}
          onChangeText={rateViewModel.setComment}
          editable={!rateViewModel.isPending}
        />

        <TouchableOpacity
          style={[
            styles.submitButton,
            {
              backgroundColor: theme.primary,
              opacity: rateViewModel.isPending ? 0.7 : 1,
            },
          ]}
          onPress={rateViewModel.handleSubmit}
          disabled={rateViewModel.isPending}
        >
          <Text style={styles.submitButtonText}>
            {rateViewModel.isPending ? "Publication…" : "Publier mon avis"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  header: {
    height: 52,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerBack: { width: 32, alignItems: "flex-start" },
  headerBackIcon: { fontSize: 20, fontWeight: "500" },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
  },
  headerSpacer: { width: 32 },

  content: { flex: 1, paddingHorizontal: 16, paddingTop: 24 },
  label: { fontSize: 15, fontWeight: "600", marginBottom: 8 },
  starsRow: { flexDirection: "row", gap: 8 },
  star: { fontSize: 32 },

  input: {
    marginTop: 8,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    minHeight: 100,
    fontSize: 14,
    textAlignVertical: "top",
  },

  submitButton: {
    marginTop: 24,
    paddingVertical: 14,
    borderRadius: 999,
    alignItems: "center",
  },
  submitButtonText: { fontSize: 15, fontWeight: "600", color: "white" },
});
