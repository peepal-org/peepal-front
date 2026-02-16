import type { Toilet } from "@/types/ui/Toilet";

export interface ToiletFilters {
  filterFree: boolean;
  filterAccessible: boolean;
  filterOpenNow: boolean;
  searchQuery: string;
}

export function filterToilets(
  toilets: Toilet[],
  filters: ToiletFilters,
): Toilet[] {
  let result = toilets;

  if (filters.filterFree) {
    result = result.filter((t) => t.free);
  }
  if (filters.filterAccessible) {
    result = result.filter((t) => t.accessible);
  }
  if (filters.filterOpenNow) {
    result = result.filter((t) => t.isOpen === true);
  }
  if (filters.searchQuery.trim().length > 0) {
    const q = filters.searchQuery.trim().toLowerCase();
    result = result.filter((t) => t.name.toLowerCase().includes(q));
  }

  return result;
}
