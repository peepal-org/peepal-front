import { Colors } from "@/constants/Colors";
import { useToilets } from "@/hooks/useToilets";
import { useRouter } from "expo-router";
import { useCallback } from "react";
import { useColorScheme } from "react-native";

export function useToiletListViewModel() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const toilets = useToilets();

  const goBackToMap = useCallback(() => router.back(), [router]);

  return {
    theme,
    ...toilets,
    goBackToMap,
  };
}
