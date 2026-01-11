import { getUserProfile, logout } from "@/auth/authService";
import { Colors } from "@/constants/Colors";
import { DEFAULT_USER_AVATAR } from "@/constants/Images";
import { Shadows } from "@/constants/Shadows";
import { User } from "@/models/user";
import { withDefaultImage } from "@/utils/images";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

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

  const contributionItems = [
    {
      id: "toilettes",
      icon: "location-outline" as keyof typeof Ionicons.glyphMap,
      title: "Toilettes ajoutés",
      subtitle: "10",
      route: "/profile/contributions?tab=ajoute",
    },
    {
      id: "commentaires",
      icon: "star-outline" as keyof typeof Ionicons.glyphMap,
      title: "Commentaires",
      subtitle: "50",
      route: "/profile/contributions?tab=commentaires",
    },
    {
      id: "signalements",
      icon: "flag-outline" as keyof typeof Ionicons.glyphMap,
      title: "Signalements",
      subtitle: "20",
      route: "/profile/contributions?tab=signalements",
    },
  ];

  const gamificationItems = [
    {
      id: "badges",
      icon: "ribbon-outline" as keyof typeof Ionicons.glyphMap,
      title: "Badges",
      subtitle: "Explorateur, Premier Pas ...",
      route: "/profile/badges",
    },
  ];

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
            source={{
              uri: withDefaultImage(userProfile.photo_url, DEFAULT_USER_AVATAR),
            }}
            style={[styles.avatar, Shadows.dp4]}
          />

          <Text style={[styles.username, { color: theme.text }]}>
            {userProfile.name}
          </Text>
          
          <View style={styles.levelPointsContainer}>
            <View style={styles.levelContainer}>
              <Ionicons name="trophy-outline" size={20} color={theme.primary} />
              <Text style={[styles.levelPointsText, { color: theme.text }]}>
                Niveau {userProfile.level}
              </Text>
            </View>
            
            <View style={styles.pointsContainer}>
              <Ionicons name="star" size={20} color={theme.primary} />
              <Text style={[styles.levelPointsText, { color: theme.text }]}>
                {userProfile.points} pts
              </Text>
            </View>
          </View>

          <Text style={[styles.bio, { color: theme.textMuted }]}>
            {userProfile.bio}
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
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Contributions
          </Text>
          <FlatList
            data={contributionItems}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.flatList, { backgroundColor: theme.card }]}
                onPress={() => router.push(item.route as any)}
              >
                <View
                  style={[
                    styles.iconContainer,
                  ]}
                >
                  <Ionicons name={item.icon} size={20} color={theme.primary} />
                </View>
                <View style={styles.flatListContent}>
                  <Text style={[styles.flatListTitle, { color: theme.text }]}>
                    {item.title}
                  </Text>
                  <Text
                    style={[
                      styles.flatListSubtitle,
                      { color: theme.textMuted },
                    ]}
                  >
                    {item.subtitle}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Gamification
          </Text>
          <FlatList
            data={gamificationItems}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.flatList, { backgroundColor: theme.card }]}
                onPress={() => router.push(item.route as any)}
              >
                <View
                  style={[
                    styles.iconContainer,
                  ]}
                >
                  <Ionicons name={item.icon} size={20} color={theme.primary} />
                </View>
                <View style={styles.flatListContent}>
                  <Text style={[styles.flatListTitle, { color: theme.text }]}>
                    {item.title}
                  </Text>
                  <Text
                    style={[
                      styles.flatListSubtitle,
                      { color: theme.textMuted },
                    ]}
                  >
                    {item.subtitle}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
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
  header: {
    alignItems: "center",
    marginBottom: scale(20),
  },
  avatar: {
    width: scale(100),
    height: scale(100),
    borderRadius: scale(50),
    marginBottom: verticalScale(10),
  },
  username: { 
    fontSize: scale(22), 
    fontWeight: "bold",
    marginBottom: verticalScale(10),
  },
  levelPointsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "50%",
    marginTop: verticalScale(5),
  },
  levelContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(6),
  },
  pointsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(6),
  },
  levelPointsText: {
    fontSize: scale(14),
    fontWeight: "500",
  },
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
  flatList: {
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
  flatListContent: {
    flex: 1,
  },
  flatListTitle: {
    fontSize: scale(16),
    fontWeight: "600",
    marginBottom: verticalScale(2),
  },
  flatListSubtitle: {
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