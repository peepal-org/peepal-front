const mockBack = jest.fn();
const mockPush = jest.fn();
const mockInvalidateQueries = jest.fn();
const mockSetQueryData = jest.fn();
const mockUseQuery = jest.fn();

let mockToiletData: any;
let mockCommentsData: any[];

jest.mock("@/auth/authService", () => ({
  getUserProfile: jest.fn(),
}));

jest.mock("@/functions/api/comments", () => ({
  deleteComment: jest.fn(),
  fetchComments: jest.fn(),
}));

jest.mock("@/functions/api/toilet", () => ({
  deleteToilet: jest.fn(),
  fetchToiletById: jest.fn(),
  updateToilet: jest.fn(),
}));

jest.mock("@/functions/mappers/comments", () => ({
  mapApiComment: (comment: any) => comment,
}));

jest.mock("@/functions/mappers/toilet", () => ({
  mapApiToilet: (toilet: any) => toilet,
}));

jest.mock("@/utils/geocoding", () => ({
  getAddressFromCoords: jest.fn(),
}));

jest.mock("expo-router", () => ({
  useLocalSearchParams: () => ({ id: "10", commentId: "3" }),
  useRouter: () => ({ back: mockBack, push: mockPush }),
}));

jest.mock("@react-navigation/native", () => ({
  useFocusEffect: (callback: () => void) => callback(),
}));

jest.mock("@tanstack/react-query", () => ({
  useQuery: (options: any) => mockUseQuery(options),
  useQueryClient: () => ({
    invalidateQueries: mockInvalidateQueries,
    setQueryData: mockSetQueryData,
  }),
}));

import { Alert } from "react-native";
import { act, render, renderHook, waitFor } from "@testing-library/react-native";
import { getUserProfile } from "@/auth/authService";
import { deleteComment } from "@/functions/api/comments";
import { updateToilet } from "@/functions/api/toilet";
import { getAddressFromCoords } from "@/utils/geocoding";
import ToiletDetailsScreen from "@/app/toilet/[id]";
import { useToiletDetailViewModel } from "@/features/toilet/useToiletDetailViewModel";

function setupAdminQueries() {
  mockUseQuery.mockImplementation(({ queryKey, select }: any) => {
    if (queryKey[0] === "toilets") {
      return { data: mockToiletData, isLoading: false };
    }

    if (queryKey[0] === "comments") {
      const data = select ? select(mockCommentsData) : mockCommentsData;
      return { data, isLoading: false };
    }

    return { data: undefined, isLoading: false };
  });
}

describe("useToiletDetailViewModel admin behavior", () => {
  let alertSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();

    mockToiletData = {
      id: 10,
      name: "Toilettes Hôtel de Ville",
      latitude: 48.8566,
      longitude: 2.3522,
      accessible: true,
      isOpen: true,
      openingHours: "24/7",
      status: "waiting",
      statut: "waiting",
    };

    mockCommentsData = [
      {
        id: 3,
        toilet: { id: 10 },
        content: "Très propre",
        rating: 4,
        dateLabel: "Aujourd'hui",
        user: { id: "1", name: "Admin User", photoUrl: null },
      },
    ];

    (getUserProfile as jest.Mock).mockResolvedValue({
      id: 1,
      name: "Admin User",
      email: "admin@test.com",
      type: "admin",
    });

    (getAddressFromCoords as jest.Mock).mockResolvedValue(
      "1 place de l'Hôtel de Ville, Paris",
    );

    setupAdminQueries();
    alertSpy = jest.spyOn(Alert, "alert").mockImplementation(() => undefined);
  });

  afterEach(() => {
    alertSpy.mockRestore();
  });

  it("detects admin mode from the stored profile", async () => {
    const { result } = renderHook(() => useToiletDetailViewModel());

    await waitFor(() => {
      expect(result.current.isAdmin).toBe(true);
    });

    expect(result.current.toilet?.id).toBe(10);
    expect(result.current.comments).toHaveLength(1);
    expect(result.current.averageRating).toBe(4);
  });

  it("accepts a waiting toilet after the admin confirmation", async () => {
    (updateToilet as jest.Mock).mockResolvedValue({
      id: 10,
      status: "accepted",
    });

    const { result } = renderHook(() => useToiletDetailViewModel());

    await waitFor(() => {
      expect(result.current.isAdmin).toBe(true);
    });

    act(() => {
      result.current.handleAcceptToilet();
    });

    const confirmButtons = alertSpy.mock.calls[0]?.[2] as
      | Array<{ onPress?: () => void | Promise<void> }>
      | undefined;

    await act(async () => {
      await confirmButtons?.[1]?.onPress?.();
    });

    expect(updateToilet).toHaveBeenCalledWith(10, { status: "accepted" });
    expect(mockSetQueryData).toHaveBeenCalled();
    expect(mockInvalidateQueries).toHaveBeenCalledWith({
      queryKey: ["toilets", 10],
    });
  });

  it("deletes a comment after admin confirmation", async () => {
    (deleteComment as jest.Mock).mockResolvedValue({ success: true });

    const { result } = renderHook(() => useToiletDetailViewModel());

    await waitFor(() => {
      expect(result.current.isAdmin).toBe(true);
    });

    act(() => {
      result.current.handleDeleteComment(3);
    });

    const confirmButtons = alertSpy.mock.calls[0]?.[2] as
      | Array<{ onPress?: () => void | Promise<void> }>
      | undefined;

    await act(async () => {
      await confirmButtons?.[1]?.onPress?.();
    });

    expect(deleteComment).toHaveBeenCalledWith(3);
    expect(mockInvalidateQueries).toHaveBeenCalledWith({
      queryKey: ["comments", 10],
    });
  });

  it("blocks moderation actions for a regular user", async () => {
    (getUserProfile as jest.Mock).mockResolvedValueOnce({
      id: 2,
      name: "Regular User",
      email: "user@test.com",
      type: "user",
    });

    const { result } = renderHook(() => useToiletDetailViewModel());

    await waitFor(() => {
      expect(result.current.isAdmin).toBe(false);
    });

    act(() => {
      result.current.handleAcceptToilet();
      result.current.handleRejectToilet();
      result.current.handleDeleteComment(3);
      result.current.handleDeleteToilet();
    });

    expect(alertSpy).toHaveBeenCalledTimes(4);
    expect(alertSpy).toHaveBeenCalledWith(
      "Accès refusé",
      "Cette action est réservée aux administrateurs.",
    );
    expect(deleteComment).not.toHaveBeenCalled();
  });

  it("hides the comment report button for the current user's own comment", async () => {
    const { queryByText } = render(<ToiletDetailsScreen />);

    await waitFor(() => {
      expect(queryByText("Admin User")).toBeTruthy();
    });

    expect(queryByText("Signaler")).toBeNull();
  });
});