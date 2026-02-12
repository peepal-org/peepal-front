import { apiFetch } from "@/functions/api";
import { Report } from "@/types/api/ApiReport";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { Alert } from "react-native";

export const useCreateReportMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: Report) =>
      apiFetch("/reports", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reports"] });

      Alert.alert("Rapport envoyé ✅", "Merci pour ta contribution.", [
        { text: "OK", onPress: () => router.replace("/(tabs)/map") },
      ]);
    },
    onError: (err: any) => {
      Alert.alert("Erreur", err?.message ?? "Impossible d’envoyer le rapport.");
    },
  });
};
