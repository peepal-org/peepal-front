import { useToast } from "@/components/toast/useToast";
import { apiFetch } from "@/functions/api";
import { Report } from "@/types/api/ApiReport";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";

export const useCreateReportMutation = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: async (payload: Report) =>
      apiFetch("/reports", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reports"] });

      toast.success("Rapport envoyé ✅ Merci pour ta contribution.");
      router.replace("/(tabs)/map");
    },
    onError: (err: any) => {
      toast.error(err?.message ?? "Impossible d’envoyer le rapport.");
    },
  });
};
