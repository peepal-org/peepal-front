import { useMutation, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { apiFetch } from "@/functions/api";
import { ReportCommentDto } from "@/types/api/ApiReport";
import { useToast } from "@/components/toast/useToast";
import { getErrorMessage } from "@/utils/errorHandler";

export const useCreateReportCommentMutation = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: async (payload: ReportCommentDto) =>
      apiFetch("/comment-report", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comment-report"] });
      queryClient.invalidateQueries({ queryKey: ["myCommentReports"] });
      queryClient.invalidateQueries({ queryKey: ["allCommentReports"] });
      queryClient.invalidateQueries({ queryKey: ["adminOverview"] });

      toast.success("Rapport envoyé ✅ Merci pour ta contribution.");
      router.replace("/(tabs)/map");
    },
    onError: (err: unknown) => {
      toast.error(getErrorMessage(err, "Impossible d'envoyer le rapport."));
    },
  });
};
