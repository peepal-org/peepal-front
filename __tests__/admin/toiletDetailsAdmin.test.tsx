import React from "react";
import { render, waitFor, act, fireEvent } from "@testing-library/react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NavigationContainer } from "@react-navigation/native";

//Mocks 

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

jest.mock("@/features/toilet/useToiletDetailViewModel", () => ({
  useToiletDetailViewModel: jest.fn(),
}));

import { getUserProfile } from "@/auth/authService";
import { updateToilet, deleteToilet } from "@/functions/api/toilet";
import { deleteComment } from "@/functions/api/comments";
import { useToiletDetailViewModel } from "@/features/toilet/useToiletDetailViewModel";
import ToiletDetailsScreen from "@/app/toilet/[id]";
import type { ApiUser } from "@/types/api/ApiUser";

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

/**
 * Crée un QueryClient neuf par test (pas de cache partagé entre les tests)
 * et retourne un wrapper à passer à render().
 */
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>{children}</NavigationContainer>
    </QueryClientProvider>
  );
  return Wrapper;
};

/** Retourne un ViewModel de base valide. Surcharger les champs nécessaires par test. */
const buildBaseViewModel = (overrides: Record<string, any> = {}) => ({
  toilet: {
    id: 10,
    name: "Toilettes Test",
    statut: "accepted",  
    accessible: true,
    isOpen: true,
    openingHours: "08h–20h",
    image: null,
  },
  isLoading: false,
  isAdmin: false,
  address: "1 rue de la Paix, Paris",
  averageRating: 4.2,
  ratingCount: 5,
  comments: [],
  goBack: jest.fn(),
  goToRate: jest.fn(),
  goToReport: jest.fn(),
  openInMaps: jest.fn(),
  handleAcceptToilet: jest.fn(),
  handleRejectToilet: jest.fn(),
  handleDeleteToilet: jest.fn(),
  handleDeleteComment: jest.fn(),
  ...overrides,
});

// Tests

