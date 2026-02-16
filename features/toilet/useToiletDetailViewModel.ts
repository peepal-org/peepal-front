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
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [address, setAddress] = useState("Chargement de l'adresse…");
  const [userProfile, setUserProfile] = useState<ApiUser | null>(null);

  const toiletIdNum = Number(id);

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

  const { data: apiToilet, isLoading } = useQuery({
    queryKey: ["toilets", toiletIdNum],
    queryFn: () => fetchToiletById(toiletIdNum),
    enabled: Number.isFinite(toiletIdNum),
  });

  const toilet: Toilet | undefined = apiToilet
    ? mapApiToilet(apiToilet)
    : undefined;

  const { data: comments = [] } = useQuery({
    queryKey: ["comments", toiletIdNum],
    queryFn: fetchComments,
    enabled: Number.isFinite(toiletIdNum),
    select: (apiComments) =>
      apiComments
        .filter((c) => c.toilet?.id === toiletIdNum)
        .map(mapApiComment),
  });

  const ratingCount = comments.length;
  const averageRating =
    ratingCount === 0
      ? null
      : comments.reduce((sum, c) => sum + c.rating, 0) / ratingCount;

  const isOpen = toilet?.isOpen ?? true;
  const hoursLabel = toilet?.openingHours ?? "Horaires inconnus";
  const accessibilityLabel = toilet?.accessible
    ? "Accessible UFR"
    : "Non accessible";

  const isAdmin = userProfile?.type === "admin";

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

  const handleUpdateStatus = useCallback(
    async (status: "accepted" | "rejected") => {
      if (!isAdmin || !toilet) return;

      try {
        await updateToilet(Number(toilet.id), { status });
        await queryClient.invalidateQueries({ queryKey: ["toilets", toiletIdNum] });
        await queryClient.invalidateQueries({ queryKey: ["toilets"] });
        await queryClient.refetchQueries({ queryKey: ["toilets", toiletIdNum] });

        Alert.alert(
          "Succès",
          status === "accepted"
            ? "Toilettes acceptées avec succès"
            : "Toilettes rejetées avec succès"
        );
      } catch (error) {
        Alert.alert("Erreur", "Une erreur s'est produite");
      }
    },
    [isAdmin, toilet, queryClient, toiletIdNum]
  );

  const handleAcceptToilet = useCallback(() => {
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
  }, [handleUpdateStatus]);

  const handleRejectToilet = useCallback(() => {
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
  }, [handleUpdateStatus]);

  const handleDeleteToilet = useCallback(() => {
    if (!isAdmin || !toilet) return;

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
              await queryClient.invalidateQueries({ queryKey: ["toilets"] });
              await queryClient.invalidateQueries({ queryKey: ["toilets", toiletIdNum] });
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
  }, [isAdmin, toilet, queryClient, router, toiletIdNum]);

  const handleDeleteComment = useCallback(
    (commentId: number) => {
      if (!isAdmin) return;

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
                await queryClient.invalidateQueries({ queryKey: ["comments", toiletIdNum] });
                await queryClient.refetchQueries({ queryKey: ["comments", toiletIdNum] });
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
    [isAdmin, queryClient, toiletIdNum]
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
    goBack,
    openInMaps,
    goToRate,
    goToReport,
    handleAcceptToilet, 
    handleRejectToilet, 
    handleDeleteToilet, 
    handleDeleteComment,
  };
}