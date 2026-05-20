import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import PageHeader from "../../components/header";
import { fetchGamificationStats } from "../../functions/api/gamification";
import { mapApiQuestWithProgress } from "../../functions/mappers/gamification";
import type { Quest } from "../../types/ui/Quest";

const QUEST_TYPE_LABELS: Record<Quest["type"], string> = {
  add_toilet: "Ajouter des toilettes",
  add_photo: "Ajouter des photos",
  like_toilets: "Liker des toilettes",
  add_validated_toilets: "Faire valider vos toilettes",
  make_reports: "Faire des signalements",
  complete_fiches: "Compléter des fiches",
  verify_pending: "Vérifier des fiches en attente",
  detect_duplicates: "Détecter des doublons",
  merge_duplicates: "Fusionner des doublons",
  resolve_reports: "Résoudre des signalements",
};

export default function QuestsScreen() {
  const router = useRouter();

  const { data, isLoading, error } = useQuery({
    queryKey: ["gamificationStats"],
    queryFn: fetchGamificationStats,
  });

  const handleBack = () => router.back();

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <PageHeader title="Quêtes" onBack={handleBack} />
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color="#3BAF74" />
        </View>
      </SafeAreaView>
    );
  }

  if (error || !data) {
    return (
      <SafeAreaView style={styles.container}>
        <PageHeader title="Quêtes" onBack={handleBack} />
        <View style={styles.centerContent}>
          <Text style={styles.errorText}>
            Erreur lors du chargement des quêtes.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const dailyQuests = data.dailyQuests.map(mapApiQuestWithProgress);
  const weeklyQuests = data.weeklyQuests.map(mapApiQuestWithProgress);

  const renderQuest = (quest: Quest) => {
    const ratio = Math.min(quest.currentProgress / quest.requiredCount, 1);
    const percent = Math.round(ratio * 100);
    return (
      <View key={quest.id} style={styles.questCard}>
        <View style={styles.questHeader}>
          <Text style={styles.questName}>{quest.name}</Text>
          <Text style={styles.rewardText}>+{quest.rewardPoints} pts</Text>
        </View>
        <Text style={styles.questDescription}>
          {quest.description || QUEST_TYPE_LABELS[quest.type]}
        </Text>
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, { width: `${percent}%` }]} />
        </View>
        <View style={styles.questFooter}>
          <Text style={styles.progressText}>
            {quest.currentProgress} / {quest.requiredCount}
          </Text>
          {quest.isCompleted && (
            <Text style={styles.completedText}>Terminé</Text>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <PageHeader title="Quêtes" onBack={handleBack} />
      <ScrollView contentContainerStyle={{ padding: 15, paddingBottom: 40 }}>
        <View style={styles.summaryRow}>
          <View style={styles.summaryBox}>
            <Text style={styles.summaryNumber}>{data.points}</Text>
            <Text style={styles.summaryLabel}>Points</Text>
          </View>
          <View style={styles.summaryBox}>
            <Text style={styles.summaryNumber}>{data.level}</Text>
            <Text style={styles.summaryLabel}>Niveau</Text>
          </View>
          <View style={styles.summaryBox}>
            <Text style={styles.summaryNumber}>{data.badges.length}</Text>
            <Text style={styles.summaryLabel}>Badges</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Quêtes journalières ({dailyQuests.length})
          </Text>
          {dailyQuests.length === 0 ? (
            <Text style={styles.emptyText}>
              Aucune quête journalière disponible.
            </Text>
          ) : (
            dailyQuests.map(renderQuest)
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Quêtes hebdomadaires ({weeklyQuests.length})
          </Text>
          {weeklyQuests.length === 0 ? (
            <Text style={styles.emptyText}>
              Aucune quête hebdomadaire disponible.
            </Text>
          ) : (
            weeklyQuests.map(renderQuest)
          )}
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
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 15,
    marginBottom: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
  },
  summaryBox: { alignItems: "center" },
  summaryNumber: { fontSize: 22, fontWeight: "700", color: "#3BAF74" },
  summaryLabel: { fontSize: 13, color: "#666", marginTop: 4 },
  section: { marginTop: 20 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    color: "#000",
  },
  questCard: {
    padding: 15,
    borderRadius: 12,
    backgroundColor: "#f9f9f9",
    marginBottom: 12,
  },
  questHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  questName: { fontSize: 16, fontWeight: "600", color: "#000", flex: 1 },
  rewardText: { fontSize: 14, fontWeight: "600", color: "#3BAF74" },
  questDescription: { fontSize: 13, color: "#666", marginBottom: 10 },
  progressBarContainer: {
    height: 8,
    backgroundColor: "#e0e0e0",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 6,
  },
  progressBar: { height: "100%", backgroundColor: "#3BAF74" },
  questFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  progressText: { fontSize: 12, color: "#555", fontWeight: "500" },
  completedText: { fontSize: 12, color: "#3BAF74", fontWeight: "600" },
});
