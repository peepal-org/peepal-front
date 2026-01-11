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
import { 
  getUserProfile, 
  fetchUserProfile, 
  updateProfile, 
  uploadProfilePhoto 
} from "@/auth/authService";
import { ActivityIndicator } from "react-native";

export default function UpdateProfileScreen() {
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

  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [newPhotoUri, setNewPhotoUri] = useState<string | null>(null);

  useEffect(() => {
      const loadProfile = async () => {
        try {
          const cachedProfile = await getUserProfile();
          if (cachedProfile) {
            setUserProfile(cachedProfile);
            setName(cachedProfile.name || "");
            setProfileImage(cachedProfile.photo_url || "");
          }

          const freshProfile = await fetchUserProfile();
          setUserProfile(freshProfile);
          setName(freshProfile.name || "");
          setProfileImage(freshProfile.photo_url || "");
        } catch (error) {
          console.error("Erreur lors du chargement du profil:", error);
          Alert.alert("Erreur", "Impossible de charger le profil.");
        } finally {
          setLoading(false);
        }
      };
      loadProfile();
    }, []);

  const handleBack = () => {
    router.replace("/(tabs)/profile");
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      const nameChanged = name !== userProfile?.name;
      const photoChanged = newPhotoUri !== null;

      if (!nameChanged && !photoChanged) {
        Alert.alert("Info", "Aucune modification détectée");
        setSaving(false);
        return;
      }

      let photoUrl = profileImage;

      if (newPhotoUri) {
        setUploadingPhoto(true);
        try {
          photoUrl = await uploadProfilePhoto(newPhotoUri);
        } catch (uploadError) {
          Alert.alert("Erreur", "Impossible d'uploader la photo.");
          setUploadingPhoto(false);
          setSaving(false);
          return;
        }
        setUploadingPhoto(false);
      }

      const updates: { name?: string; photo_url?: string } = {};
      if (nameChanged) updates.name = name;
      if (photoChanged && photoUrl) updates.photo_url = photoUrl;

      await updateProfile(updates);

      Alert.alert("Succès", "Profil mis à jour avec succès", [
        { text: "OK", onPress: () => router.replace("/(tabs)/profile") }
      ]);
    } catch (error: any) {
      Alert.alert("Erreur", error.message || "Impossible de mettre à jour le profil");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    router.replace("/(tabs)/profile");
  };

  const handleChangePhoto = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert("Permission refusée", "Vous devez autoriser l'accès à la galerie.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        const selectedUri = result.assets[0].uri;
        setProfileImage(selectedUri);
        setNewPhotoUri(selectedUri);
      }
    } catch (error) {
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
            style={[
              styles.saveButton, 
              { backgroundColor: theme.primary },
              saving && { opacity: 0.6 }
            ]}
            onPress={handleSave}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text style={styles.saveButtonText}>Enregistrer</Text>
            )}
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