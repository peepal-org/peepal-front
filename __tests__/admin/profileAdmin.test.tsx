jest.mock("@/auth/authService", () => ({
  getUserProfile: jest.fn(),
}));

const mockPush = jest.fn();
const mockReplace = jest.fn();
const mockSignOut = jest.fn();
const mockInvalidateQueries = jest.fn();
const mockUseQuery = jest.fn();

jest.mock("expo-router", () => ({
  useRouter: () => ({ push: mockPush, replace: mockReplace }),
  useFocusEffect: () => undefined,
}));

jest.mock("@/auth/useAuth", () => ({
  useAuth: () => ({ signOut: mockSignOut }),
}));

jest.mock("@/functions/api/admin", () => ({
  fetchAdminOverview: jest.fn(),
}));

jest.mock("@/functions/api/comments", () => ({
  fetchComments: jest.fn(),
}));

jest.mock("@/functions/api/reports", () => ({
  fetchReports: jest.fn(),
}));

jest.mock("@/functions/api/commentReports", () => ({
  fetchMyCommentReports: jest.fn(),
}));

jest.mock("@/functions/api/toilet", () => ({
  fetchToilets: jest.fn(),
}));

jest.mock("@tanstack/react-query", () => ({
  useQuery: (options: any) => mockUseQuery(options),
  useQueryClient: () => ({ invalidateQueries: mockInvalidateQueries }),
}));

jest.mock("@expo/vector-icons", () => ({
  Ionicons: () => null,
}));

import React from "react";
import { render, waitFor } from "@testing-library/react-native";
import { getUserProfile } from "@/auth/authService";
import ProfileScreen from "@/app/(tabs)/profile";

const baseUserProfile = {
  id: 1,
  name: "Test User",
  email: "user@test.com",
  createdAt: "2026-03-31T00:00:00.000Z",
  role: "user" as const,
  type: "user",
  photoUrl: null,
  bio: "bio",
  points: 42,
  level: 3,
};

function setupQueryMocks() {
  mockUseQuery.mockImplementation(({ queryKey, enabled }: any) => {
    switch (queryKey[0]) {
      case "myComments":
        return { data: enabled ? [{ id: 1 }, { id: 2 }] : [] };
      case "myReports":
        return { data: enabled ? [{ id: 1 }] : [] };
      case "myCommentReports":
        return { data: enabled ? [] : [] };
      case "myToilets":
        return { data: enabled ? [{ id: 1, status: "accepted" }] : [] };
      case "adminOverview":
        return {
          data: enabled
            ? { totals: { comments: 12, toilets: 4, reports: 3 } }
            : undefined,
        };
      default:
        return { data: [], isLoading: false };
    }
  });
}

describe("Profile admin front behavior", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setupQueryMocks();
  });

  it("shows the global admin contributions block for admin users", async () => {
    (getUserProfile as jest.Mock).mockResolvedValue({
      ...baseUserProfile,
      name: "Admin User",
      role: "admin",
      type: "admin",
    });

    const { getByText } = render(<ProfileScreen />);

    await waitFor(() => {
      expect(getByText("Admin User")).toBeTruthy();
      expect(getByText("Contributions (tous les utilisateurs)")).toBeTruthy();
    });

    const adminOverviewCalls = mockUseQuery.mock.calls.filter(
      ([options]) => options.queryKey[0] === "adminOverview",
    );

    expect(
      adminOverviewCalls.some(([options]) => options.enabled === true),
    ).toBe(true);
  });

  it("keeps the global admin contributions block hidden for regular users", async () => {
    (getUserProfile as jest.Mock).mockResolvedValue(baseUserProfile);

    const { getByText, queryByText } = render(<ProfileScreen />);

    await waitFor(() => {
      expect(getByText("Test User")).toBeTruthy();
    });

    expect(queryByText("Contributions (tous les utilisateurs)")).toBeNull();

    const adminOverviewCalls = mockUseQuery.mock.calls.filter(
      ([options]) => options.queryKey[0] === "adminOverview",
    );

    expect(
      adminOverviewCalls.every(([options]) => options.enabled === false),
    ).toBe(true);
  });
});