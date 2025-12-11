import React, { useState } from "react";
import { View, Text, Image, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import PageHeader from "../../components/header";
import { useRouter } from "expo-router";

type BadgeType = {
  id: string;
  name: string;
  description: string;
  image: string;
  obtained: boolean;
};

export default function BadgesScreen() {
  const navigation = useNavigation();

  const allBadges: BadgeType[] = [
    { id: "1", name: "Premier Pas", description: "Ajoutez votre première toilette", image: "https://picsum.photos/100/100?random=1", obtained: true },
    { id: "2", name: "Explorateur", description: "Visitez 10 toilettes différentes", image: "https://picsum.photos/100/100?random=2", obtained: true },
    { id: "3", name: "Critique", description: "Laissez 5 avis", image: "https://picsum.photos/100/100?random=3", obtained: true },
    { id: "4", name: "Expert", description: "Ajoutez 20 toilettes", image: "https://picsum.photos/100/100?random=4", obtained: true },
    { id: "5", name: "Aventurier", description: "Visitez 50 toilettes", image: "https://picsum.photos/100/100?random=5", obtained: true },
    { id: "6", name: "Contributeur", description: "Ajoutez 50 toilettes", image: "https://picsum.photos/100/100?random=6", obtained: true },
    { id: "7", name: "Légende", description: "Obtenez 100 avis positifs", image: "https://picsum.photos/100/100?random=7", obtained: false },
    { id: "8", name: "Globe-Trotter", description: "Visitez des toilettes dans 10 villes", image: "https://picsum.photos/100/100?random=8", obtained: true },
    { id: "9", name: "Influenceur", description: "Vos avis ont 500 likes", image: "https://picsum.photos/100/100?random=9", obtained: false },
    { id: "10", name: "Champion", description: "Soyez premier au classement pendant 7 jours", image: "https://picsum.photos/100/100?random=10", obtained: false },
    { id: "16", name: "Champion", description: "Soyez premier au classement pendant 7 jours", image: "https://picsum.photos/100/100?random=10", obtained: false },
    { id: "11", name: "Champion", description: "Soyez premier au classement pendant 7 jours", image: "https://picsum.photos/100/100?random=10", obtained: false },
    { id: "12", name: "Champion", description: "Soyez premier au classement pendant 7 jours", image: "https://picsum.photos/100/100?random=10", obtained: false },
    { id: "13", name: "Champion", description: "Soyez premier au classement pendant 7 jours", image: "https://picsum.photos/100/100?random=10", obtained: false },
    { id: "14", name: "Champion", description: "Soyez premier au classement pendant 7 jours", image: "https://picsum.photos/100/100?random=10", obtained: false },
    { id: "15", name: "Champion", description: "Soyez premier au classement pendant 7 jours", image: "https://picsum.photos/100/100?random=10", obtained: false },
  ];

  const obtainedBadges = allBadges.filter(badge => badge.obtained);
  const unobtainedBadges = allBadges.filter(badge => !badge.obtained);

  const handleBack = () => {
    router.replace("/(tabs)/profile");
  };

  const renderBadge = (badge: BadgeType) => (
    <View style={[styles.badgeCard, !badge.obtained && styles.badgeUnobtained]}>
      <Image source={{ uri: badge.image }} style={styles.badgeImage} />
      <Text style={[styles.badgeName, !badge.obtained && styles.textUnobtained]}>{badge.name}</Text>
      <Text style={[styles.badgeDescription, !badge.obtained && styles.textUnobtained]}>
        {badge.description}
      </Text>
    </View>
  );

  const router = useRouter();

  return (
    <View style={styles.container}>
      <PageHeader title="Badges" onBack={handleBack} />

      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Badges obtenus ({obtainedBadges.length})</Text>
          <View style={styles.badgesGrid}>
            {obtainedBadges.map((badge) => (
              <View key={badge.id} style={styles.badgeWrapper}>
                {renderBadge(badge)}
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Badges à obtenir ({unobtainedBadges.length})</Text>
          <View style={styles.badgesGrid}>
            {unobtainedBadges.map((badge) => (
              <View key={badge.id} style={styles.badgeWrapper}>
                {renderBadge(badge)}
              </View>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    padding: 15,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 15,
    color: "#000",
  },
  badgesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
  },
  badgeWrapper: {
    width: "33.33%",
    paddingHorizontal: 5,
    marginBottom: 15,
  },
  badgeCard: {
    alignItems: "center",
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#f9f9f9",
  },
  badgeUnobtained: {
    opacity: 0.3,
  },
  badgeImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 8,
  },
  badgeName: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 4,
    color: "#000",
  },
  badgeDescription: {
    fontSize: 11,
    textAlign: "center",
    color: "#666",
  },
  textUnobtained: {
    color: "#999",
  },
});