import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  useColorScheme,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Colors } from "@/constants/Colors";
import { Shadows } from "@/constants/Shadows";
import PageHeader from "../../components/header";
import { useRouter } from "expo-router";

export default function UpdateProfileScreen() {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  const [name, setName] = useState("Jean Dupont");
  const [username, setUsername] = useState("jean.dupont");
  const [bio, setBio] = useState("Passionné par les espaces publics propres et accessibles à tous");
  const [primaryLanguage, setPrimaryLanguage] = useState("French");
  const [secondaryLanguage, setSecondaryLanguage] = useState("English");

  const router = useRouter();

  const handleBack = () => {
    router.replace("/(tabs)/profile");
  };

  const handleSave = () => {
    console.log("Saving profile:", { name, username, bio, primaryLanguage, secondaryLanguage });
  };

  const handleCancel = () => {
    router.replace("/(tabs)/profile");
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <PageHeader title="Profil" onBack={handleBack} />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.avatarSection}>
                <Image
                  source={{ uri: "https://i.pravatar.cc/150?img=12" }}
                  style={[styles.avatar, Shadows.dp4]}
                />
                <Text style={[styles.username, { color: theme.text }]}>Jean Dupont</Text>
                <Text style={[styles.subtitle, { color: theme.textMuted }]}>@JeanDupont</Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>À propos</Text>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.text }]}>Nom</Text>
            <TextInput
              style={[styles.input, { 
                borderColor: "#ccc",
                color: theme.text,
                backgroundColor: theme.background 
              }]}
              value={name}
              onChangeText={setName}
              placeholder="Entrez votre nom"
              placeholderTextColor={theme.textMuted}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.text }]}>Nom d'utilisateur</Text>
            <TextInput
              style={[styles.input, { 
                borderColor: "#ccc",
                color: theme.text,
                backgroundColor: theme.background 
              }]}
              value={username}
              onChangeText={setUsername}
              placeholder="Entrez votre nom d'utilisateur"
              placeholderTextColor={theme.textMuted}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.text }]}>Bio</Text>
            <TextInput
              style={[styles.input, styles.textArea, { 
                borderColor: "#ccc",
                color: theme.text,
                backgroundColor: theme.background 
              }]}
              value={bio}
              onChangeText={setBio}
              placeholder="Parlez-nous de vous"
              placeholderTextColor={theme.textMuted}
              multiline
              numberOfLines={3}
            />
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.cancelButton, { borderColor: "#ccc" }]}
            onPress={handleCancel}
          >
            <Text style={[styles.cancelButtonText, { color: theme.text }]}>Annuler</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.saveButton, { backgroundColor: theme.primary }]}
            onPress={handleSave}
          >
            <Text style={styles.saveButtonText}>Enregistrer</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
    
  container: {
    flex: 1,
  },
  content: {
    paddingBottom: 40,
  },
  avatarSection: {
    alignItems: "center",
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
  },
  username: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 5,
  },
  joinedText: {
    fontSize: 12,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    borderWidth: 2,
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: "top",
    paddingTop: 12,
  },
  buttonContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 15,
    marginTop: 10,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 8,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  saveButton: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    ...Shadows.dp2,
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});