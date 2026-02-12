import { getUserProfile } from "@/auth/authService";
import { useToast } from "@/components/toast/useToast";
import { apiFetch } from "@/functions/api";
import { CreateToiletPayload } from "@/types/api/ApiToilet";
import { getAddressFromCoords } from "@/utils/geocoding";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";

type RestroomType =
  | "public"
  | "cafe"
  | "restaurant"
  | "centre_commercial"
  | "autre";
type Accessibility = "accessible" | "non_accessible" | "inconnue";
type Opening = "24_7" | "horaires_comm" | "inconnus";

export function useAddRestroomViewModel() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const toast = useToast();

  // Form state
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [type, setType] = useState<RestroomType>("public");
  const [accessibility, setAccessibility] = useState<Accessibility>("inconnue");
  const [opening, setOpening] = useState<Opening>("inconnus");
  const [isLocLoading, setIsLocLoading] = useState(false);

  // Mutation
  const createToiletMutation = useMutation({
    mutationFn: async (payload: CreateToiletPayload) =>
      apiFetch("/toilets", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["toilets"] });
      toast.success("Toilette ajoutée 🎉 Merci pour ta contribution.");
      router.replace("/(tabs)/map");
    },
    onError: (err: unknown) => {
      const message =
        err instanceof Error
          ? err.message
          : "Impossible d'ajouter la toilette.";
      toast.error(message);
    },
  });

  const isPending = createToiletMutation.isPending;

  // Actions
  const handleSubmit = useCallback(async () => {
    if (!name.trim()) {
      toast.warning("Merci de donner un nom (ex: WC République).");
      return;
    }
    if (!address.trim()) {
      toast.warning("Merci de renseigner une adresse.");
      return;
    }
    if (latitude == null || longitude == null) {
      toast.warning("Utilise ta position ou renseigne des coordonnées.");
      return;
    }

    try {
      const profile = await getUserProfile();
      if (!profile?.id) {
        toast.error("Profil introuvable. Reconnecte-toi.");
        return;
      }

      const opening_hours =
        opening === "24_7"
          ? "24/7"
          : opening === "horaires_comm"
            ? "Horaires commerciaux"
            : "Inconnus";

      createToiletMutation.mutate({
        name: name.trim(),
        address: address.trim(),
        latitude,
        longitude,
        type: type === "public" ? "public" : "private",
        accessible: accessibility === "accessible",
        free: true,
        clean: true,
        opening_hours,
        createdBy: profile.id,
      });
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Impossible de récupérer ton profil.";
      toast.error(message);
    }
  }, [
    name,
    address,
    latitude,
    longitude,
    toast,
    opening,
    createToiletMutation,
    type,
    accessibility,
  ]);

  const handleUseLocation = useCallback(async () => {
    try {
      setIsLocLoading(true);

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        toast.warning(
          "Nous avons besoin de ta localisation pour pré-remplir l'adresse.",
        );
        return;
      }

      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const { latitude: lat, longitude: lon } = position.coords;
      setLatitude(lat);
      setLongitude(lon);

      const addr = await getAddressFromCoords(lat, lon);
      setAddress(addr);
    } catch {
      toast.error("Impossible de récupérer ta position pour le moment.");
    } finally {
      setIsLocLoading(false);
    }
  }, [toast]);

  const goBack = useCallback(() => router.back(), [router]);

  return {
    // Form
    name,
    setName,
    address,
    setAddress,
    type,
    setType,
    accessibility,
    setAccessibility,
    opening,
    setOpening,
    isLocLoading,
    isPending,

    // Actions
    handleSubmit,
    handleUseLocation,
    goBack,
  };
}
