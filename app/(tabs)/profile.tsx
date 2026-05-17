import { getUserProfile } from "@/auth/authService";
import { useAuth } from "@/auth/useAuth";
import { Colors } from "@/constants/Colors";
import { DEFAULT_USER_AVATAR } from "@/constants/Images";
import { Shadows } from "@/constants/Shadows";
import { fetchAdminOverview } from "@/functions/api/admin";
import { fetchComments } from "@/functions/api/comments";
import { fetchMyCommentReports } from "@/functions/api/commentReports";
import { fetchReports } from "@/functions/api/reports";
import { fetchToilets } from "@/functions/api/toilet";
import { User } from "@/types/ui/User";
import { withDefaultImage } from "@/utils/images";
import { Ionicons } from "@expo/vector-icons";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
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
  const queryClient = useQueryClient();
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { signOut } = useAuth();

  const loadProfile = useCallback(async () => {
    try {
      setLoading(true);
      const profile = await getUserProfile();
      setUserProfile(profile);
    } catch (error) {
      console.error("Erreur lors du chargement du profil:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  useFocusEffect(
    useCallback(() => {
      loadProfile();
      queryClient.invalidateQueries({ queryKey: ["userComments"] });
      queryClient.invalidateQueries({ queryKey: ["userToilets"] });
      queryClient.invalidateQueries({ queryKey: ["myReports"] });
      queryClient.invalidateQueries({ queryKey: ["myCommentReports"] });
      queryClient.invalidateQueries({ queryKey: ["adminOverview"] });
    }, [loadProfile, queryClient]),
  );

  const { data: myCommentsData = [] } = useQuery({
    queryKey: ["myComments", userProfile?.id],
    queryFn: fetchComments,
    select: (apiComments) => {
      return apiComments.filter(
        (comment) => comment.user.id === userProfile?.id
      );
    },
    enabled: !!userProfile,
  });

  const { data: myReportData = [] } = useQuery({
    queryKey: ["myReports", userProfile?.id],
    queryFn: fetchReports,
    select: (apiReports) => {
      return apiReports.filter(
        (report) => report.user.id === userProfile?.id
      );
    },
    enabled: !!userProfile,
  });

  const { data: myCommentReportData = [] } = useQuery({
    queryKey: ["myCommentReports", userProfile?.id],
    queryFn: fetchMyCommentReports,
    enabled: !!userProfile,
  });

  const { data: myToiletsData = [] } = useQuery({
    queryKey: ["myToilets", userProfile?.id],
    queryFn: fetchToilets,
    select: (apiToilets) => {
      return apiToilets.filter(
        (toilet) => toilet.createdBy?.id === userProfile?.id
      );
    },
    enabled: !!userProfile,
  });

  const { data: adminOverview } = useQuery({
    queryKey: ["adminOverview"],
    queryFn: fetchAdminOverview,
    enabled: !!userProfile && userProfile?.type === "admin",
  });


  const myCommentsCount = myCommentsData.length;
  const myToiletsCount = myToiletsData.filter((toilet) => toilet.status).length;
  const myReportCount = myReportData.length + myCommentReportData.length;

  const allCommentsCount = adminOverview?.totals.comments ?? 0;
  const allToiletsCount = adminOverview?.totals.toilets ?? 0;
  const allReportCount = adminOverview?.totals.reports ?? 0;

  const myContributionItems = [
    {
      id: "mes-toilettes",
      icon: "location-outline" as keyof typeof Ionicons.glyphMap,
      title: "Toilettes ajoutés",
      subtitle: myToiletsCount.toString(),
      route: "/profile/contributions?tab=ajoute&scope=personal",
    },
    {
      id: "mes-commentaires",
      icon: "star-outline" as keyof typeof Ionicons.glyphMap,
      title: "Commentaires",
      subtitle: myCommentsCount.toString(),
      route: "/profile/contributions?tab=commentaires&scope=personal",
    },
    {
      id: "signalements",
      icon: "flag-outline" as keyof typeof Ionicons.glyphMap,
      title: "Signalements",
      subtitle: myReportCount.toString(),
      route: "/profile/contributions?tab=signalements&scope=personal",
    },
  ];

  const allContributionItems = [
    {
      id: "all-toilettes",
      icon: "location-outline" as keyof typeof Ionicons.glyphMap,
      title: "Toilettes ajoutés",
      subtitle: allToiletsCount.toString(),
      route: "/profile/contributions?tab=ajoute&scope=all",
    },
    {
      id: "all-commentaires",
      icon: "star-outline" as keyof typeof Ionicons.glyphMap,
      title: "Commentaires",
      subtitle: allCommentsCount.toString(),
      route: "/profile/contributions?tab=commentaires&scope=all",
    },
    {
      id: "all-signalements",
      icon: "flag-outline" as keyof typeof Ionicons.glyphMap,
      title: "Signalements",
      subtitle: allReportCount.toString(),
      route: "/profile/contributions?tab=signalements&scope=all",
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

  const handleLogout = async () => {
    try {
      await signOut();
      router.replace("/auth/login");
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

  const profilePhotoUrl = withDefaultImage(
    userProfile.photoUrl ??
      (userProfile as User & { photo_url?: string | null }).photo_url,
    DEFAULT_USER_AVATAR,
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.headerBar}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Profile</Text>
      </View>

      <View style={styles.profileSection}>
        <View style={styles.header}>
          <Image
            source={{
              uri: profilePhotoUrl,
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
            { number: myCommentsCount, label: "Commentaires" },
            { number: myReportCount.toString(), label: "Signalements" },
            { number: 7, label: "Badges" },
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
            Mes contributions
          </Text>
          <FlatList
            data={myContributionItems}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.flatList, { backgroundColor: theme.card }]}
                onPress={() => router.push(item.route as any)}
              >
                <View style={[styles.iconContainer]}>
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

        {/* Contributions globales - uniquement pour les admins */}
        {userProfile.type === "admin" && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Contributions (tous les utilisateurs)
            </Text>
            <FlatList
              data={allContributionItems}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.flatList, { backgroundColor: theme.card }]}
                  onPress={() => router.push(item.route as any)}
                >
                  <View style={[styles.iconContainer]}>
                    <Ionicons name={item.icon} size={20} color={theme.primary} />
                  </View>
                  <View style={styles.flatListContent}>
                    <Text style={[styles.flatListTitle, { color: theme.text }]}>
                      {item.title}
                    </Text>
                    <Text style={[styles.flatListSubtitle, { color: theme.textMuted }]}>
                      {item.subtitle}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          </View>
        )}

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
                <View style={[styles.iconContainer]}>
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
  container: { 
    flex: 1 
  },
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
  subtitle: { 
    fontSize: scale(14),
    marginBottom: verticalScale(5) 
  },
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
  section: { 
    marginTop: verticalScale(30),
    paddingHorizontal: scale(20) 
  },
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
  admin: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    borderWidth: 3,
  },
  adminText: {
    color:"#4CAF50"
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
  buttonText: { 
    color: "white", 
    fontSize: scale(16), 
    fontWeight: "600" 
  },
});
