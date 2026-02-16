import { getUserProfile } from "@/auth/authService";
import { useAddRestroomViewModel } from "@/features/contribute/useAddRestroomViewModel";
import { getCoordsFromAddress } from "@/utils/geocoding";
import { act, renderHook } from "@testing-library/react-native";

// --- Mocks ---

const mockReplace = jest.fn();
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
  useRouter: () => ({ replace: mockReplace, back: mockBack }),
}));

jest.mock("@/components/toast/useToast", () => ({
  useToast: () => mockToast,
}));

jest.mock("@tanstack/react-query", () => ({
  useMutation: () => ({
    mutate: mockMutate,
    isPending: false,
  }),
  useQueryClient: () => ({
    invalidateQueries: mockInvalidateQueries,
  }),
}));

jest.mock("@/functions/api", () => ({
  apiFetch: jest.fn(),
}));

jest.mock("@/auth/authService", () => ({
  getUserProfile: jest.fn(),
}));

jest.mock("@/utils/errorHandler", () => ({
  getErrorMessage: jest.fn().mockReturnValue("Erreur mock"),
}));

jest.mock("@/utils/geocoding", () => ({
  getAddressFromCoords: jest.fn(),
  getCoordsFromAddress: jest.fn(),
}));

jest.mock("expo-location", () => ({
  requestForegroundPermissionsAsync: jest.fn(),
  getCurrentPositionAsync: jest.fn(),
  Accuracy: { Balanced: 3 },
}));

const mockGetUserProfile = getUserProfile as jest.MockedFunction<
  typeof getUserProfile
>;
const mockGetCoordsFromAddress = getCoordsFromAddress as jest.MockedFunction<
  typeof getCoordsFromAddress
>;

const validUser = {
  id: 1,
  name: "Test",
  email: "test@test.com",
  createdAt: "2025-01-01T00:00:00Z",
  role: "user" as const,
  points: 0,
  level: 1,
};

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

describe("useAddRestroomViewModel", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetUserProfile.mockResolvedValue(validUser);
  });

  it("should initialize with default values", () => {
    const { result } = renderHook(() => useAddRestroomViewModel());

    expect(result.current.name).toBe("");
    expect(result.current.address).toBe("");
    expect(result.current.type).toBe("public");
    expect(result.current.accessibility).toBe("inconnue");
    expect(result.current.opening).toBe("inconnus");
    expect(result.current.isPending).toBe(false);
    expect(result.current.isLocLoading).toBe(false);
  });

  it("should update form fields", () => {
    const { result } = renderHook(() => useAddRestroomViewModel());

    act(() => {
      result.current.setName("WC Bastille");
      result.current.setAddress("Place de la Bastille");
      result.current.setType("cafe");
      result.current.setAccessibility("accessible");
      result.current.setOpening("24_7");
    });

    expect(result.current.name).toBe("WC Bastille");
    expect(result.current.address).toBe("Place de la Bastille");
    expect(result.current.type).toBe("cafe");
    expect(result.current.accessibility).toBe("accessible");
    expect(result.current.opening).toBe("24_7");
  });

  it("should call router.back on goBack", () => {
    const { result } = renderHook(() => useAddRestroomViewModel());

    act(() => {
      result.current.goBack();
    });

    expect(mockBack).toHaveBeenCalled();
  });

  // --- Validation ---

  it("should show warning when name is empty", async () => {
    const { result } = renderHook(() => useAddRestroomViewModel());

    act(() => {
      result.current.setAddress("Une adresse");
    });

    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(mockToast.warning).toHaveBeenCalledWith(
      "Merci de donner un nom (ex: WC République).",
    );
    expect(mockMutate).not.toHaveBeenCalled();
  });

  it("should show warning when address is empty", async () => {
    const { result } = renderHook(() => useAddRestroomViewModel());

    act(() => {
      result.current.setName("WC Test");
    });

    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(mockToast.warning).toHaveBeenCalledWith(
      "Merci de renseigner une adresse.",
    );
    expect(mockMutate).not.toHaveBeenCalled();
  });

  it("should show warning when geocoding fails", async () => {
    mockGetCoordsFromAddress.mockResolvedValueOnce(null);

    const { result } = renderHook(() => useAddRestroomViewModel());

    act(() => {
      result.current.setName("WC Test");
      result.current.setAddress("Adresse introuvable xyz");
    });

    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(mockGetCoordsFromAddress).toHaveBeenCalledWith(
      "Adresse introuvable xyz",
    );
    expect(mockToast.warning).toHaveBeenCalledWith(
      "Adresse introuvable. Utilise ta position GPS.",
    );
    expect(mockMutate).not.toHaveBeenCalled();
  });

  it("should show error when profile is null", async () => {
    mockGetUserProfile.mockResolvedValueOnce(null);
    mockGetCoordsFromAddress.mockResolvedValueOnce({
      latitude: 48.853,
      longitude: 2.369,
    });

    const { result } = renderHook(() => useAddRestroomViewModel());

    act(() => {
      result.current.setName("WC Test");
      result.current.setAddress("Place de la Bastille");
    });

    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(mockToast.error).toHaveBeenCalledWith(
      "Profil introuvable. Reconnecte-toi.",
    );
    expect(mockMutate).not.toHaveBeenCalled();
  });

  // --- Succès ---

  it("should call mutate with geocoded coords when no GPS", async () => {
    mockGetCoordsFromAddress.mockResolvedValueOnce({
      latitude: 48.853,
      longitude: 2.369,
    });

    const { result } = renderHook(() => useAddRestroomViewModel());

    act(() => {
      result.current.setName("WC Bastille");
      result.current.setAddress("Place de la Bastille");
      result.current.setType("public");
      result.current.setAccessibility("accessible");
      result.current.setOpening("24_7");
    });

    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(mockMutate).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "WC Bastille",
        address: "Place de la Bastille",
        latitude: 48.853,
        longitude: 2.369,
        types: ["public"],
        accessible: true,
        free: true,
        clean: true,
        opening_hours: "24/7",
        createdBy: 1,
      }),
    );
  });

  it("should map opening hours correctly", async () => {
    mockGetCoordsFromAddress.mockResolvedValue({
      latitude: 48.853,
      longitude: 2.369,
    });

    const { result } = renderHook(() => useAddRestroomViewModel());

    // Test "horaires_comm"
    act(() => {
      result.current.setName("WC Test");
      result.current.setAddress("Adresse test");
      result.current.setOpening("horaires_comm");
    });

    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(mockMutate).toHaveBeenCalledWith(
      expect.objectContaining({ opening_hours: "Horaires commerciaux" }),
    );

    jest.clearAllMocks();
    mockGetCoordsFromAddress.mockResolvedValue({
      latitude: 48.853,
      longitude: 2.369,
    });

    // Test "inconnus"
    act(() => {
      result.current.setOpening("inconnus");
    });

    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(mockMutate).toHaveBeenCalledWith(
      expect.objectContaining({ opening_hours: "Inconnus" }),
    );
  });

  it("should map type to types array correctly", async () => {
    mockGetCoordsFromAddress.mockResolvedValueOnce({
      latitude: 48.853,
      longitude: 2.369,
    });

    const { result } = renderHook(() => useAddRestroomViewModel());

    act(() => {
      result.current.setName("Café des Fleurs");
      result.current.setAddress("Rue des fleurs");
      result.current.setType("cafe");
    });

    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(mockMutate).toHaveBeenCalledWith(
      expect.objectContaining({ types: ["private"] }),
    );
  });
});
