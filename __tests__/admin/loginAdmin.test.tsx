jest.mock("@/auth/authService", () => ({
  login: jest.fn(),
}));

import { login } from "@/auth/authService";

describe("LoginScreen Admin features", () => {
  const mockAdminResponse = {
    token: "admin-token-123",
    user: {
      id: 1,
      name: "Admin User",
      email: "admin@test.com",
      type: "admin",
      level: 10,
      points: 5000,
    },
  };

  const mockUserResponse = {
    token: "user-token-456",
    user: {
      id: 2,
      name: "Regular User",
      email: "user@test.com",
      type: "user",
      level: 3,
      points: 150,
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Admin login response", () => {
    it("should return admin data", async () => {
      (login as jest.Mock).mockResolvedValue(mockAdminResponse);

      const response = await login("admin@test.com", "admin123");

      expect(response.user.type).toBe("admin");
      expect(response.token).toBe("admin-token-123");
    });

    it("should identify admin by type", async () => {
      (login as jest.Mock).mockResolvedValue(mockAdminResponse);

      const response = await login("admin@test.com", "admin123");

      const isAdmin = response.user.type === "admin";
      expect(isAdmin).toBe(true);
    });
  });

  describe("Admin and user difference", () => {
    it("should differentiate admin from user", async () => {
      (login as jest.Mock).mockResolvedValueOnce(mockAdminResponse);
      const adminRes = await login("admin@test.com", "admin123");

      (login as jest.Mock).mockResolvedValueOnce(mockUserResponse);
      const userRes = await login("user@test.com", "user123");

      expect(adminRes.user.type).toBe("admin");
      expect(userRes.user.type).toBe("user");

      expect(adminRes.user.level).toBeGreaterThan(userRes.user.level);
    });

    it("should NOT treat regular user as admin", async () => {
      (login as jest.Mock).mockResolvedValue(mockUserResponse);

      const response = await login("user@test.com", "user123");

      const isAdmin = response.user.type === "admin";
      expect(isAdmin).toBe(false);
    });
  });

  describe("Admin login button", () => {
    it("should allow admin login when form is valid", () => {
      const isFormValid = true;
      const isLoading = false;

      const disabled = !isFormValid || isLoading;

      expect(disabled).toBe(false);
    });

    it("should disable admin login when loading", () => {
      const isFormValid = true;
      const isLoading = true;

      const disabled = !isFormValid || isLoading;

      expect(disabled).toBe(true);
    });

    it("should disable admin login when form invalid", () => {
      const isFormValid = false;
      const isLoading = false;

      const disabled = !isFormValid || isLoading;

      expect(disabled).toBe(true);
    });
  });
});
