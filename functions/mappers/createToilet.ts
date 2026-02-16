import type { CreateToiletPayload } from "@/types/api/ApiToilet";
import type { CreateToiletForm, RestroomType } from "@/types/ui/Toilet";

const mapUiTypeToApiType = (t: RestroomType): string => {
  switch (t) {
    case "public":
      return "public_bathroom";
    case "cafe":
      return "cafe";
    case "restaurant":
      return "restaurant";
    case "centre_commercial":
      return "shopping_mall";
    case "autre":
    default:
      return "unknown";
  }
};

const mapOpeningToOpeningHours = (
  opening: CreateToiletForm["opening"],
): string =>
  opening === "24_7"
    ? "24/7"
    : opening === "horaires_comm"
      ? "Horaires commerciaux"
      : "Inconnus";

export function buildCreateToiletPayload(params: {
  form: CreateToiletForm;
  userId: number;
}): CreateToiletPayload {
  const { form, userId } = params;

  if (form.latitude == null || form.longitude == null) {
    throw new Error("Coordonnées manquantes.");
  }

  return {
    name: form.name.trim(),
    external_id: `manual:${userId}:${Date.now()}`,
    address: form.address.trim(),
    latitude: form.latitude,
    longitude: form.longitude,
    types: [mapUiTypeToApiType(form.restroomType)],
    accessible: form.accessibility === "accessible",
    free: true,
    clean: true,
    opening_hours: mapOpeningToOpeningHours(form.opening),
    createdBy: userId,
  };
}
