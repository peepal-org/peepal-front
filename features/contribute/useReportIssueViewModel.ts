import { getUserProfile } from "@/auth/authService";
import { useCreateReportMutation } from "@/hooks/reportMutation";
import { IssueKey, IssueOption } from "@/types/IssueKey";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";

const ISSUE_OPTIONS: IssueOption[] = [
  { key: "closed", label: "Fermé" },
  { key: "dirty", label: "Sale" },
  { key: "maintenance", label: "En maintenance" },
  { key: "other", label: "Autre" },
];

export function useReportIssueViewModel() {
  const { toiletId } = useLocalSearchParams();
  const router = useRouter();

  const toiletIdNum = Number(toiletId) || -1;

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
      } catch (error) {
        console.error("Erreur lors du chargement du profil:", error);
      }
    })();
  }, []);

  const handleSubmit = useCallback(() => {
    if (selected === "other" && details.trim() === "") {
      setDetailsError("Veuillez préciser le problème");
      return;
    }

    setDetailsError("");
    createReportMutation.mutate({
      userId: userId ?? -1,
      toiletId: toiletIdNum,
      type: selected,
      description: details,
    });
  }, [selected, details, userId, toiletIdNum, createReportMutation]);

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
