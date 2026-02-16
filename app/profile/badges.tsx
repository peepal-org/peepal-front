import { useRouter } from "expo-router";
import React from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import PageHeader from "../../components/header";
import { Badge } from "../../types/Badge";

export default function BadgesScreen() {
  const router = useRouter();

  const allBadges: Badge[] = [
    {
      id: "1",
      name: "Premier Pas",
      description: "Ajoutez votre première toilette",
      image: "https://picsum.photos/100/100?random=1",
      obtained: true,
    },
    {
      id: "2",
      name: "Explorateur",
      description: "Visitez 10 toilettes différentes",
      image: "https://picsum.photos/100/100?random=2",
      obtained: true,
    },
    {
      id: "3",
      name: "Critique",
      description: "Laissez 5 avis",
      image: "https://picsum.photos/100/100?random=3",
      obtained: true,
    },
    {
      id: "4",
      name: "Expert",
      description: "Ajoutez 20 toilettes",
      image: "https://picsum.photos/100/100?random=4",
      obtained: true,
    },
    {
      id: "5",
      name: "Aventurier",
      description: "Visitez 50 toilettes",
      image: "https://picsum.photos/100/100?random=5",
      obtained: true,
    },
    {
      id: "6",
      name: "Contributeur",
      description: "Ajoutez 50 toilettes",
      image: "https://picsum.photos/100/100?random=6",
      obtained: true,
    },
    {
      id: "7",
      name: "Légende",
      description: "Obtenez 100 avis positifs",
      image: "https://picsum.photos/100/100?random=7",
      obtained: false,
    },
    {
      id: "8",
      name: "Globe-Trotter",
      description: "Visitez des toilettes dans 10 villes",
      image: "https://picsum.photos/100/100?random=8",
      obtained: true,
    },
    {
      id: "9",
      name: "Influenceur",
      description: "Vos avis ont 500 likes",
      image: "https://picsum.photos/100/100?random=9",
      obtained: false,
    },
    {
      id: "10",
      name: "Champion",
      description: "Soyez premier au classement pendant 7 jours",
      image: "https://picsum.photos/100/100?random=10",
      obtained: false,
    },
    {
      id: "11",
      name: "Champion",
      description: "Soyez premier au classement pendant 7 jours",
      image: "https://picsum.photos/100/100?random=10",
      obtained: false,
    },
    {
      id: "12",
      name: "Champion",
      description: "Soyez premier au classement pendant 7 jours",
      image: "https://picsum.photos/100/100?random=10",
      obtained: false,
    },
    {
      id: "13",
      name: "Champion",
      description: "Soyez premier au classement pendant 7 jours",
      image: "https://picsum.photos/100/100?random=10",
      obtained: false,
    },
    {
      id: "14",
      name: "Champion",
      description: "Soyez premier au classement pendant 7 jours",
      image: "https://picsum.photos/100/100?random=10",
      obtained: false,
    },
    {
      id: "15",
      name: "Champion",
      description: "Soyez premier au classement pendant 7 jours",
      image: "https://picsum.photos/100/100?random=10",
      obtained: false,
    },
    {
      id: "16",
      name: "Champion",
      description: "Soyez premier au classement pendant 7 jours",
      image: "https://picsum.photos/100/100?random=10",
      obtained: false,
    },
  ];

  const obtainedBadges = allBadges.filter((b) => b.obtained);
  const unobtainedBadges = allBadges.filter((b) => !b.obtained);

  const handleBack = () => router.back();

  const renderBadge = (badge: Badge) => (
    <View style={[styles.badgeCard, !badge.obtained && styles.badgeUnobtained]}>
      <Image source={{ uri: badge.image }} style={styles.badgeImage} />
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
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <PageHeader title="Badges" onBack={handleBack} />
      <ScrollView contentContainerStyle={{ padding: 15, paddingBottom: 40 }}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Badges obtenus ({obtainedBadges.length})
          </Text>
          <View style={styles.badgesGrid}>
            {obtainedBadges.map((b) => (
              <View key={b.id} style={styles.badgeWrapper}>
                {renderBadge(b)}
              </View>
            ))}
          </View>
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
  badgeImage: { width: 80, height: 80, borderRadius: 40, marginBottom: 8 },
  badgeName: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 4,
    color: "#000",
  },
  badgeDescription: { fontSize: 11, textAlign: "center", color: "#666" },
  textUnobtained: { color: "#999" },
});
