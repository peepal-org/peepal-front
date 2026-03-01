import { getUserProfile } from "@/auth/authService";
import { useToast } from "@/components/toast/useToast";
import { useCreateReportCommentMutation } from "@/hooks/reportCommentMutation";
import { IssueCommentKey, IssueCommentOption } from "@/types/IssueCommentKey";
import { getErrorMessage } from "@/utils/errorHandler";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";

const ISSUE_OPTIONS: IssueCommentOption[] = [
  { key: 'spam', label: 'Spam' },
  { key: 'offensive', label: 'Offensive' },
  { key: 'other', label: 'Autre' },
];

export function useReportCommentIssueViewModel() {
  const { commentId } = useLocalSearchParams();
  const router = useRouter();
  const toast = useToast();

  const commentIdNum = useMemo(() => Number(commentId), [commentId]);

  const [selected, setSelected] = useState<IssueCommentKey>("spam");
  const [details, setDetails] = useState("");
  const [detailsError, setDetailsError] = useState("");
  const [userId, setUserId] = useState<number | null>(null);

  const createReportMutation = useCreateReportCommentMutation();
  const isPending = createReportMutation.isPending;

  useEffect(() => {
    (async () => {
      try {
        const profile = await getUserProfile();
        if (profile?.id) setUserId(profile.id);
      } catch (err: unknown) {
        toast.error(getErrorMessage(err, "Impossible de charger ton profil."));
      }
    })();
  }, [toast]);

  const handleSubmit = useCallback(() => {
    if (!userId) {
      toast.error("Profil introuvable. Reconnecte-toi.");
      return;
    }

    if (selected === "other" && details.trim() === "") {
      setDetailsError("Veuillez préciser le problème");
      return;
    }

    setDetailsError("");
    createReportMutation.mutate({
      userId,
      commentId: commentIdNum,
      type: selected,
      description: details,
    });
  }, [selected, details, userId, commentIdNum, toast, createReportMutation]);

  const goBack = useCallback(() => router.back(), [router]);

  return {
    selected,
    setSelected,
    details,
    setDetails,
    detailsError,
    isPending,
    issueOptions: ISSUE_OPTIONS,
    handleSubmit,
    goBack,
  };
}
