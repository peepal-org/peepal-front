import { ApiError } from "@/types/errors/ApiError";

import { triggerForceLogout } from "@/auth/authEvents";
import { logout } from "@/auth/authService";
import { apiFetch } from "@/functions/api";

// Mocks
jest.mock("@/auth/authService", () => ({
  getToken: jest.fn().mockResolvedValue("fake-token"),
  logout: jest.fn().mockResolvedValue(undefined),
}));

jest.mock("@/auth/authEvents", () => ({
  triggerForceLogout: jest.fn(),
}));

jest.mock("@/config/env", () => ({
  API_URL: "http://localhost:3000",
}));

// Mock global fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

// Helper pour simuler une réponse HTTP
function mockResponse(status: number, body: unknown = {}) {
  const text = JSON.stringify(body);
  return {
    ok: status >= 200 && status < 300,
    status,
    text: jest.fn().mockResolvedValue(text),
  };
}

describe("apiFetch", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Success

  it("should return parsed JSON on success", async () => {
    mockFetch.mockResolvedValue(mockResponse(200, { id: 1, name: "WC Paris" }));

    const result = await apiFetch("/toilets/1");

    expect(result).toEqual({ id: 1, name: "WC Paris" });
  });

  it("should send Authorization header with token", async () => {
    mockFetch.mockResolvedValue(mockResponse(200, {}));

    await apiFetch("/toilets");

    expect(mockFetch).toHaveBeenCalledWith(
      "http://localhost:3000/toilets",
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "Bearer fake-token",
        }),
      }),
    );
  });

  it("should handle empty response body", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      status: 200,
      text: jest.fn().mockResolvedValue(""),
    });

    const result = await apiFetch("/toilets");

    expect(result).toBeUndefined();
  });

  // Network errors

  it("should throw ApiError with isNetworkError on fetch failure", async () => {
    mockFetch.mockRejectedValue(new TypeError("Network request failed"));

    try {
      await apiFetch("/toilets");
      fail("Should have thrown");
    } catch (err) {
      expect(err).toBeInstanceOf(ApiError);
      expect((err as ApiError).isNetworkError).toBe(true);
      expect((err as ApiError).status).toBe(0);
    }
  });

  // HTTP Errors

  it("should throw ApiError with status on HTTP error", async () => {
    mockFetch.mockResolvedValue(
      mockResponse(500, { message: "Internal Server Error" }),
    );

    try {
      await apiFetch("/toilets");
      fail("Should have thrown");
    } catch (err) {
      expect(err).toBeInstanceOf(ApiError);
      expect((err as ApiError).status).toBe(500);
      expect((err as ApiError).message).toBe("Internal Server Error");
    }
  });

  it("should handle array messages from server", async () => {
    mockFetch.mockResolvedValue(
      mockResponse(422, { message: ["Champ A requis", "Champ B invalide"] }),
    );

    try {
      await apiFetch("/toilets");
      fail("Should have thrown");
    } catch (err) {
      expect(err).toBeInstanceOf(ApiError);
      expect((err as ApiError).message).toBe(
        "Champ A requis | Champ B invalide",
      );
    }
  });

  it("should fallback to generic message when body is not JSON", async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 502,
      text: jest.fn().mockResolvedValue("Bad Gateway"),
    });

    try {
      await apiFetch("/toilets");
      fail("Should have thrown");
    } catch (err) {
      expect(err).toBeInstanceOf(ApiError);
      expect((err as ApiError).message).toBe("Erreur HTTP 502");
    }
  });

  // --- 401 : logout + force logout ---

  it("should logout and triggerForceLogout on 401", async () => {
    mockFetch.mockResolvedValue(mockResponse(401, { message: "Unauthorized" }));

    try {
      await apiFetch("/toilets");
      fail("Should have thrown");
    } catch (err) {
      expect(err).toBeInstanceOf(ApiError);
      expect((err as ApiError).status).toBe(401);
      expect((err as ApiError).message).toBe(
        "Session expirée. Reconnecte-toi.",
      );
      expect(logout).toHaveBeenCalled();
      expect(triggerForceLogout).toHaveBeenCalled();
    }
  });
});
