import { getUserProfile } from "@/auth/authService";
import { useToast } from "@/components/toast/useToast";
import { createComment } from "@/functions/api/comments";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";

export function useRateViewModel() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const toast = useToast();

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
      toast.error(message);
    },
  });

  const isPending = createCommentMutation.isPending;

  const handleSelectRating = useCallback((value: number) => {
    setRating(value);
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!Number.isFinite(toiletIdNum)) {
      toast.error("ID toilette invalide.");
      return;
    }

    if (!rating || comment.trim().length === 0) {
      toast.warning("Merci de choisir une note et d'ajouter un commentaire");
      return;
    }

    try {
      const profile = await getUserProfile();
      if (!profile?.id) {
        toast.error("Profil introuvable. Reconnecte-toi.");
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
      toast.error(message);
    }
  }, [toiletIdNum, rating, comment, toast, createCommentMutation]);

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
