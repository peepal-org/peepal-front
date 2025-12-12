import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  useColorScheme,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Colors } from "@/constants/Colors";
import { Shadows } from "@/constants/Shadows";
import PageHeader from "../../components/header";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from 'expo-image-picker';
import { User } from "@/models/user";
import { getUserProfile } from "@/auth/authService";

export default function UpdateProfileScreen() {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const router = useRouter();

  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("Passionné par les espaces publics propres et accessibles à tous");
  const [primaryLanguage, setPrimaryLanguage] = useState("French");
  const [secondaryLanguage, setSecondaryLanguage] = useState("English");
  const [profileImage, setProfileImage] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profile = await getUserProfile();
        setUserProfile(profile);
        if (profile) {
          setName(profile.name || "");
          setProfileImage(profile.photo_url || "");
        }
      } catch (error) {
        console.error("Erreur lors du chargement du profil:", error);
        Alert.alert("Erreur", "Impossible de charger le profil");
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const handleBack = () => {
    router.replace("/(tabs)/profile");
  };

  const handleSave = () => {
    Alert.alert("Succès", "Profil mis à jour avec succès", [
      { text: "OK", onPress: () => router.replace("/(tabs)/profile") }
    ]);
  };

  const handleCancel = () => {
    router.replace("/(tabs)/profile");
  };

  const handleChangePhoto = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert(
          "Permission refusée",
          "Vous devez autoriser l'accès à la galerie pour changer votre photo de profil.",
          [{ text: "OK" }]
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        setProfileImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Erreur lors de la sélection de l'image:", error);
      Alert.alert("Erreur", "Une erreur est survenue lors de la sélection de l'image.");
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <PageHeader title="Profil" onBack={handleBack} />
        <View style={styles.loadingContainer}>
          <Text style={{ color: theme.textMuted }}>Chargement...</Text>
        </View>
      </View>
    );
  }

  if (!userProfile) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <PageHeader title="Profil" onBack={handleBack} />
        <View style={styles.loadingContainer}>
          <Text style={{ color: theme.textMuted }}>Aucun profil trouvé</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <PageHeader title="Profil" onBack={handleBack} />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.avatarSection}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: profileImage }}
              style={[styles.avatar, Shadows.dp4]}
            />
            <TouchableOpacity
              style={[styles.photoButton, { backgroundColor: theme.primary }, Shadows.dp2]}
              onPress={handleChangePhoto}
            >
              <Ionicons name="camera" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>À propos</Text>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.text }]}>Nom d'utilisateur</Text>
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

          {/* <View style={styles.inputGroup}>
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
          </View> */}

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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    paddingBottom: 40,
  },
  avatarSection: {
    alignItems: "center",
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 15,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  photoButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "white",
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