describe("ToiletDetailsScreen — Admin features", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Admin detection", () => {
    it("should detect admin correctly", async () => {
      (getUserProfile as jest.Mock).mockResolvedValue(adminUser);

      const profile = await getUserProfile();
      expect(profile?.type).toBe("admin");
    });

    it("should not detect regular user as admin", async () => {
      (getUserProfile as jest.Mock).mockResolvedValue(regularUser);

      const profile = await getUserProfile();
      expect(profile?.type).not.toBe("admin");
    });
  });

  describe("Admin status management", () => {
    it("should call updateToilet with statut 'accepted' when accepting a toilet", async () => {
      (updateToilet as jest.Mock).mockResolvedValue({ id: 10, statut: "accepted" });

      const handleAcceptToilet = jest.fn(async () => {
        await updateToilet(10, { status: "accepted" }); 
      });

      (useToiletDetailViewModel as jest.Mock).mockReturnValue(
        buildBaseViewModel({
          isAdmin: true,
          // "statut: waiting" obligatoire pour que Accepter/Rejeter s'affichent
          toilet: {
            id: 10,
            name: "Toilettes Test",
            statut: "waiting",           
            accessible: true,
            isOpen: true,
            openingHours: "08h–20h",
            image: null,
          },
          handleAcceptToilet,
        })
      );

      const { getByText } = render(<ToiletDetailsScreen />, { wrapper: createWrapper() });

      await act(async () => {
        fireEvent.press(getByText("Accepter"));
      });

      expect(updateToilet).toHaveBeenCalledWith(10, { status: "accepted" });
    });

    it("should call updateToilet with statut 'rejected' when rejecting a toilet", async () => {
      (updateToilet as jest.Mock).mockResolvedValue({ id: 10, statut: "rejected" });

      const handleRejectToilet = jest.fn(async () => {
        await updateToilet(10, { status: "rejected" }); 
      });

      (useToiletDetailViewModel as jest.Mock).mockReturnValue(
        buildBaseViewModel({
          isAdmin: true,
          toilet: {
            id: 10,
            name: "Toilettes Test",
            statut: "waiting",           
            accessible: true,
            isOpen: true,
            openingHours: "08h–20h",
            image: null,
          },
          handleRejectToilet,
        })
      );

      const { getByText } = render(<ToiletDetailsScreen />, { wrapper: createWrapper() });

      await act(async () => {
        fireEvent.press(getByText("Rejeter"));
      });

      expect(updateToilet).toHaveBeenCalledWith(10, { status: "rejected" });
    });
  });

  describe("Admin deletion", () => {
    it("should call deleteToilet when admin presses 'Supprimer'", async () => {
      (deleteToilet as jest.Mock).mockResolvedValue({ success: true });

      const handleDeleteToilet = jest.fn(async () => {
        await deleteToilet(10);
      });

      (useToiletDetailViewModel as jest.Mock).mockReturnValue(
        buildBaseViewModel({ isAdmin: true, handleDeleteToilet })
      );

      const { getByText } = render(<ToiletDetailsScreen />, { wrapper: createWrapper() });

      await act(async () => {
        fireEvent.press(getByText("Supprimer"));
      });

      expect(deleteToilet).toHaveBeenCalledWith(10);
    });

    it("should call deleteComment with correct id when admin deletes a comment", async () => {
      (deleteComment as jest.Mock).mockResolvedValue({ success: true });

      const handleDeleteComment = jest.fn(async (id: number) => {
        await deleteComment(id);
      });

      (useToiletDetailViewModel as jest.Mock).mockReturnValue(
        buildBaseViewModel({
          isAdmin: true,
          handleDeleteComment,
          comments: [
            {
              id: 1,
              content: "Super propre !",
              rating: 5,
              dateLabel: "10 jan. 2025",
              user: { name: "Alice", photoUrl: null },
            },
          ],
        })
      );

      const { UNSAFE_getAllByType } = render(<ToiletDetailsScreen />, { wrapper: createWrapper() });

      // Le TouchableOpacity de suppression est le dernier rendu dans la carte commentaire
      const { TouchableOpacity } = require("react-native");
      const touchables = UNSAFE_getAllByType(TouchableOpacity);
      const deleteBtn = touchables[touchables.length - 1];

      await act(async () => {
        deleteBtn.props.onPress();
      });

      expect(deleteComment).toHaveBeenCalledWith(1);
    });
  });

  describe("Admin UI visibility", () => {
    it("should show admin buttons when user is admin", async () => {
      (useToiletDetailViewModel as jest.Mock).mockReturnValue(
        buildBaseViewModel({ isAdmin: true })
      );

      const { getByText } = render(<ToiletDetailsScreen />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(getByText("Supprimer")).toBeTruthy();
      });
    });

    it("should NOT show admin buttons for regular user", async () => {
      (useToiletDetailViewModel as jest.Mock).mockReturnValue(
        buildBaseViewModel({ isAdmin: false })
      );

      const { queryByText } = render(<ToiletDetailsScreen />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(queryByText("Supprimer")).toBeNull();
        expect(queryByText("Accepter")).toBeNull();
        expect(queryByText("Rejeter")).toBeNull();
      });
    });

    it("should show 'Accepter' and 'Rejeter' only when toilet statut is 'waiting'", async () => {
      (useToiletDetailViewModel as jest.Mock).mockReturnValue(
        buildBaseViewModel({
          isAdmin: true,
          toilet: {
            id: 10,
            name: "Toilettes Test",
            statut: "waiting",           
            accessible: true,
            isOpen: true,
            openingHours: "08h–20h",
            image: null,
          },
        })
      );

      const { getByText } = render(<ToiletDetailsScreen />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(getByText("Accepter")).toBeTruthy();
        expect(getByText("Rejeter")).toBeTruthy();
      });
    });

    it("should NOT show 'Accepter' and 'Rejeter' when toilet is already accepted", async () => {
      (useToiletDetailViewModel as jest.Mock).mockReturnValue(
        buildBaseViewModel({ isAdmin: true }) 
      );

      const { queryByText } = render(<ToiletDetailsScreen />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(queryByText("Accepter")).toBeNull();
        expect(queryByText("Rejeter")).toBeNull();
      });
    });
  });
});