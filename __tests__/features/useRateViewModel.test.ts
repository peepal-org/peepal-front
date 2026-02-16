import { getUserProfile } from "@/auth/authService";
import { useRateViewModel } from "@/features/toilet/useRateViewModel";
import { act, renderHook } from "@testing-library/react-native";
import { useLocalSearchParams } from "expo-router";

// --- Mocks ---

const mockBack = jest.fn();
const mockMutate = jest.fn();
const mockInvalidateQueries = jest.fn();
const mockToast = {
  error: jest.fn(),
  warning: jest.fn(),
  success: jest.fn(),
  info: jest.fn(),
};

jest.mock("expo-router", () => ({
  useLocalSearchParams: jest.fn().mockReturnValue({ id: "42" }),
  useRouter: () => ({ back: mockBack }),
}));

jest.mock("@/components/toast/useToast", () => ({
  useToast: () => mockToast,
}));

jest.mock("@tanstack/react-query", () => ({
  useMutation: ({ mutationFn, onSuccess, onError }: any) => ({
    mutate: mockMutate,
    isPending: false,
  }),
  useQueryClient: () => ({
    invalidateQueries: mockInvalidateQueries,
  }),
}));

jest.mock("@/functions/api/comments", () => ({
  createComment: jest.fn(),
}));

jest.mock("@/auth/authService", () => ({
  getUserProfile: jest.fn(),
}));

jest.mock("@/utils/errorHandler", () => ({
  getErrorMessage: jest.fn().mockReturnValue("Erreur mock"),
}));

const mockGetUserProfile = getUserProfile as jest.MockedFunction<
  typeof getUserProfile
>;
const mockUseLocalSearchParams = useLocalSearchParams as jest.MockedFunction<
  typeof useLocalSearchParams
>;

const validUser = {
  id: 1,
  name: "Phoenix",
  email: "phoenix@test.com",
  createdAt: "2025-01-01T00:00:00Z",
  role: "user" as const,
  points: 0,
  level: 1,
};

// --- Tests ---

describe("useRateViewModel", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetUserProfile.mockResolvedValue(validUser);
    mockUseLocalSearchParams.mockReturnValue({ id: "42" });
  });

  it("should initialize with default values", () => {
    const { result } = renderHook(() => useRateViewModel());

    expect(result.current.rating).toBe(0);
    expect(result.current.comment).toBe("");
    expect(result.current.isPending).toBe(false);
  });

  it("should update rating", () => {
    const { result } = renderHook(() => useRateViewModel());

    act(() => {
      result.current.handleSelectRating(4);
    });

    expect(result.current.rating).toBe(4);
  });

  it("should update comment", () => {
    const { result } = renderHook(() => useRateViewModel());

    act(() => {
      result.current.setComment("Super propre !");
    });

    expect(result.current.comment).toBe("Super propre !");
  });

  it("should call router.back on goBack", () => {
    const { result } = renderHook(() => useRateViewModel());

    act(() => {
      result.current.goBack();
    });

    expect(mockBack).toHaveBeenCalled();
  });

  // Validation

  it("should show error for invalid toiletId", async () => {
    mockUseLocalSearchParams.mockReturnValue({ id: "abc" });

    const { result } = renderHook(() => useRateViewModel());

    act(() => {
      result.current.handleSelectRating(4);
      result.current.setComment("Test");
    });

    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(mockToast.error).toHaveBeenCalledWith("ID toilette invalide.");
    expect(mockMutate).not.toHaveBeenCalled();
  });

  it("should show warning when rating is 0", async () => {
    const { result } = renderHook(() => useRateViewModel());

    act(() => {
      result.current.setComment("Test");
    });

    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(mockToast.warning).toHaveBeenCalledWith(
      "Merci de choisir une note et d'ajouter un commentaire",
    );
    expect(mockMutate).not.toHaveBeenCalled();
  });

  it("should show warning when comment is empty", async () => {
    const { result } = renderHook(() => useRateViewModel());

    act(() => {
      result.current.handleSelectRating(4);
    });

    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(mockToast.warning).toHaveBeenCalledWith(
      "Merci de choisir une note et d'ajouter un commentaire",
    );
    expect(mockMutate).not.toHaveBeenCalled();
  });

  it("should show error when profile is null", async () => {
    mockGetUserProfile.mockResolvedValueOnce(null);

    const { result } = renderHook(() => useRateViewModel());

    act(() => {
      result.current.handleSelectRating(4);
      result.current.setComment("Test");
    });

    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(mockToast.error).toHaveBeenCalledWith(
      "Profil introuvable. Reconnecte-toi.",
    );
    expect(mockMutate).not.toHaveBeenCalled();
  });

  //  Success

  it("should call mutate with correct payload on valid submit", async () => {
    const { result } = renderHook(() => useRateViewModel());

    act(() => {
      result.current.handleSelectRating(5);
      result.current.setComment("Excellent !");
    });

    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(mockMutate).toHaveBeenCalledWith({
      userId: 1,
      toiletId: 42,
      rating: 5,
      content: "Excellent !",
    });
  });

  it("should trim comment before sending", async () => {
    const { result } = renderHook(() => useRateViewModel());

    act(() => {
      result.current.handleSelectRating(3);
      result.current.setComment("  Correct  ");
    });

    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(mockMutate).toHaveBeenCalledWith(
      expect.objectContaining({ content: "Correct" }),
    );
  });
});
