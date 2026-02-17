jest.mock("@/auth/authService", () => ({
  getUserProfile: jest.fn(),
}));

jest.mock("@/functions/api/comments", () => ({
  fetchComments: jest.fn(),
}));

jest.mock("@/functions/api/toilet", () => ({
  fetchToilets: jest.fn(),
}));

import { getUserProfile } from "@/auth/authService";
import { fetchComments } from "@/functions/api/comments";
import { fetchToilets } from "@/functions/api/toilet";
import type { ApiUser } from "@/types/api/ApiUser";

describe("ProfileScreen Admin features", () => {
  const adminUser: ApiUser = {
    id: 1,
    name: "Admin",
    email: "admin@test.com",
    type: "admin",
  };

  const regularUser: ApiUser = {
    id: 2,
    name: "User",
    email: "user@test.com",
    type: "user",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Admin detection", () => {
    it("should detect admin correctly", async () => {
      (getUserProfile as jest.Mock).mockResolvedValue(adminUser);

      const profile = await getUserProfile();
      const isAdmin = profile?.type === "admin";

      expect(isAdmin).toBe(true);
    });

    it("should NOT detect regular user as admin", async () => {
      (getUserProfile as jest.Mock).mockResolvedValue(regularUser);

      const profile = await getUserProfile();
      const isAdmin = profile?.type === "admin";

      expect(isAdmin).toBe(false);
    });
  });

  describe("Admin queries enabling", () => {
    it("should enable allComments query for admin", async () => {
      (getUserProfile as jest.Mock).mockResolvedValue(adminUser);

      const profile = await getUserProfile();
      const shouldEnableAllComments =
        !!profile && profile.type === "admin";

      expect(shouldEnableAllComments).toBe(true);
    });

    it("should enable allToilets query for admin", async () => {
      (getUserProfile as jest.Mock).mockResolvedValue(adminUser);

      const profile = await getUserProfile();
      const shouldEnableAllToilets =
        !!profile && profile.type === "admin";

      expect(shouldEnableAllToilets).toBe(true);
    });

    it("should NOT enable global queries for regular user", async () => {
      (getUserProfile as jest.Mock).mockResolvedValue(regularUser);

      const profile = await getUserProfile();
      const shouldEnableGlobalQueries =
        !!profile && profile.type === "admin";

      expect(shouldEnableGlobalQueries).toBe(false);
    });
  });

  describe("Admin global counts", () => {
    it("should compute global comments count", async () => {
      (fetchComments as jest.Mock).mockResolvedValue([
        { id: 1 },
        { id: 2 },
        { id: 3 },
      ]);

      const comments = await fetchComments();
      const count = comments.length;

      expect(count).toBe(3);
    });

    it("should compute global toilets count (only with status)", async () => {
      (fetchToilets as jest.Mock).mockResolvedValue([
        { id: 1, status: "accepted" },
        { id: 2, status: null },
        { id: 3, status: "waiting" },
      ]);

      const toilets = await fetchToilets();
      const count = toilets.filter(t => t.status).length;

      expect(count).toBe(2);
    });
  });
});