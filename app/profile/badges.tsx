import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import PageHeader from "../../components/header";
import {
  fetchAvailableBadges,
  fetchUserBadges,
} from "../../functions/api/gamification";
import { mapApiBadge } from "../../functions/mappers/gamification";
import type { Badge } from "../../types/ui/Badge";

const getBadgeImage = (badgeId: string, iconUrl?: string) =>
  iconUrl || `https://picsum.photos/100/100?random=${badgeId}`;

const RARITY_COLORS: Record<Badge["rarity"], string> = {
  bronze: "#CD7F32",
  silver: "#C0C0C0",
  gold: "#FFD700",
};

export default function BadgesScreen() {
  const router = useRouter();

  const {
    data: userBadges = [],
    isLoading: loadingUser,
    error: userError,
  } = useQuery({
    queryKey: ["userBadges"],
    queryFn: fetchUserBadges,
  });

  const {
    data: allBadges = [],
    isLoading: loadingAll,
    error: allError,
  } = useQuery({
    queryKey: ["availableBadges"],
    queryFn: fetchAvailableBadges,
  });

  const isLoading = loadingUser || loadingAll;
  const hasError = userError || allError;

  const obtainedIds = new Set(userBadges.map((b) => b.id));
  const badges: Badge[] = allBadges.map((b) =>
    mapApiBadge(b, obtainedIds.has(b.id)),
  );

  const obtainedBadges = badges.filter((b) => b.obtained);
  const unobtainedBadges = badges.filter((b) => !b.obtained);

  const handleBack = () => router.back();

  const renderBadge = (badge: Badge) => (
    <View style={[styles.badgeCard, !badge.obtained && styles.badgeUnobtained]}>
      <Image
        source={{ uri: getBadgeImage(badge.id, badge.image) }}
        style={[
          styles.badgeImage,
          { borderColor: RARITY_COLORS[badge.rarity] },
        ]}
      />
      <Text
        style={[styles.badgeName, !badge.obtained && styles.textUnobtained]}
      >
        {badge.name}
      </Text>
      <Text
        style={[
          styles.badgeDescription,
          !badge.obtained && styles.textUnobtained,
        ]}
      >
        {badge.description}
      </Text>
      <Text style={[styles.badgePoints, !badge.obtained && styles.textUnobtained]}>
        {badge.minPoints} pts
      </Text>
    </View>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <PageHeader title="Badges" onBack={handleBack} />
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color="#3BAF74" />
        </View>
      </SafeAreaView>
    );
  }

  if (hasError) {
    return (
      <SafeAreaView style={styles.container}>
        <PageHeader title="Badges" onBack={handleBack} />
        <View style={styles.centerContent}>
          <Text style={styles.errorText}>
            Erreur lors du chargement des badges.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <PageHeader title="Badges" onBack={handleBack} />
      <ScrollView contentContainerStyle={{ padding: 15, paddingBottom: 40 }}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Badges obtenus ({obtainedBadges.length})
          </Text>
          {obtainedBadges.length === 0 ? (
            <Text style={styles.emptyText}>
              Vous n'avez pas encore obtenu de badge. Contribuez pour en gagner !
            </Text>
          ) : (
            <View style={styles.badgesGrid}>
              {obtainedBadges.map((b) => (
                <View key={b.id} style={styles.badgeWrapper}>
                  {renderBadge(b)}
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Badges à obtenir ({unobtainedBadges.length})
          </Text>
          <View style={styles.badgesGrid}>
            {unobtainedBadges.map((b) => (
              <View key={b.id} style={styles.badgeWrapper}>
                {renderBadge(b)}
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: { color: "#ff4444", fontSize: 14, textAlign: "center" },
  emptyText: { color: "#888", fontSize: 14, fontStyle: "italic" },
  section: { marginBottom: 30 },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 15,
    color: "#000",
  },
  badgesGrid: { flexDirection: "row", flexWrap: "wrap" },
  badgeWrapper: { width: "33.33%", paddingHorizontal: 5, marginBottom: 15 },
  badgeCard: {
    alignItems: "center",
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#f9f9f9",
  },
  badgeUnobtained: { opacity: 0.6 },
  badgeImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 8,
    borderWidth: 3,
  },
  badgeName: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 4,
    color: "#000",
  },
  badgeDescription: { fontSize: 11, textAlign: "center", color: "#666" },
  badgePoints: {
    fontSize: 11,
    fontWeight: "600",
    color: "#3BAF74",
    marginTop: 4,
  },
  textUnobtained: { color: "#999" },
});
