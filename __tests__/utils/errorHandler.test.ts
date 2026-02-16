import { ApiError } from "@/types/errors/ApiError";
import { getErrorMessage } from "@/utils/errorHandler";

describe("ApiError", () => {
  it("should store message, status and isNetworkError", () => {
    const error = new ApiError("Erreur serveur", 500);
    expect(error.message).toBe("Erreur serveur");
    expect(error.status).toBe(500);
    expect(error.isNetworkError).toBe(false);
    expect(error.name).toBe("ApiError");
  });

  it("should flag network errors", () => {
    const error = new ApiError("Pas de connexion", 0, true);
    expect(error.isNetworkError).toBe(true);
    expect(error.status).toBe(0);
  });

  it("should be an instance of Error", () => {
    const error = new ApiError("test", 404);
    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(ApiError);
  });
});

describe("getErrorMessage", () => {
  it("should return network message for ApiError with isNetworkError", () => {
    const err = new ApiError("whatever", 0, true);
    expect(getErrorMessage(err)).toBe("Pas de connexion. Vérifie ton réseau.");
  });

  it("should return ApiError message for HTTP errors", () => {
    const err = new ApiError("Session expirée. Reconnecte-toi.", 401);
    expect(getErrorMessage(err)).toBe("Session expirée. Reconnecte-toi.");
  });

  it("should return message for standard Error", () => {
    const err = new Error("Something broke");
    expect(getErrorMessage(err)).toBe("Something broke");
  });

  it("should return fallback for unknown types", () => {
    expect(getErrorMessage("string error")).toBe("Une erreur est survenue.");
    expect(getErrorMessage(42)).toBe("Une erreur est survenue.");
    expect(getErrorMessage(null)).toBe("Une erreur est survenue.");
  });

  it("should return custom fallback when provided", () => {
    expect(getErrorMessage(null, "Erreur personnalisée")).toBe(
      "Erreur personnalisée",
    );
  });
});
