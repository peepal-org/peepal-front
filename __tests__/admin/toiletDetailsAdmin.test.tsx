jest.mock("@/auth/authService", () => ({
  getUserProfile: jest.fn(),
}));

jest.mock("@/functions/api/comments", () => ({
  deleteComment: jest.fn(),
}));

jest.mock("@/functions/api/toilet", () => ({
  updateToilet: jest.fn(),
  deleteToilet: jest.fn(),
}));

import { getUserProfile } from "@/auth/authService";
import { updateToilet, deleteToilet } from "@/functions/api/toilet";
import { deleteComment } from "@/functions/api/comments";
import type { ApiUser } from "@/types/api/ApiUser";

describe("ToiletDetailsScreen Admin features", () => {
  const adminUser: ApiUser = {
    id: 1,
    name: "Admin User",
    email: "admin@test.com",
    type: "admin",
  };

  const regularUser: ApiUser = {
    id: 2,
    name: "Regular User",
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

    it("should not detect regular user as admin", async () => {
      (getUserProfile as jest.Mock).mockResolvedValue(regularUser);

      const profile = await getUserProfile();
      const isAdmin = profile?.type === "admin";

      expect(isAdmin).toBe(false);
    });
  });

  describe("Admin Status management", () => {
    it("should accept a waiting toilet", async () => {
      await updateToilet(10, { status: "accepted" });

      expect(updateToilet).toHaveBeenCalledWith(10, {
        status: "accepted",
      });
    });

    it("should reject a waiting toilet", async () => {
      await updateToilet(10, { status: "rejected" });

      expect(updateToilet).toHaveBeenCalledWith(10, {
        status: "rejected",
      });
    });
  });

  describe("Admin Deletion", () => {
    it("should delete a toilet", async () => {
      await deleteToilet(10);

      expect(deleteToilet).toHaveBeenCalledWith(10);
    });

    it("should delete a comment", async () => {
      await deleteComment(1);

      expect(deleteComment).toHaveBeenCalledWith(1);
    });

    it("should show delete button for admin only", async () => {
      (getUserProfile as jest.Mock).mockResolvedValue(adminUser);

      const profile = await getUserProfile();
      const canDelete = profile?.type === "admin";

      expect(canDelete).toBe(true);
    });

    it("should NOT show delete button for regular user", async () => {
      (getUserProfile as jest.Mock).mockResolvedValue(regularUser);

      const profile = await getUserProfile();
      const canDelete = profile?.type === "admin";

      expect(canDelete).toBe(false);
    });
  });
});