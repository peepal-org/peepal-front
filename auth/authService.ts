import { ENV } from "@/config/env";
import { API_URL } from "@/functions/api";
import { User } from "@/models/user";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const saveUserProfile = async (user: User) => {
  try {
    await AsyncStorage.setItem(ENV.USER_KEY, JSON.stringify(user));
  } catch (err) {
    console.error("Erreur lors de la sauvegarde du profil :", err);
  }
};

export const getUserProfile = async (): Promise<User | null> => {
  try {
    const storedUser = await AsyncStorage.getItem(ENV.USER_KEY);
    return storedUser ? JSON.parse(storedUser) : null;
  } catch (err) {
    console.error("Erreur lors du chargement du profil :", err);
    return null;
  }
};

export const login = async (email: string, password: string) => {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const errorData = await res
      .json()
      .catch(() => ({ message: `Erreur HTTP ${res.status}` }));
    throw new Error(
      errorData.message || `Échec de la connexion (${res.status})`
    );
  }

  const data = await res.json();
  const tokenToSave = data.access_token;
  const userProfileData: User = data.user;

  if (!tokenToSave)
    throw new Error("Jeton manquant dans la réponse du serveur.");
  if (!userProfileData)
    throw new Error("Profil utilisateur manquant dans la réponse du serveur.");

  await AsyncStorage.setItem(ENV.TOKEN_KEY, tokenToSave);
  await saveUserProfile(userProfileData);
  return data;
};

export const register = async (
  name: string,
  email: string,
  password_hash: string
) => {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password_hash }),
  });

  if (!res.ok) {
    const errorData = await res
      .json()
      .catch(() => ({ message: `Erreur HTTP ${res.status}` }));
    throw new Error(
      errorData.message || `Échec de l'inscription (${res.status})`
    );
  }

  const data = await res.json();
  const tokenToSave = data.access_token;
  const userProfileData: User = data.user;

  if (!tokenToSave) throw new Error("Jeton manquant après l'inscription.");
  if (!userProfileData)
    throw new Error("Profil utilisateur manquant dans la réponse du serveur.");

  await AsyncStorage.setItem(ENV.TOKEN_KEY, tokenToSave);
  await saveUserProfile(userProfileData);
  return data;
};

export const logout = async () => {
  await AsyncStorage.removeItem(ENV.TOKEN_KEY);
  await AsyncStorage.removeItem(ENV.USER_KEY);
};

export const getToken = async () => {
  return await AsyncStorage.getItem(ENV.TOKEN_KEY);
};
