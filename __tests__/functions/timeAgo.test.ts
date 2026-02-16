import { timeAgoFr } from "@/functions/formatters/timeAgo";

describe("timeAgoFr", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2025-06-15T12:00:00Z"));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("should return 'À l'instant' for < 5 seconds", () => {
    expect(timeAgoFr("2025-06-15T11:59:57Z")).toBe("À l’instant");
  });

  it("should return seconds for < 60 seconds", () => {
    expect(timeAgoFr("2025-06-15T11:59:30Z")).toBe("Il y a 30 s");
  });

  it("should return minutes for < 60 minutes", () => {
    expect(timeAgoFr("2025-06-15T11:45:00Z")).toBe("Il y a 15 min");
  });

  it("should return hours for < 24 hours", () => {
    expect(timeAgoFr("2025-06-15T09:00:00Z")).toBe("Il y a 3 h");
  });

  it("should return days for < 7 days", () => {
    expect(timeAgoFr("2025-06-12T12:00:00Z")).toBe("Il y a 3 j");
  });

  it("should return weeks for < 4 weeks", () => {
    expect(timeAgoFr("2025-06-01T12:00:00Z")).toBe("Il y a 2 semaines");
  });

  it("should return 1 semaine (singular)", () => {
    expect(timeAgoFr("2025-06-08T12:00:00Z")).toBe("Il y a 1 semaine");
  });

  it("should return months for < 12 months", () => {
    expect(timeAgoFr("2025-03-15T12:00:00Z")).toBe("Il y a 3 mois");
  });

  it("should return years", () => {
    expect(timeAgoFr("2023-06-15T12:00:00Z")).toBe("Il y a 2 ans");
  });

  it("should return 1 an (singular)", () => {
    expect(timeAgoFr("2024-06-15T12:00:00Z")).toBe("Il y a 1 an");
  });

  it("should handle Date object input", () => {
    expect(timeAgoFr(new Date("2025-06-15T11:00:00Z"))).toBe("Il y a 1 h");
  });

  it("should handle invalid date", () => {
    expect(timeAgoFr("not-a-date")).toBe("Date inconnue");
  });
});
