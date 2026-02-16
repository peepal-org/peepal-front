import { getUserProfile } from "@/auth/authService";
import { useToast } from "@/components/toast/useToast";
import { useCreateReportMutation } from "@/hooks/reportMutation";
import { IssueKey, IssueOption } from "@/types/IssueKey";
import { getErrorMessage } from "@/utils/errorHandler";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";

const ISSUE_OPTIONS: IssueOption[] = [
  { key: "closed", label: "Fermé" },
  { key: "dirty", label: "Sale" },
  { key: "maintenance", label: "En maintenance" },
  { key: "other", label: "Autre" },
];

export function useReportIssueViewModel() {
  const { toiletId } = useLocalSearchParams();
  const router = useRouter();
  const toast = useToast();

  const toiletIdNum = useMemo(() => Number(toiletId), [toiletId]);

  const [selected, setSelected] = useState<IssueKey>("closed");
  const [details, setDetails] = useState("");
  const [detailsError, setDetailsError] = useState("");
  const [userId, setUserId] = useState<number | null>(null);

  const createReportMutation = useCreateReportMutation();
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

    if (!Number.isFinite(toiletIdNum) || toiletIdNum <= 0) {
      toast.error("ID toilette invalide.");
      return;
    }

    if (selected === "other" && details.trim() === "") {
      setDetailsError("Veuillez préciser le problème");
      return;
    }

    setDetailsError("");
    createReportMutation.mutate({
      userId,
      toiletId: toiletIdNum,
      type: selected,
      description: details,
    });
  }, [selected, details, userId, toiletIdNum, toast, createReportMutation]);

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
