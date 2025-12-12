import { Colors } from "@/constants/Colors";
import { apiFetch } from "@/functions/api";
import { getAddressFromCoords } from "@/utils/geocoding";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type RestroomType =
  | "public"
  | "cafe"
  | "restaurant"
  | "centre_commercial"
  | "autre";
type Accessibility = "accessible" | "non_accessible" | "inconnue";
type Opening = "24_7" | "horaires_comm" | "inconnus";

export default function AddRestroomScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  const [address, setAddress] = useState("");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [isLocLoading, setIsLocLoading] = useState(false);
  const [name, setName] = useState("");
  const [type, setType] = useState<RestroomType>("public");
  const [accessibility, setAccessibility] = useState<Accessibility>("inconnue");
  const [opening, setOpening] = useState<Opening>("inconnus");
  // const [notes, setNotes] = useState("");
  // const [photoCount, setPhotoCount] = useState(0);

  const queryClient = useQueryClient();

  async function getUserId(): Promise<number> {
    const raw = await AsyncStorage.getItem("userProfile");
    if (!raw)
      throw new Error("Profil utilisateur introuvable. Reconnecte-toi.");
    const user = JSON.parse(raw);
    if (!user?.id)
      throw new Error("ID utilisateur introuvable. Reconnecte-toi.");
    return Number(user.id);
  }

  const createToiletMutation = useMutation({
    mutationFn: async (payload: any) =>
      apiFetch("/toilets", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["toilets"] });
      Alert.alert("Toilette ajoutée 🎉", "Merci pour ta contribution.", [
        { text: "OK", onPress: () => router.replace("/(tabs)/map") },
      ]);
    },
    onError: (err: any) => {
      Alert.alert(
        "Erreur",
        err?.message ?? "Impossible d’ajouter la toilette."
      );
    },
  });

  async function handleSubmit() {
    if (!name.trim()) {
      Alert.alert(
        "Nom manquant",
        "Merci de donner un nom (ex: WC République)."
      );
      return;
    }
    if (!address.trim()) {
      Alert.alert("Adresse manquante", "Merci de renseigner une adresse.");
      return;
    }
    if (latitude == null || longitude == null) {
      Alert.alert(
        "Coordonnées manquantes",
        "Utilise ta position ou renseigne des coordonnées."
      );
      return;
    }

    const userId = await getUserId();

    const opening_hours =
      opening === "24_7"
        ? "24/7"
        : opening === "horaires_comm"
        ? "Horaires commerciaux"
        : "Inconnus";

    const payload = {
      name: name.trim(),
      address: address.trim(),
      latitude,
      longitude,
      type: type === "public" ? "public" : "private",
      accessible: accessibility === "accessible",
      free: true,
      clean: true,
      opening_hours,
      createdBy: userId,
    };

    createToiletMutation.mutate(payload); // Appel à la mutation pour envoyer les données
  }

  // Utiliser la position actuelle de l'utilisateur
  async function handleUseLocation() {
    try {
      setIsLocLoading(true);

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Localisation refusée",
          "Nous avons besoin de ta localisation pour pré-remplir l’adresse."
        );
        return;
      }

      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const { latitude: lat, longitude: lon } = position.coords;
      setLatitude(lat);
      setLongitude(lon);

      const addr = await getAddressFromCoords(lat, lon);
      setAddress(addr);
    } catch (e) {
      console.log("handleUseLocation error:", e);
      Alert.alert(
        "Erreur",
        "Impossible de récupérer ta position pour le moment."
      );
    } finally {
      setIsLocLoading(false);
    }
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.headerBack}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={[styles.headerBackIcon, { color: theme.text }]}>←</Text>
        </TouchableOpacity>

        <Text style={[styles.headerTitle, { color: theme.text }]}>
          Ajouter des toilettes
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
        {/* Nom */}
        <Text style={[styles.label, { color: theme.text }]}>Nom</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Ex : WC République"
          placeholderTextColor={theme.textMuted}
          style={[
            styles.input,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
              color: theme.text,
            },
          ]}
        />

        {/* Adresse */}
        <Text style={[styles.label, { color: theme.text }]}>Adresse</Text>
        <TextInput
          value={address}
          onChangeText={setAddress}
          placeholder="Ex : 15 Rue de la Paix, Paris"
          placeholderTextColor={theme.textMuted}
          style={[
            styles.input,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
              color: theme.text,
            },
          ]}
        />

        {/* Utiliser ma position */}
        <TouchableOpacity
          style={[
            styles.locationButton,
            { borderColor: theme.border, backgroundColor: theme.card },
          ]}
          onPress={handleUseLocation}
          disabled={isLocLoading}
        >
          <Text style={{ color: theme.primary, fontWeight: "500" }}>
            {isLocLoading
              ? "Récupération de ta position…"
              : "Utiliser ma position actuelle"}
          </Text>
        </TouchableOpacity>

        {/* Type de toilettes */}
        <Text style={[styles.label, { color: theme.text, marginTop: 20 }]}>
          Type de toilettes
        </Text>
        <Picker
          selectedValue={type}
          onValueChange={(value) => setType(value as RestroomType)}
          style={[
            styles.pickerWrapper,
            { backgroundColor: theme.card, borderColor: theme.border },
          ]}
        >
          <Picker.Item label="Toilettes publiques" value="public" />
          <Picker.Item label="Café / Bar" value="cafe" />
          <Picker.Item label="Restaurant" value="restaurant" />
          <Picker.Item
            label="Centre commercial / Gare"
            value="centre_commercial"
          />
          <Picker.Item label="Autre" value="autre" />
        </Picker>

        {/* Accessibilité */}
        <Text style={[styles.label, { color: theme.text, marginTop: 20 }]}>
          Accessibilité
        </Text>
        <Picker
          selectedValue={accessibility}
          onValueChange={(value) => setAccessibility(value as Accessibility)}
          style={[
            styles.pickerWrapper,
            { backgroundColor: theme.card, borderColor: theme.border },
          ]}
        >
          <Picker.Item
            label="Accessible en fauteuil roulant"
            value="accessible"
          />
          <Picker.Item label="Non accessible" value="non_accessible" />
          <Picker.Item label="Je ne sais pas" value="inconnue" />
        </Picker>

        {/* Horaires d’ouverture */}
        <Text style={[styles.label, { color: theme.text, marginTop: 20 }]}>
          Horaires d’ouverture
        </Text>
        <Picker
          selectedValue={opening}
          onValueChange={(value) => setOpening(value as Opening)}
          style={[
            styles.pickerWrapper,
            { backgroundColor: theme.card, borderColor: theme.border },
          ]}
        >
          <Picker.Item label="Ouvert 24h/24 - 7j/7" value="24_7" />
          <Picker.Item
            label="Horaires commerciaux (ex : 8h–22h)"
            value="horaires_comm"
          />
          <Picker.Item label="Je ne sais pas" value="inconnus" />
        </Picker>

        {/* Bouton Submit */}
        <TouchableOpacity
          style={[styles.submitButton, { backgroundColor: theme.primary }]}
          onPress={handleSubmit}
        >
          <Text style={styles.submitButtonText}>Valider l’ajout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  header: {
    height: 52,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerBack: {
    width: 32,
    alignItems: "flex-start",
  },
  headerBackIcon: {
    fontSize: 20,
    fontWeight: "500",
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
  },
  headerSpacer: { width: 32 },

  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
  },

  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },

  textarea: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    minHeight: 100,
    textAlignVertical: "top",
  },

  locationButton: {
    marginTop: 8,
    alignSelf: "flex-start",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
  },

  pickerWrapper: {
    borderWidth: 1,
    borderRadius: 12,
    overflow: "hidden",
  },

  photosBox: {
    borderWidth: 1,
    borderStyle: "dashed",
    borderRadius: 16,
    padding: 14,
  },
  photosTitle: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 4,
  },
  uploadButton: {
    alignSelf: "flex-start",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 999,
    borderWidth: 1,
  },
  uploadButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },

  submitButton: {
    marginTop: 32,
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: "center",
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
