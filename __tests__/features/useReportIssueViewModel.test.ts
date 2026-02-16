import { getUserProfile } from "@/auth/authService";
import { useReportIssueViewModel } from "@/features/contribute/useReportIssueViewModel";
import { act, renderHook } from "@testing-library/react-native";
import { useLocalSearchParams } from "expo-router";

// --- Mocks ---

const mockBack = jest.fn();
const mockMutate = jest.fn();
const mockToast = {
  error: jest.fn(),
  warning: jest.fn(),
  success: jest.fn(),
  info: jest.fn(),
};

jest.mock("expo-router", () => ({
  useLocalSearchParams: jest.fn().mockReturnValue({ toiletId: "42" }),
  useRouter: () => ({ back: mockBack }),
}));

jest.mock("@/components/toast/useToast", () => ({
  useToast: () => mockToast,
}));

jest.mock("@/hooks/reportMutation", () => ({
  useCreateReportMutation: () => ({
    mutate: mockMutate,
    isPending: false,
  }),
}));

jest.mock("@/auth/authService", () => ({
  getUserProfile: jest.fn().mockResolvedValue({ id: 1, name: "Phoenix" }),
}));

jest.mock("@/utils/errorHandler", () => ({
  getErrorMessage: jest.fn().mockReturnValue("Erreur mock"),
}));

// Typed mocks
const mockGetUserProfile = getUserProfile as jest.MockedFunction<
  typeof getUserProfile
>;
const mockUseLocalSearchParams = useLocalSearchParams as jest.MockedFunction<
  typeof useLocalSearchParams
>;

const originalConsoleError = console.error;

beforeAll(() => {
  console.error = (...args: any[]) => {
    if (typeof args[0] === "string" && args[0].includes("not wrapped in act"))
      return;
    originalConsoleError(...args);
  };
});

afterAll(() => {
  console.error = originalConsoleError;
});

describe("useReportIssueViewModel", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetUserProfile.mockResolvedValue({
      id: 1,
      name: "Test",
      email: "test@test.com",
      createdAt: "2025-01-01T00:00:00Z",
      role: "user",
      points: 0,
      level: 1,
    });
    mockUseLocalSearchParams.mockReturnValue({ toiletId: "42" });
  });

  it("should initialize with default values", () => {
    const { result } = renderHook(() => useReportIssueViewModel());

    expect(result.current.selected).toBe("closed");
    expect(result.current.details).toBe("");
    expect(result.current.detailsError).toBe("");
    expect(result.current.isPending).toBe(false);
    expect(result.current.issueOptions).toHaveLength(4);
  });

  it("should update selected issue type", () => {
    const { result } = renderHook(() => useReportIssueViewModel());

    act(() => {
      result.current.setSelected("dirty");
    });

    expect(result.current.selected).toBe("dirty");
  });

  it("should update details text", () => {
    const { result } = renderHook(() => useReportIssueViewModel());

    act(() => {
      result.current.setDetails("Très sale");
    });

    expect(result.current.details).toBe("Très sale");
  });

  it("should call router.back on goBack", () => {
    const { result } = renderHook(() => useReportIssueViewModel());

    act(() => {
      result.current.goBack();
    });

    expect(mockBack).toHaveBeenCalled();
  });

  // Validation

  it("should show error when userId is null", async () => {
    mockGetUserProfile.mockResolvedValueOnce(null);

    const { result } = renderHook(() => useReportIssueViewModel());

    await act(async () => {
      await new Promise((r) => setTimeout(r, 10));
    });

    await act(async () => {
      result.current.handleSubmit();
    });

    expect(mockToast.error).toHaveBeenCalledWith(
      "Profil introuvable. Reconnecte-toi.",
    );
    expect(mockMutate).not.toHaveBeenCalled();
  });

  it("should show error for invalid toiletId", async () => {
    mockUseLocalSearchParams.mockReturnValue({ toiletId: "abc" });

    const { result } = renderHook(() => useReportIssueViewModel());

    await act(async () => {
      await new Promise((r) => setTimeout(r, 10));
    });

    await act(async () => {
      result.current.handleSubmit();
    });

    expect(mockToast.error).toHaveBeenCalledWith("ID toilette invalide.");
    expect(mockMutate).not.toHaveBeenCalled();
  });

  it("should show detailsError when 'other' selected without details", async () => {
    const { result } = renderHook(() => useReportIssueViewModel());

    await act(async () => {
      await new Promise((r) => setTimeout(r, 10));
    });

    act(() => {
      result.current.setSelected("other");
    });

    await act(async () => {
      result.current.handleSubmit();
    });

    expect(result.current.detailsError).toBe("Veuillez préciser le problème");
    expect(mockMutate).not.toHaveBeenCalled();
  });

  // Success

  it("should call mutate with correct payload on valid submit", async () => {
    const { result } = renderHook(() => useReportIssueViewModel());

    await act(async () => {
      await new Promise((r) => setTimeout(r, 10));
    });

    act(() => {
      result.current.setSelected("dirty");
      result.current.setDetails("Très sale");
    });

    await act(async () => {
      result.current.handleSubmit();
    });

    expect(mockMutate).toHaveBeenCalledWith({
      userId: 1,
      toiletId: 42,
      type: "dirty",
      description: "Très sale",
    });
  });

  it("should clear detailsError on valid submit", async () => {
    const { result } = renderHook(() => useReportIssueViewModel());

    await act(async () => {
      await new Promise((r) => setTimeout(r, 10));
    });

    act(() => {
      result.current.setSelected("other");
    });

    await act(async () => {
      result.current.handleSubmit();
    });

    expect(result.current.detailsError).toBe("Veuillez préciser le problème");

    act(() => {
      result.current.setDetails("Problème spécifique");
    });

    await act(async () => {
      result.current.handleSubmit();
    });

    expect(result.current.detailsError).toBe("");
    expect(mockMutate).toHaveBeenCalled();
  });
});
