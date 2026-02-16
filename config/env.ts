import Constants from "expo-constants";
import { Platform } from "react-native";

function requireEnv(name: string, value: string | undefined): string {
  if (!value) throw new Error(`Missing env var: ${name}`);
  return value;
}

export const ENV = {
  TOKEN_KEY: requireEnv("TOKEN_KEY", process.env.EXPO_PUBLIC_TOKEN_KEY),
  USER_KEY: requireEnv("USER_KEY", process.env.EXPO_PUBLIC_USER_KEY),
};

function getApiUrl(): string {
  // If there is a pro URL we use it
  const envUrl =
    Platform.OS === "android"
      ? process.env.EXPO_PUBLIC_API_URL_ANDROID
      : process.env.EXPO_PUBLIC_API_URL;

  if (envUrl && !envUrl.includes("localhost")) return envUrl;

  // Else we use Expo server IP
  const hostUri = Constants.expoConfig?.hostUri;
  if (hostUri) {
    const ip = hostUri.split(":")[0];
    return `http://${ip}:3000`;
  }

  return "http://localhost:3000";
}

export const API_URL = getApiUrl();
