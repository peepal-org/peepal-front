jest.mock("@/auth/authService", () => ({
  getUserProfile: jest.fn(),
}));

const mockBack = jest.fn();
const mockPush = jest.fn();
const mockInvalidateQueries = jest.fn();
const mockUseQuery = jest.fn();
const mockRouteParams = { tab: "signalements", scope: "personal" };

jest.mock("expo-router", () => ({
  useRouter: () => ({ back: mockBack, push: mockPush }),
  useLocalSearchParams: () => mockRouteParams,
  useFocusEffect: (callback: () => void) => callback(),
}));

jest.mock("@/functions/api/admin", () => ({
  fetchAdminComments: jest.fn(),
  fetchAdminReports: jest.fn(),
  fetchAdminToilets: jest.fn(),
}));

jest.mock("@/functions/api/commentReports", () => ({
  fetchAdminCommentReports: jest.fn(),
  fetchMyCommentReports: jest.fn(),
}));

jest.mock("@/functions/api/comments", () => ({
  fetchComments: jest.fn(),
}));

jest.mock("@/functions/api/reports", () => ({
  fetchReports: jest.fn(),
}));

jest.mock("@/functions/api/toilet", () => ({
  fetchToilets: jest.fn(),
}));

jest.mock("@tanstack/react-query", () => ({
  useQuery: (options: any) => mockUseQuery(options),
  useQueryClient: () => ({ invalidateQueries: mockInvalidateQueries }),
}));

jest.mock("@expo/vector-icons", () => {
  const React = require("react");
  const { Text } = require("react-native");

  return {
    Ionicons: ({ name }: { name: string }) => <Text>{name}</Text>,
  };
});

import React from "react";
import { render, waitFor } from "@testing-library/react-native";
import { getUserProfile } from "@/auth/authService";
import ContributionsScreen from "@/app/profile/contributions";

function setupQueryMocks() {
  mockUseQuery.mockImplementation(({ queryKey }: any) => {
    switch (queryKey[0]) {
      case "myComments":
      case "myToilets":
        return { data: [] };
      case "myReports":
      case "allReports":
        return {
          data: [
            {
              id: 1,
              userId: 1,
              userName: "Alice",
              toiletId: 10,
              toiletName: "WC Bastille",
              toiletImage: null,
              type: "dirty",
              description: "Sol mouillé",
              createdAt: "2026-03-30T12:00:00.000Z",
              dateLabel: "il y a 1 j",
              targetType: "toilet",
            },
          ],
        };
      case "myCommentReports":
      case "allCommentReports":
        return {
          data: [
            {
              id: 2,
              userId: 1,
              userName: "Alice",
              toiletId: 10,
              toiletName: "WC Bastille",
              toiletImage: null,
              commentId: 3,
              type: "spam",
              description: "Commentaire inapproprié",
              createdAt: "2026-03-31T12:00:00.000Z",
              dateLabel: "il y a 2 h",
              targetType: "comment",
            },
          ],
        };
      default:
        return { data: [] };
    }
  });
}

describe("ContributionsScreen signalements", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockRouteParams.tab = "signalements";
    mockRouteParams.scope = "personal";
    setupQueryMocks();
  });

  it("shows both toilet and comment reports with distinct target icons for a regular user", async () => {
    mockRouteParams.scope = "personal";
    (getUserProfile as jest.Mock).mockResolvedValue({
      id: 1,
      name: "Alice",
      email: "alice@test.com",
      type: "user",
    });

    const { getByText } = render(<ContributionsScreen />);

    await waitFor(() => {
      expect(getByText("Signalements")).toBeTruthy();
      expect(getByText("Sol mouillé")).toBeTruthy();
    });

    expect(getByText("Commentaire inapproprié")).toBeTruthy();
    expect(getByText("water-outline")).toBeTruthy();
    expect(getByText("chatbubble-outline")).toBeTruthy();
  });

  it("shows comment reports in the admin all-users signalements view", async () => {
    mockRouteParams.scope = "all";
    (getUserProfile as jest.Mock).mockResolvedValue({
      id: 1,
      name: "Admin Alice",
      email: "admin@test.com",
      type: "admin",
    });

    const { getByText } = render(<ContributionsScreen />);

    await waitFor(() => {
      expect(getByText("Contributions (tous les utilisateurs)")).toBeTruthy();
    });

    expect(getByText("Commentaire inapproprié")).toBeTruthy();
    expect(getByText("chatbubble-outline")).toBeTruthy();
  });
});
