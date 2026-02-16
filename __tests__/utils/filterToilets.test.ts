import type { Toilet } from "@/types/ui/Toilet";
import { filterToilets } from "@/utils/filterToilets";

const mockToilets: Toilet[] = [
  {
    id: "1",
    name: "WC République",
    latitude: 48.867,
    longitude: 2.363,
    free: true,
    accessible: true,
    isOpen: true,
    statut: "accepted",
  },
  {
    id: "2",
    name: "Toilette Gare du Nord",
    latitude: 48.876,
    longitude: 2.359,
    free: false,
    accessible: true,
    isOpen: false,
    statut: "accepted",
  },
  {
    id: "3",
    name: "WC Bastille",
    latitude: 48.853,
    longitude: 2.369,
    free: true,
    accessible: false,
    isOpen: true,
    statut: "accepted",
  },
  {
    id: "4",
    name: "Café des Fleurs",
    latitude: 48.884,
    longitude: 2.332,
    free: false,
    accessible: false,
    isOpen: undefined,
    statut: "waiting",
  },
];

const noFilters = {
  filterFree: false,
  filterAccessible: false,
  filterOpenNow: false,
  searchQuery: "",
};

describe("filterToilets", () => {
  it("should return all toilets when no filters are active", () => {
    const result = filterToilets(mockToilets, noFilters);
    expect(result).toHaveLength(4);
  });

  it("should filter free toilets only", () => {
    const result = filterToilets(mockToilets, {
      ...noFilters,
      filterFree: true,
    });
    expect(result).toHaveLength(2);
    expect(result.every((t) => t.free)).toBe(true);
  });

  it("should filter accessible toilets only", () => {
    const result = filterToilets(mockToilets, {
      ...noFilters,
      filterAccessible: true,
    });
    expect(result).toHaveLength(2);
    expect(result.every((t) => t.accessible)).toBe(true);
  });

  it("should filter open toilets only", () => {
    const result = filterToilets(mockToilets, {
      ...noFilters,
      filterOpenNow: true,
    });
    expect(result).toHaveLength(2);
    expect(result.every((t) => t.isOpen === true)).toBe(true);
  });

  it("should combine multiple filters", () => {
    const result = filterToilets(mockToilets, {
      filterFree: true,
      filterAccessible: true,
      filterOpenNow: true,
      searchQuery: "",
    });
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("WC République");
  });

  it("should filter by search query (case insensitive)", () => {
    const result = filterToilets(mockToilets, {
      ...noFilters,
      searchQuery: "wc",
    });
    expect(result).toHaveLength(2);
    expect(result.map((t) => t.id)).toEqual(["1", "3"]);
  });

  it("should filter by search query with extra spaces", () => {
    const result = filterToilets(mockToilets, {
      ...noFilters,
      searchQuery: "  gare  ",
    });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("2");
  });

  it("should return empty array when no matches", () => {
    const result = filterToilets(mockToilets, {
      ...noFilters,
      searchQuery: "introuvable",
    });
    expect(result).toHaveLength(0);
  });

  it("should return empty array when input is empty", () => {
    const result = filterToilets([], noFilters);
    expect(result).toHaveLength(0);
  });

  it("should combine search with filters", () => {
    const result = filterToilets(mockToilets, {
      filterFree: true,
      filterAccessible: false,
      filterOpenNow: false,
      searchQuery: "bastille",
    });
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("WC Bastille");
  });
});
