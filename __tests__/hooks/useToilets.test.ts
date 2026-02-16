import { useToilets } from "@/hooks/useToilets";
import { act, renderHook } from "@testing-library/react-native";
import * as Location from "expo-location";

//  Mocks

const mockPush = jest.fn();

jest.mock("expo-router", () => ({
  useRouter: () => ({ push: mockPush }),
}));

const mockToilets = [
  {
    id: "1",
    name: "WC République",
    latitude: 48.867,
    longitude: 2.363,
    free: true,
    accessible: true,
    isOpen: true,
    statut: "accepted",
  },
  {
    id: "2",
    name: "Toilette Gare du Nord",
    latitude: 48.876,
    longitude: 2.359,
    free: false,
    accessible: true,
    isOpen: false,
    statut: "accepted",
  },
  {
    id: "3",
    name: "WC Bastille",
    latitude: 48.853,
    longitude: 2.369,
    free: true,
    accessible: false,
    isOpen: true,
    statut: "accepted",
  },
];

jest.mock("@tanstack/react-query", () => ({
  useQuery: () => ({
    data: mockToilets,
    isLoading: false,
    error: null,
    refetch: jest.fn(),
  }),
}));

jest.mock("@/functions/api", () => ({
  apiFetch: jest.fn(),
}));

jest.mock("@/functions/mappers/toilet", () => ({
  mapApiToilet: jest.fn(),
}));

jest.mock("@/utils/errorHandler", () => ({
  getErrorMessage: jest.fn().mockReturnValue("Erreur mock"),
}));

jest.mock("expo-location", () => ({
  requestForegroundPermissionsAsync: jest
    .fn()
    .mockResolvedValue({ status: "granted" }),
  getCurrentPositionAsync: jest.fn().mockResolvedValue({
    coords: { latitude: 48.867, longitude: 2.363 },
  }),
  Accuracy: { High: 5 },
}));

const mockRequestPermission =
  Location.requestForegroundPermissionsAsync as jest.MockedFunction<
    typeof Location.requestForegroundPermissionsAsync
  >;
const mockGetPosition = Location.getCurrentPositionAsync as jest.MockedFunction<
  typeof Location.getCurrentPositionAsync
>;

//  Tests

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

describe("useToilets", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockRequestPermission.mockResolvedValue({ status: "granted" } as any);
    mockGetPosition.mockResolvedValue({
      coords: { latitude: 48.867, longitude: 2.363 },
    } as any);
  });

  //  Initialisation

  it("should return toilets from useQuery", () => {
    const { result } = renderHook(() => useToilets());
    expect(result.current.filteredToilets).toHaveLength(3);
  });

  it("should initialize filters as false", () => {
    const { result } = renderHook(() => useToilets());
    expect(result.current.filterFree).toBe(false);
    expect(result.current.filterAccessible).toBe(false);
    expect(result.current.filterOpenNow).toBe(false);
    expect(result.current.searchQuery).toBe("");
  });

  //  Localisation

  it("should request location permission on mount", async () => {
    renderHook(() => useToilets());

    await act(async () => {
      await new Promise((r) => setTimeout(r, 10));
    });

    expect(mockRequestPermission).toHaveBeenCalled();
  });

  it("should set userLocation when permission granted", async () => {
    const { result } = renderHook(() => useToilets());

    await act(async () => {
      await new Promise((r) => setTimeout(r, 10));
    });

    expect(result.current.userLocation).toEqual({
      latitude: 48.867,
      longitude: 2.363,
    });
  });

  it("should set locationError when permission denied", async () => {
    mockRequestPermission.mockResolvedValueOnce({ status: "denied" } as any);

    const { result } = renderHook(() => useToilets());

    await act(async () => {
      await new Promise((r) => setTimeout(r, 10));
    });

    expect(result.current.locationError).toBe("Localisation désactivée");
    expect(result.current.userLocation).toBeNull();
  });

  it("should set locationError when getCurrentPosition fails", async () => {
    mockGetPosition.mockRejectedValueOnce(new Error("GPS timeout"));

    const { result } = renderHook(() => useToilets());

    await act(async () => {
      await new Promise((r) => setTimeout(r, 10));
    });

    expect(result.current.locationError).toBe("Erreur mock");
  });

  //  Filters

  it("should filter free toilets", () => {
    const { result } = renderHook(() => useToilets());

    act(() => {
      result.current.setFilterFree(true);
    });

    expect(result.current.filteredToilets).toHaveLength(2);
    expect(result.current.filteredToilets.every((t) => t.free)).toBe(true);
  });

  it("should filter accessible toilets", () => {
    const { result } = renderHook(() => useToilets());

    act(() => {
      result.current.setFilterAccessible(true);
    });

    expect(result.current.filteredToilets).toHaveLength(2);
    expect(result.current.filteredToilets.every((t) => t.accessible)).toBe(
      true,
    );
  });

  it("should filter open toilets", () => {
    const { result } = renderHook(() => useToilets());

    act(() => {
      result.current.setFilterOpenNow(true);
    });

    expect(result.current.filteredToilets).toHaveLength(2);
    expect(result.current.filteredToilets.every((t) => t.isOpen === true)).toBe(
      true,
    );
  });

  it("should filter by search query", () => {
    const { result } = renderHook(() => useToilets());

    act(() => {
      result.current.setSearchQuery("wc");
    });

    expect(result.current.filteredToilets).toHaveLength(2);
  });

  it("should combine multiple filters", () => {
    const { result } = renderHook(() => useToilets());

    act(() => {
      result.current.setFilterFree(true);
      result.current.setFilterAccessible(true);
    });

    expect(result.current.filteredToilets).toHaveLength(1);
    expect(result.current.filteredToilets[0].name).toBe("WC République");
  });

  //  Navigation

  it("should navigate to toilet detail on press", () => {
    const { result } = renderHook(() => useToilets());

    act(() => {
      result.current.handlePressToilet("42");
    });

    expect(mockPush).toHaveBeenCalledWith("/toilet/42");
  });

  //API Error

  it("should return null apiError when no error", () => {
    const { result } = renderHook(() => useToilets());
    expect(result.current.apiError).toBeNull();
  });
});
