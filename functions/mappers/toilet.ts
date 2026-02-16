import type { ApiToilet } from "@/types/api/ApiToilet";
import type { Toilet } from "@/types/ui/Toilet";
import type { Statut } from "@/types/Statut";

function parseTimeToMinutes(hhmm: string): number | null {
  const m = hhmm.trim().match(/^(\d{1,2}):(\d{2})$/);
  if (!m) return null;
  const h = Number(m[1]);
  const min = Number(m[2]);
  if (
    Number.isNaN(h) ||
    Number.isNaN(min) ||
    h < 0 ||
    h > 23 ||
    min < 0 ||
    min > 59
  )
    return null;
  return h * 60 + min;
}

function computeIsOpen(
  openingHoursRaw?: string | null,
  now = new Date(),
): boolean | undefined {
  const s = (openingHoursRaw ?? "").trim().toLowerCase();
  if (!s) return undefined;

  if (
    s.includes("24/7") ||
    s.includes("24h") ||
    s.includes("24 h") ||
    s.includes("24h/24")
  ) {
    return true;
  }

  if (s.includes("commercial") || s.includes("inconnu")) return undefined;

  const range = s.match(/(\d{1,2}:\d{2})\s*[-–]\s*(\d{1,2}:\d{2})/);
  if (!range) return undefined;

  const start = parseTimeToMinutes(range[1]);
  const end = parseTimeToMinutes(range[2]);
  if (start == null || end == null) return undefined;

  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  if (start <= end) {
    return nowMinutes >= start && nowMinutes <= end;
  }

  return nowMinutes >= start || nowMinutes <= end;
}

function mapApiStatus(status?: string | null): Statut | undefined {
  switch (status?.toLowerCase()) {
    case "accepted":
    case "approved":
      return "accepted";

    case "waiting":
    case "pending":
      return "waiting";

    case "rejected":
    case "refused":
      return "rejected";

    default:
      return undefined;
  }
}

export function mapApiToilet(api: ApiToilet): Toilet {
  return {
    id: String(api.id),
    name: api.name,
    latitude: api.latitude,
    longitude: api.longitude,
    free: api.free,
    accessible: api.accessible,
    address: api.address,
    openingHours: api.opening_hours,
    type: api.types?.[0] ?? "public",
    image: undefined,
    isOpen: computeIsOpen(api.opening_hours),
    statut: mapApiStatus(api.status) ?? "waiting",
  };
}
