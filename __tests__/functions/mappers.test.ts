import { mapApiComment } from "@/functions/mappers/comments";
import { mapApiToilet } from "@/functions/mappers/toilet";
import type { ApiComment } from "@/types/api/ApiComment";
import type { ApiToilet } from "@/types/api/ApiToilet";

// Mock timeAgo
jest.mock("@/functions/formatters/timeAgo", () => ({
  timeAgoFr: jest.fn().mockReturnValue("Il y a 2 h"),
}));

describe("mapApiToilet", () => {
  const baseApiToilet: ApiToilet = {
    id: 42,
    name: "WC République",
    external_id: "peepal-user",
    address: "Place de la République, Paris",
    latitude: 48.867,
    longitude: 2.363,
    types: ["public"],
    accessible: true,
    free: true,
    clean: true,
    opening_hours: "24/7",
    createdAt: "2025-01-01T00:00:00Z",
    createdBy: { id: 1 },
  };

  it("should map all fields correctly", () => {
    const result = mapApiToilet(baseApiToilet);

    expect(result.id).toBe("42");
    expect(result.name).toBe("WC République");
    expect(result.latitude).toBe(48.867);
    expect(result.longitude).toBe(2.363);
    expect(result.free).toBe(true);
    expect(result.accessible).toBe(true);
    expect(result.address).toBe("Place de la République, Paris");
    expect(result.openingHours).toBe("24/7");
  });

  it("should convert id to string", () => {
    const result = mapApiToilet(baseApiToilet);
    expect(typeof result.id).toBe("string");
  });

  it("should take first type from types array", () => {
    const result = mapApiToilet({
      ...baseApiToilet,
      types: ["private", "cafe"],
    });
    expect(result.type).toBe("private");
  });

  it("should default type to 'public' when types is empty", () => {
    const result = mapApiToilet({ ...baseApiToilet, types: [] });
    expect(result.type).toBe("public");
  });

  it("should set isOpen true for 24/7", () => {
    const result = mapApiToilet({ ...baseApiToilet, opening_hours: "24/7" });
    expect(result.isOpen).toBe(true);
  });

  it("should set isOpen undefined for unknown hours", () => {
    const result = mapApiToilet({
      ...baseApiToilet,
      opening_hours: "Inconnus",
    });
    expect(result.isOpen).toBeUndefined();
  });

  it("should set isOpen undefined for commercial hours", () => {
    const result = mapApiToilet({
      ...baseApiToilet,
      opening_hours: "Horaires commerciaux",
    });
    expect(result.isOpen).toBeUndefined();
  });

  it("should compute isOpen for time range", () => {
    const midday = new Date("2025-06-15T12:00:00");

    // We call compute is open via mapper
    const openToilet = { ...baseApiToilet, opening_hours: "08:00-20:00" };
    const closedToilet = { ...baseApiToilet, opening_hours: "14:00-20:00" };

    //  mapper use new Date() , we mock it
    jest.useFakeTimers();
    jest.setSystemTime(midday);

    expect(mapApiToilet(openToilet).isOpen).toBe(true);
    expect(mapApiToilet(closedToilet).isOpen).toBe(false);

    jest.useRealTimers();
  });

  it("should set statut to 'waiting' by default", () => {
    const result = mapApiToilet(baseApiToilet);
    expect(result.statut).toBe("waiting");
  });
});

describe("mapApiComment", () => {
  const baseApiComment: ApiComment = {
    id: 10,
    content: "Très propre, je recommande !",
    rating: 4,
    createdAt: "2025-06-15T14:30:00Z",
    user: {
      id: 5,
      name: "Test",
      email: "test@test.com",
      photo_url: "https://example.com/photo.jpg",
    },
    toilet: { id: 42 },
  };

  it("should map all fields correctly", () => {
    const result = mapApiComment(baseApiComment);

    expect(result.id).toBe("10");
    expect(result.toiletId).toBe("42");
    expect(result.rating).toBe(4);
    expect(result.content).toBe("Très propre, je recommande !");
    expect(result.createdAt).toBe("2025-06-15T14:30:00Z");
  });

  it("should convert ids to strings", () => {
    const result = mapApiComment(baseApiComment);
    expect(typeof result.id).toBe("string");
    expect(typeof result.toiletId).toBe("string");
    expect(typeof result.user.id).toBe("string");
  });

  it("should map user correctly", () => {
    const result = mapApiComment(baseApiComment);
    expect(result.user.id).toBe("5");
    expect(result.user.name).toBe("Test");
    expect(result.user.photoUrl).toBe("https://example.com/photo.jpg");
  });

  it("should handle null photo_url", () => {
    const comment = {
      ...baseApiComment,
      user: { id: 5, name: "test", email: "test@test.com", photo_url: null },
    };
    const result = mapApiComment(comment);
    expect(result.user.photoUrl).toBeNull();
  });

  it("should handle undefined photo_url", () => {
    const comment = {
      ...baseApiComment,
      user: { id: 5, name: "Phoenix" },
    };
    const result = mapApiComment(comment as ApiComment);
    expect(result.user.photoUrl).toBeNull();
  });

  it("should generate dateLabel via timeAgoFr", () => {
    const result = mapApiComment(baseApiComment);
    expect(result.dateLabel).toBe("Il y a 2 h");
  });
});
