import { useMapScreenViewModel } from "@/features/map/useMapScreenViewModel";
import { act, renderHook } from "@testing-library/react-native";
import * as Location from "expo-location";

//  Mocks

const mockPush = jest.fn();

jest.mock("expo-router", () => ({
  useRouter: () => ({ push: mockPush }),
}));

jest.mock("react-native", () => ({
  useColorScheme: () => "light",
}));

jest.mock("@/constants/Colors", () => ({
  Colors: {
    light: { primary: "#000", text: "#000" },
    dark: { primary: "#fff", text: "#fff" },
  },
}));

const mockToilets = {
  filteredToilets: [
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
  ],
  userLocation: { latitude: 48.867, longitude: 2.363 },
  setUserLocation: jest.fn(),
  locationError: null,
  setLocationError: jest.fn(),
  isLoading: false,
  apiError: null,
  filterFree: false,
  setFilterFree: jest.fn(),
  filterAccessible: false,
  setFilterAccessible: jest.fn(),
  filterOpenNow: false,
  setFilterOpenNow: jest.fn(),
  searchQuery: "",
  setSearchQuery: jest.fn(),
  handlePressToilet: jest.fn(),
  refetchToilets: jest.fn(),
};

jest.mock("@/hooks/useToilets", () => ({
  useToilets: () => mockToilets,
}));

jest.mock("@/utils/errorHandler", () => ({
  getErrorMessage: jest.fn().mockReturnValue("Erreur mock"),
}));

jest.mock("expo-location", () => ({
  getCurrentPositionAsync: jest.fn().mockResolvedValue({
    coords: { latitude: 48.867, longitude: 2.363 },
  }),
  Accuracy: { High: 5 },
}));

jest.mock("react-native-maps", () => ({
  __esModule: true,
  default: "MapView",
}));

const mockGetPosition = Location.getCurrentPositionAsync as jest.MockedFunction<
  typeof Location.getCurrentPositionAsync
>;

//  Tests

describe("useMapScreenViewModel", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return toilets data from useToilets", () => {
    const { result } = renderHook(() => useMapScreenViewModel());

    expect(result.current.filteredToilets).toHaveLength(1);
    expect(result.current.userLocation).toEqual({
      latitude: 48.867,
      longitude: 2.363,
    });
  });

  it("should initialize showNearbyList as true", () => {
    const { result } = renderHook(() => useMapScreenViewModel());
    expect(result.current.showNearbyList).toBe(true);
  });

  it("should toggle showNearbyList", () => {
    const { result } = renderHook(() => useMapScreenViewModel());

    act(() => {
      result.current.setShowNearbyList(false);
    });

    expect(result.current.showNearbyList).toBe(false);
  });

  it("should have a FALLBACK_REGION for Paris", () => {
    const { result } = renderHook(() => useMapScreenViewModel());

    expect(result.current.FALLBACK_REGION).toEqual(
      expect.objectContaining({
        latitude: expect.any(Number),
        longitude: expect.any(Number),
      }),
    );
  });

  it("should provide a theme", () => {
    const { result } = renderHook(() => useMapScreenViewModel());
    expect(result.current.theme).toBeDefined();
  });

  //  recenterOnUser

  it("should recenter on existing userLocation", async () => {
    const { result } = renderHook(() => useMapScreenViewModel());

    await act(async () => {
      await result.current.recenterOnUser();
    });

    // userLocation exists, no need to call getCurrentPositionAsync
    expect(mockGetPosition).not.toHaveBeenCalled();
  });

  it("should fetch position when userLocation is null", async () => {
    // Temporarily set userLocation to null
    const originalLocation = mockToilets.userLocation;
    mockToilets.userLocation = null as any;

    const { result } = renderHook(() => useMapScreenViewModel());

    await act(async () => {
      await result.current.recenterOnUser();
    });

    expect(mockGetPosition).toHaveBeenCalled();
    expect(mockToilets.setUserLocation).toHaveBeenCalledWith({
      latitude: 48.867,
      longitude: 2.363,
    });

    // Restore
    mockToilets.userLocation = originalLocation;
  });

  it("should set locationError when recenter fails", async () => {
    mockToilets.userLocation = null as any;
    mockGetPosition.mockRejectedValueOnce(new Error("GPS failed"));

    const { result } = renderHook(() => useMapScreenViewModel());

    await act(async () => {
      await result.current.recenterOnUser();
    });

    expect(mockToilets.setLocationError).toHaveBeenCalledWith("Erreur mock");

    // Restore
    mockToilets.userLocation = { latitude: 48.867, longitude: 2.363 };
  });

  //  Navigation

  it("should navigate to contribute on goToContribute", () => {
    const { result } = renderHook(() => useMapScreenViewModel());

    act(() => {
      result.current.goToContribute();
    });

    expect(mockPush).toHaveBeenCalledWith("/contribute");
  });
});
