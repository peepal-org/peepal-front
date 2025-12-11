import React, { useState, useEffect } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
  Dimensions,
} from "react-native";
import { Colors } from "@/constants/Colors";
import { Shadows } from "@/constants/Shadows";
import { User } from "@/models/user";
import { getUserProfile, logout } from "@/auth/authService";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;

const scale = (size: number) => (width / guidelineBaseWidth) * size;
const verticalScale = (size: number) => (height / guidelineBaseHeight) * size;

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const router = useRouter();
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profile = await getUserProfile();
        setUserProfile(profile);
      } catch (error) {
        console.error("Erreur lors du chargement du profil:", error);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      setUserProfile(null);
      router.replace("/login");
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.loadingContainer}>
          <Text style={{ color: theme.textMuted }}>Chargement...</Text>
        </View>
      </View>
    );
  }

  if (!userProfile) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.loadingContainer}>
          <Text style={{ color: theme.textMuted }}>Aucun profil trouvé</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.headerBar}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Profile</Text>
      </View>

      <View style={styles.profileSection}>
        <View style={styles.header}>
          <Image
            source={{ uri: userProfile.photo_url }}
            style={[styles.avatar, Shadows.dp4]}
          />
          <Text style={[styles.username, { color: theme.text }]}>
            {userProfile.name}
          </Text>
          <Text style={[styles.subtitle, { color: theme.textMuted }]}>
            Explorateur urbain 🚀
          </Text>
          <Text style={[styles.bio, { color: theme.textMuted }]}>
            Passionné par les espaces publics propres et accessibles à tous
          </Text>
        </View>
        
        <TouchableOpacity 
          style={styles.editButton}
          onPress={() => router.push("/profile/updateProfile")}
        >
          <Ionicons name="create-outline" size={24} color={theme.text} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: verticalScale(60) }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.stats}>
          {[
            { number: 12, label: "Commentaires" },
            { number: 5, label: "Signalements" },
            { number: 3, label: "Badges" },
          ].map((stat, index) => (
            <View key={index} style={styles.statBox}>
              <Text style={[styles.statNumber, { color: theme.primary }]}>
                {stat.number}
              </Text>
              <Text style={[styles.statLabel, { color: theme.textMuted }]}>
                {stat.label}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Contributions</Text>
          <TouchableOpacity
            style={[styles.listItem, { backgroundColor: theme.card }]}
            onPress={() => router.push("/profile/contributions?tab=ajoute")}
          >
            <View style={[styles.iconContainer, { backgroundColor: theme.primaryLight }]}>
              <Ionicons name="location-outline" size={20} color={theme.primary} />
            </View>
            <View style={styles.listItemContent}>
              <Text style={[styles.listItemTitle, { color: theme.text }]}>Toilettes ajoutés</Text>
              <Text style={[styles.listItemSubtitle, { color: theme.textMuted }]}>10</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.listItem, { backgroundColor: theme.card }]}
            onPress={() => router.push("/profile/contributions?tab=commentaires")}
          >
            <View style={[styles.iconContainer, { backgroundColor: theme.primaryLight }]}>
              <Ionicons name="star-outline" size={20} color={theme.primary} />
            </View>
            <View style={styles.listItemContent}>
              <Text style={[styles.listItemTitle, { color: theme.text }]}>Commentaires</Text>
              <Text style={[styles.listItemSubtitle, { color: theme.textMuted }]}>50</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.listItem, { backgroundColor: theme.card }]}
            onPress={() => router.push("/profile/contributions?tab=signalements")}
          >
            <View style={[styles.iconContainer, { backgroundColor: theme.primaryLight }]}>
              <Ionicons name="flag-outline" size={20} color={theme.primary} />
            </View>
            <View style={styles.listItemContent}>
              <Text style={[styles.listItemTitle, { color: theme.text }]}>Signalements</Text>
              <Text style={[styles.listItemSubtitle, { color: theme.textMuted }]}>20</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Gamification</Text>
          <TouchableOpacity
            style={[styles.listItem, { backgroundColor: theme.card }]}
            onPress={() => router.push("/profile/badges")}
          >
            <View style={[styles.iconContainer, { backgroundColor: theme.primaryLight }]}>
              <Ionicons name="ribbon-outline" size={20} color={theme.primary} />
            </View>
            <View style={styles.listItemContent}>
              <Text style={[styles.listItemTitle, { color: theme.text }]}>Badges</Text>
              <Text style={[styles.listItemSubtitle, { color: theme.textMuted }]}>Explorateur, Premier Pas ...</Text>
            </View>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.error }]}
          onPress={handleLogout}
        >
          <Text style={styles.buttonText}>Déconnexion</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: scale(20),
    paddingVertical: verticalScale(15),
  },
  headerTitle: {
    fontSize: scale(18),
    fontWeight: "600",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  profileSection: {
    position: "relative",
    marginTop: verticalScale(20),
  },
  editButton: {
    position: "absolute",
    top: verticalScale(10),
    right: scale(20),
    padding: scale(5),
    zIndex: 10,
  },
  header: { alignItems: "center" },
  avatar: {
    width: scale(100),
    height: scale(100),
    borderRadius: scale(50),
    marginBottom: verticalScale(10),
  },
  username: { fontSize: scale(22), fontWeight: "bold" },
  subtitle: { fontSize: scale(14), marginBottom: verticalScale(5) },
  bio: { 
    fontSize: scale(14), 
    textAlign: "center",
    paddingHorizontal: scale(40),
    marginTop: verticalScale(10),
  },
  stats: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    marginTop: verticalScale(30),
    paddingHorizontal: scale(20),
  },
  statBox: { 
    alignItems: "center",
    flex: 1,
  },
  statNumber: { fontSize: scale(20), fontWeight: "bold" },
  statLabel: { 
    fontSize: scale(14),
    textAlign: "center",
  },
  section: { marginTop: verticalScale(30), paddingHorizontal: scale(20) },
  sectionTitle: {
    fontSize: scale(18),
    fontWeight: "bold",
    marginBottom: verticalScale(10),
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: scale(15),
    borderRadius: scale(12),
    marginBottom: verticalScale(10),
    ...Shadows.dp2,
  },
  iconContainer: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(20),
    alignItems: "center",
    justifyContent: "center",
    marginRight: scale(15),
  },
  listItemContent: {
    flex: 1,
  },
  listItemTitle: {
    fontSize: scale(16),
    fontWeight: "600",
    marginBottom: verticalScale(2),
  },
  listItemSubtitle: {
    fontSize: scale(14),
  },
  button: {
    padding: scale(15),
    marginHorizontal: scale(20),
    marginTop: verticalScale(20),
    borderRadius: scale(8),
    alignItems: "center",
    ...Shadows.dp2,
  },
  buttonText: { color: "white", fontSize: scale(16), fontWeight: "600" },
});