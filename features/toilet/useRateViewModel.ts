import { getUserProfile } from "@/auth/authService";
import { createComment } from "@/functions/api/comments";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { Alert } from "react-native";

export function useRateViewModel() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const queryClient = useQueryClient();

  const toiletIdNum = useMemo(() => Number(id), [id]);

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const createCommentMutation = useMutation({
    mutationFn: createComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", toiletIdNum] });
      queryClient.invalidateQueries({ queryKey: ["comments"] });
      router.back();
    },
    onError: (err: unknown) => {
      const message =
        err instanceof Error ? err.message : "Impossible de publier l'avis.";
      Alert.alert("Erreur", message);
    },
  });

  const isPending = createCommentMutation.isPending;

  const handleSelectRating = useCallback((value: number) => {
    setRating(value);
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!Number.isFinite(toiletIdNum)) {
      Alert.alert("Erreur", "ID toilette invalide.");
      return;
    }

    if (!rating || comment.trim().length === 0) {
      Alert.alert(
        "Info",
        "Merci de choisir une note et d'ajouter un commentaire 🙂",
      );
      return;
    }

    try {
      const profile = await getUserProfile();
      if (!profile?.id) {
        Alert.alert("Erreur", "Profil introuvable. Reconnecte-toi.");
        return;
      }

      createCommentMutation.mutate({
        userId: profile.id,
        toiletId: toiletIdNum,
        rating,
        content: comment.trim(),
      });
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Impossible de récupérer ton profil.";
      Alert.alert("Erreur", message);
    }
  }, [toiletIdNum, rating, comment, createCommentMutation]);

  const goBack = useCallback(() => router.back(), [router]);

  return {
    rating,
    comment,
    setComment,
    isPending,
    handleSelectRating,
    handleSubmit,
    goBack,
  };
}
