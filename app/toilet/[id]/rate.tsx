import { Colors } from "@/constants/Colors";
import { createComment } from "@/functions/api/comments";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

async function getUserId(): Promise<number> {
  const raw = await AsyncStorage.getItem("userProfile");
  if (!raw) throw new Error("Profil utilisateur introuvable. Reconnecte-toi.");
  const user = JSON.parse(raw);
  if (!user?.id) throw new Error("ID utilisateur introuvable. Reconnecte-toi.");
  return Number(user.id);
}

export default function RateToiletScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  const toiletIdNum = useMemo(() => Number(id), [id]);

  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState("");

  const queryClient = useQueryClient();

  const createCommentMutation = useMutation({
    mutationFn: createComment,
    onSuccess: async () => {
      // La page détail utilise ["comments", toiletIdNum]
      queryClient.invalidateQueries({ queryKey: ["comments", toiletIdNum] });

      // Optionnel si ailleurs tu as encore ["comments"] (safe)
      queryClient.invalidateQueries({ queryKey: ["comments"] });

      router.back();
    },
    onError: (err: any) => {
      Alert.alert("Erreur", err?.message ?? "Impossible de publier l’avis.");
    },
  });

  function handleSelectRating(value: number) {
    setRating(value);
  }

  async function handleSubmit() {
    if (!Number.isFinite(toiletIdNum)) {
      Alert.alert("Erreur", "ID toilette invalide.");
      return;
    }

    if (!rating || comment.trim().length === 0) {
      Alert.alert(
        "Info",
        "Merci de choisir une note et d'ajouter un commentaire 🙂"
      );
      return;
    }

    try {
      const userId = await getUserId();

      createCommentMutation.mutate({
        userId,
        toiletId: toiletIdNum,
        rating,
        content: comment.trim(),
      });
    } catch (e: any) {
      Alert.alert(
        "Erreur",
        e?.message ?? "Impossible de récupérer ton profil."
      );
    }
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      {/* HEADER */}
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <TouchableOpacity
          onPress={() => router.back()}
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
            const filled = starValue <= rating;
            return (
              <TouchableOpacity
                key={starValue}
                onPress={() => handleSelectRating(starValue)}
                disabled={createCommentMutation.isPending}
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
          value={comment}
          onChangeText={setComment}
          editable={!createCommentMutation.isPending}
        />

        <TouchableOpacity
          style={[
            styles.submitButton,
            {
              backgroundColor: theme.primary,
              opacity: createCommentMutation.isPending ? 0.7 : 1,
            },
          ]}
          onPress={handleSubmit}
          disabled={createCommentMutation.isPending}
        >
          <Text style={styles.submitButtonText}>
            {createCommentMutation.isPending
              ? "Publication…"
              : "Publier mon avis"}
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
