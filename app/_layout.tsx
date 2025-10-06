import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      {/* On définit l'ordre des pages principales */}
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="toilet/[id]" options={{ title: "Fiche Toilette" }} />
    </Stack>
  );
}
