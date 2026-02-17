import { fetchComments } from "@/functions/api/comments";
import { fetchToiletById } from "@/functions/api/toilet";
import { mapApiComment } from "@/functions/mappers/comments";
import { mapApiToilet } from "@/functions/mappers/toilet";
import { Toilet } from "@/types/ui/Toilet";
import { getAddressFromCoords } from "@/utils/geocoding";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Linking, Platform } from "react-native";

export function useToiletDetailViewModel() {
  const { id  } = useLocalSearchParams();
  const { commentId } = useLocalSearchParams();

  const router = useRouter();
  const [address, setAddress] = useState("Chargement de l'adresse…");

  const toiletIdNum = Number(id);
  const commentIdNum  = Number(commentId);


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
    goBack,
    openInMaps,
    goToRate,
    goToReport,
    goToReportComment
  };
}
