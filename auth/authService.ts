import { API_URL, ENV } from "@/config/env";
import { User } from "@/types/ui/User";
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

export const login = async (
  email: string, 
  password: string, 
  loginAsAdmin: boolean = false
) => {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, loginAsAdmin }),
  });

  if (!res.ok) {
    const errorData = await res
      .json()
      .catch(() => ({ message: `Erreur HTTP ${res.status}` }));
    throw new Error(
      errorData.message || `Échec de la connexion (${res.status})`,
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
  password_hash: string,
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
      errorData.message || `Échec de l'inscription (${res.status})`,
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

export const fetchUserProfile = async (): Promise<User> => {
  const token = await getToken();

  if (!token) {
    throw new Error("Vous devez être connecté pour accéder au profil");
  }

  const res = await fetch(`${API_URL}/users/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const errorData = await res
      .json()
      .catch(() => ({ message: `Erreur HTTP ${res.status}` }));
    throw new Error(
      errorData.message || `Échec de la récupération du profil (${res.status})`,
    );
  }

  const userProfile = await res.json();
  await saveUserProfile(userProfile);
  return userProfile;
};

export const updateProfile = async (updates: {
  name?: string;
  photo_url?: string | null;
}): Promise<User> => {
  const token = await getToken();

  if (!token) {
    throw new Error("Vous devez être connecté pour modifier votre profil");
  }

  const res = await fetch(`${API_URL}/users/me`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updates),
  });

  if (!res.ok) {
    const errorData = await res
      .json()
      .catch(() => ({ message: `Erreur HTTP ${res.status}` }));
    throw new Error(
      errorData.message || `Échec de la mise à jour du profil (${res.status})`,
    );
  }

  const updatedUser = await res.json();
  await saveUserProfile(updatedUser);
  return updatedUser;
};

export const uploadProfilePhoto = async (imageUri: string): Promise<string> => {
  const token = await getToken();

  if (!token) {
    throw new Error("Vous devez être connecté pour uploader une photo");
  }

  const formData = new FormData();
  const filename = imageUri.split("/").pop() || "photo.jpg";
  const match = /\.(\w+)$/.exec(filename);
  const type = match ? `image/${match[1]}` : "image/jpeg";

  formData.append("file", {
    uri: imageUri,
    name: filename,
    type: type,
  } as any);

  const res = await fetch(`${API_URL}/users/upload-photo`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res
      .json()
      .catch(() => ({ message: `Erreur HTTP ${res.status}` }));
    throw new Error(
      errorData.message || `Échec de l'upload de la photo (${res.status})`,
    );
  }

  const data = await res.json();
  return data.url;
};
