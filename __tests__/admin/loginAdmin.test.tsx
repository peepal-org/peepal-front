jest.mock("@/auth/authService", () => ({
  login: jest.fn(),
}));

const mockReplace = jest.fn();
const mockPush = jest.fn();
const mockRefreshAuth = jest.fn();
const mockToast = {
  error: jest.fn(),
  warning: jest.fn(),
  success: jest.fn(),
  info: jest.fn(),
};

jest.mock("expo-router", () => ({
  useRouter: () => ({ replace: mockReplace, push: mockPush }),
}));

jest.mock("@/auth/useAuth", () => ({
  useAuth: () => ({ refreshAuth: mockRefreshAuth }),
}));

jest.mock("@/components/toast/useToast", () => ({
  useToast: () => mockToast,
}));

jest.mock("@expo/vector-icons", () => ({
  Ionicons: () => null,
}));

import React from "react";
import { act, render, renderHook } from "@testing-library/react-native";
import { login } from "@/auth/authService";
import LoginScreen from "@/app/auth/login";
import { useLoginViewModel } from "@/features/auth/useLoginViewModel";

describe("Admin auth front behavior", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("submits the unified login flow for an admin account", async () => {
    (login as jest.Mock).mockResolvedValue({
      access_token: "admin-token-123",
      user: {
        id: 1,
        email: "admin@test.com",
        type: "admin",
      },
    });

    const { result } = renderHook(() => useLoginViewModel());

    act(() => {
      result.current.setEmail("admin@test.com");
      result.current.setPassword("admin123");
    });

    await act(async () => {
      await result.current.handleLogin();
    });

    expect(login).toHaveBeenCalledWith("admin@test.com", "admin123");
    expect(mockRefreshAuth).toHaveBeenCalledTimes(1);
    expect(mockReplace).toHaveBeenCalledWith("/(tabs)/map");
  });

  it("shows only the unified login button on the screen", () => {
    const { getByText, queryByText } = render(<LoginScreen />);

    expect(getByText("Se connecter")).toBeTruthy();
    expect(queryByText("Se connecter en tant qu'Admin")).toBeNull();
  });

  it("shows an error toast when the login request fails", async () => {
    (login as jest.Mock).mockRejectedValue(new Error("Identifiants invalides"));

    const { result } = renderHook(() => useLoginViewModel());

    act(() => {
      result.current.setEmail("user@test.com");
      result.current.setPassword("wrong-password");
    });

    await act(async () => {
      await result.current.handleLogin();
    });

    expect(mockToast.error).toHaveBeenCalled();
    expect(mockReplace).not.toHaveBeenCalled();
  });
});
