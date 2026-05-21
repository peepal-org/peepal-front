import { getUserProfile } from "@/auth/authService";
import { deleteComment, fetchComments } from "@/functions/api/comments";
import { deleteToilet, fetchToiletById, updateToilet } from "@/functions/api/toilet";
import { mapApiComment } from "@/functions/mappers/comments";
import { mapApiToilet } from "@/functions/mappers/toilet";
import { ApiUser } from "@/types/api/ApiUser";
import { Toilet } from "@/types/ui/Toilet";
import { getAddressFromCoords } from "@/utils/geocoding";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Alert, Linking, Platform } from "react-native";

export function useToiletDetailViewModel() {
  const { id  } = useLocalSearchParams();
  const { commentId } = useLocalSearchParams();

  const router = useRouter();
  const queryClient = useQueryClient();
  const [address, setAddress] = useState("Chargement de l'adresse…");
  const [userProfile, setUserProfile] = useState<ApiUser | null>(null);

  const toiletIdNum = Number(id);

  const commentIdNum  = Number(commentId);

  // 🎯 Charger le profil utilisateur
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profile = await getUserProfile();
        setUserProfile(profile);
      } catch (error) {
        console.error("Erreur chargement profil:", error);
      }
    };
    loadProfile();
  }, []);

  


  // Fetch toilet
  const { data: apiToilet, isLoading } = useQuery({
    queryKey: ["toilets", toiletIdNum],
    queryFn: () => fetchToiletById(toiletIdNum),
    enabled: Number.isFinite(toiletIdNum),
  });

  const toilet: Toilet | undefined = apiToilet
    ? mapApiToilet(apiToilet)
    : undefined;

  // Fetch comments
  const { data: comments = [] } = useQuery({
    queryKey: ["comments", toiletIdNum],
    queryFn: fetchComments,
    enabled: Number.isFinite(toiletIdNum),
    select: (apiComments) =>
      apiComments
        .filter((c) => c.toilet?.id === toiletIdNum)
        .map(mapApiComment),
  });

  // Rating
  const ratingCount = comments.length;
  const averageRating =
    ratingCount === 0
      ? null
      : comments.reduce((sum, c) => sum + c.rating, 0) / ratingCount;

  // Derived
  const isOpen = toilet?.isOpen ?? true;
  const hoursLabel = toilet?.openingHours ?? "Horaires inconnus";
  const accessibilityLabel = toilet?.accessible
    ? "Accessible UFR"
    : "Non accessible";

  // 🎯 Admin check
  const isAdmin = userProfile?.type === "admin" || userProfile?.type === "superadmin";
  const currentUserId = userProfile?.id != null ? String(userProfile.id) : null;

  const showAdminAccessDenied = useCallback(() => {
    Alert.alert(
      "Accès refusé",
      "Cette action est réservée aux administrateurs.",
    );
  }, []);

  const canReportComment = useCallback(
    (commentUserId?: string | number | null) => {
      if (commentUserId == null || currentUserId == null) return true;
      return String(commentUserId) !== currentUserId;
    },
    [currentUserId],
  );

  // Reverse geocoding
  useEffect(() => {
    const lat = toilet?.latitude;
    const lon = toilet?.longitude;
    if (lat == null || lon == null) return;

    let cancelled = false;

    (async () => {
      try {
        const addr = await getAddressFromCoords(lat, lon);
        if (!cancelled) setAddress(addr);
      } catch {
        if (!cancelled) setAddress("Adresse indisponible");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [toilet?.latitude, toilet?.longitude]);

  // Actions
  const goBack = useCallback(() => router.back(), [router]);

  const openInMaps = useCallback(() => {
    if (!toilet) return;
    const lat = toilet.latitude;
    const lon = toilet.longitude;
    const label = encodeURIComponent(toilet.name);

    if (Platform.OS === "ios") {
      Linking.openURL(`http://maps.apple.com/?ll=${lat},${lon}&q=${label}`);
      return;
    }
    Linking.openURL(`geo:${lat},${lon}?q=${lat},${lon}(${label})`);
  }, [toilet]);

  const goToRate = useCallback(() => {
    if (toilet) router.push(`/toilet/${toilet.id}/rate`);
  }, [router, toilet]);

  const goToReport = useCallback(() => {
    router.push({
      pathname: "/contribute/report-issue",
      params: { toiletId: toiletIdNum },
    });
  }, [router, toiletIdNum]);

  const goToReportComment = useCallback(
    (commentId: number) => {
      router.push({
        pathname: "/contribute/report-comment",
        params: { commentId },
      });
    },
    [router]
  );

 const handleUpdateStatus = useCallback(
  async (status: "accepted" | "rejected") => {
    if (!isAdmin) {
      showAdminAccessDenied();
      return;
    }

    if (!toilet) return;

    try {

      queryClient.setQueryData(["toilets", toiletIdNum], (oldData: any) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          status: status,
          statut: status,
        };
      });

      await updateToilet(Number(toilet.id), { status });
      
      await queryClient.invalidateQueries({ queryKey: ["toilets", toiletIdNum] });

      Alert.alert(
        "Succès",
        status === "accepted"
          ? "Toilettes acceptées avec succès"
          : "Toilettes rejetées avec succès"
      );

    } catch (error) {
      await queryClient.invalidateQueries({ queryKey: ["toilets", toiletIdNum] });
      Alert.alert("Erreur", "Une erreur s'est produite");
    }
  },
  [isAdmin, toilet, queryClient, toiletIdNum, showAdminAccessDenied]
);

  const handleAcceptToilet = useCallback(() => {
    if (!isAdmin) {
      showAdminAccessDenied();
      return;
    }

    Alert.alert(
      "Accepter les toilettes",
      "Voulez-vous vraiment accepter ces toilettes ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Accepter",
          onPress: () => handleUpdateStatus("accepted"),
        },
      ]
    );
  }, [handleUpdateStatus, isAdmin, showAdminAccessDenied]);

  const handleRejectToilet = useCallback(() => {
    if (!isAdmin) {
      showAdminAccessDenied();
      return;
    }

    Alert.alert(
      "Rejeter les toilettes",
      "Voulez-vous vraiment rejeter ces toilettes ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Rejeter",
          style: "destructive",
          onPress: () => handleUpdateStatus("rejected"),
        },
      ]
    );
  }, [handleUpdateStatus, isAdmin, showAdminAccessDenied]);

  const handleDeleteToilet = useCallback(() => {
    if (!isAdmin) {
      showAdminAccessDenied();
      return;
    }

    if (!toilet) return;

    Alert.alert(
      "Supprimer les toilettes",
      "Voulez-vous vraiment supprimer ces toilettes ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteToilet(Number(toilet.id));
              queryClient.invalidateQueries({ queryKey: ["toilets"] });
              Alert.alert("Succès", "Toilettes supprimées avec succès");
              router.back();
            } catch (error) {
              Alert.alert(
                "Erreur",
                "Une erreur s'est produite lors de la suppression"
              );
            }
          },
        },
      ]
    );
  }, [isAdmin, toilet, queryClient, router, showAdminAccessDenied]);

  const handleDeleteComment = useCallback(
    (commentId: number) => {
      if (!isAdmin) {
        showAdminAccessDenied();
        return;
      }

      Alert.alert(
        "Supprimer le commentaire",
        "Voulez-vous vraiment supprimer ce commentaire ?",
        [
          { text: "Annuler", style: "cancel" },
          {
            text: "Supprimer",
            style: "destructive",
            onPress: async () => {
              try {
                await deleteComment(commentId);
                queryClient.invalidateQueries({
                  queryKey: ["comments", toiletIdNum],
                });
                Alert.alert("Succès", "Commentaire supprimé avec succès");
              } catch (error) {
                Alert.alert(
                  "Erreur",
                  "Une erreur s'est produite lors de la suppression"
                );
              }
            },
          },
        ]
      );
    },
    [isAdmin, queryClient, toiletIdNum, showAdminAccessDenied]
  );

  return {
    toilet,
    isLoading,
    address,
    comments,
    ratingCount,
    averageRating,
    isOpen,
    hoursLabel,
    accessibilityLabel,
    isAdmin,
    currentUserId,
    canReportComment,
    goBack,
    openInMaps,
    goToRate,
    goToReport,
    goToReportComment,
    handleAcceptToilet, 
    handleRejectToilet, 
    handleDeleteToilet, 
    handleDeleteComment, 
  };
}

async function fetchToiletDetails(toiletId: string) {
  const response = await fetch(`/api/toilets/${toiletId}`);
  return response.json();
}