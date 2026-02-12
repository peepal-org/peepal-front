import { Colors } from "@/constants/Colors";
import { useAddRestroomViewModel } from "@/features/contribute/useAddRestroomViewModel";
import { Picker } from "@react-native-picker/picker";
import React from "react";
import {
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
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const addRestRoomViewModel = useAddRestroomViewModel();

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <TouchableOpacity
          onPress={addRestRoomViewModel.goBack}
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
          value={addRestRoomViewModel.name}
          onChangeText={addRestRoomViewModel.setName}
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
          value={addRestRoomViewModel.address}
          onChangeText={addRestRoomViewModel.setAddress}
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
          onPress={addRestRoomViewModel.handleUseLocation}
          disabled={addRestRoomViewModel.isLocLoading}
        >
          <Text style={{ color: theme.primary, fontWeight: "500" }}>
            {addRestRoomViewModel.isLocLoading
              ? "Récupération de ta position…"
              : "Utiliser ma position actuelle"}
          </Text>
        </TouchableOpacity>

        {/* Type de toilettes */}
        <Text style={[styles.label, { color: theme.text, marginTop: 20 }]}>
          Type de toilettes
        </Text>
        <Picker
          selectedValue={addRestRoomViewModel.type}
          onValueChange={(value) =>
            addRestRoomViewModel.setType(value as RestroomType)
          }
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
          selectedValue={addRestRoomViewModel.accessibility}
          onValueChange={(value) =>
            addRestRoomViewModel.setAccessibility(value as Accessibility)
          }
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
          selectedValue={addRestRoomViewModel.opening}
          onValueChange={(value) =>
            addRestRoomViewModel.setOpening(value as Opening)
          }
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
          onPress={addRestRoomViewModel.handleSubmit}
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
