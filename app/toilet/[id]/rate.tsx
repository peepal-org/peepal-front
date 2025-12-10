import { Colors } from "@/constants/Colors";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
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
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.closeButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={[styles.closeIcon, { color: theme.text }]}>×</Text>
        </TouchableOpacity>

        <Text style={[styles.headerTitle, { color: theme.text }]}>
          Noter ces toilettes
        </Text>

        <View style={{ width: 32 }} />
      </View>

      <View style={styles.content}>
        {/* “Profil” utilisateur fictif */}
        <View style={styles.userRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarEmoji}>🙂</Text>
          </View>
          <Text style={[styles.userName, { color: theme.text }]}>Vous</Text>
        </View>

        {/* Étoiles */}
        <View style={styles.starsRow}>
          {Array.from({ length: 5 }).map((_, index) => {
            const starValue = index + 1;
            const filled = rating >= starValue;
            return (
              <TouchableOpacity
                key={starValue}
                onPress={() => setRating(starValue)}
                hitSlop={8}
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

        {/* Champ texte */}
        <TextInput
          multiline
          value={comment}
          onChangeText={setComment}
          placeholder="Partage ton avis : propreté, accès, sécurité…"
          placeholderTextColor={theme.textMuted}
          style={[
            styles.textArea,
            {
              backgroundColor: theme.card,
              color: theme.text,
              borderColor: theme.border,
            },
          ]}
        />

        {/* Bouton submit */}
        <TouchableOpacity
          style={[
            styles.submitButton,
            { backgroundColor: theme.primary, opacity: rating === 0 ? 0.5 : 1 },
          ]}
          disabled={rating === 0}
          onPress={() => {
            console.log("SUBMIT RATING", { id, rating, comment });
            router.back();
          }}
        >
          <Text style={[styles.submitText, { color: theme.card }]}>
            Envoyer
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
  },
  closeButton: {
    width: 32,
    alignItems: "flex-start",
  },
  closeIcon: {
    fontSize: 26,
    fontWeight: "400",
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
  },

  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 24,
  },

  userRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    gap: 12,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "rgba(0,0,0,0.05)",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarEmoji: {
    fontSize: 22,
  },
  userName: {
    fontSize: 16,
    fontWeight: "500",
  },

  starsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  star: {
    fontSize: 32,
  },

  textArea: {
    minHeight: 140,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    textAlignVertical: "top",
    fontSize: 14,
  },

  submitButton: {
    marginTop: 24,
    paddingVertical: 14,
    borderRadius: 999,
    alignItems: "center",
  },
  submitText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
