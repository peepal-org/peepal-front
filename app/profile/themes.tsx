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
import { fetchAllThemes } from "../../functions/api/gamification";
import { mapApiTheme } from "../../functions/mappers/gamification";
import type { Theme } from "../../types/ui/Theme";

const TYPE_LABELS: Record<Theme["type"], string> = {
  basic: "Basique",
  premium: "Premium",
  animated: "Animé",
  exclusive: "Exclusif",
};

const TYPE_BADGE_COLOR: Record<Theme["type"], string> = {
  basic: "#8BC34A",
  premium: "#1976D2",
  animated: "#7B1FA2",
  exclusive: "#FFC107",
};

export default function ThemesScreen() {
  const router = useRouter();

  const { data: apiThemes = [], isLoading, error } = useQuery({
    queryKey: ["themes"],
    queryFn: fetchAllThemes,
  });

  const handleBack = () => router.back();

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <PageHeader title="Thèmes" onBack={handleBack} />
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color="#3BAF74" />
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <PageHeader title="Thèmes" onBack={handleBack} />
        <View style={styles.centerContent}>
          <Text style={styles.errorText}>
            Erreur lors du chargement des thèmes.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const themes = apiThemes.map(mapApiTheme);
  const unlocked = themes.filter((t) => t.unlocked);
  const locked = themes.filter((t) => !t.unlocked);

  const renderTheme = (themeItem: Theme) => (
    <View
      key={themeItem.id}
      style={[styles.themeCard, !themeItem.unlocked && styles.themeLocked]}
    >
      <View style={styles.colorRow}>
        <View
          style={[
            styles.colorSwatch,
            { backgroundColor: themeItem.colorPrimary || "#ddd" },
          ]}
        />
        <View
          style={[
            styles.colorSwatch,
            { backgroundColor: themeItem.colorSecondary || "#ddd" },
          ]}
        />
        <View
          style={[
            styles.colorSwatch,
            { backgroundColor: themeItem.accentColor || "#ddd" },
          ]}
        />
      </View>

      <View style={styles.themeContent}>
        <View style={styles.themeHeader}>
          <Text
            style={[
              styles.themeName,
              !themeItem.unlocked && styles.textLocked,
            ]}
          >
            {themeItem.name}
          </Text>
          <View
            style={[
              styles.typeBadge,
              { backgroundColor: TYPE_BADGE_COLOR[themeItem.type] },
            ]}
          >
            <Text style={styles.typeBadgeText}>
              {TYPE_LABELS[themeItem.type]}
            </Text>
          </View>
        </View>

        <Text
          style={[
            styles.themeDescription,
            !themeItem.unlocked && styles.textLocked,
          ]}
        >
          {themeItem.description}
        </Text>

        <Text
          style={[
            styles.themeRequirement,
            themeItem.unlocked ? styles.unlockedTag : styles.lockedTag,
          ]}
        >
          {themeItem.unlocked
            ? "Débloqué"
            : `Niveau ${themeItem.minLevel} requis`}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <PageHeader title="Thèmes" onBack={handleBack} />
      <ScrollView contentContainerStyle={{ padding: 15, paddingBottom: 40 }}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Débloqués ({unlocked.length})
          </Text>
          {unlocked.length === 0 ? (
            <Text style={styles.emptyText}>
              Vous n'avez pas encore débloqué de thème. Contribuez pour
              progresser !
            </Text>
          ) : (
            unlocked.map(renderTheme)
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>À débloquer ({locked.length})</Text>
          {locked.length === 0 ? (
            <Text style={styles.emptyText}>
              Vous avez débloqué tous les thèmes disponibles 🎉
            </Text>
          ) : (
            locked.map(renderTheme)
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
  section: { marginBottom: 24 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    color: "#000",
  },
  themeCard: {
    borderRadius: 12,
    backgroundColor: "#f9f9f9",
    marginBottom: 12,
    overflow: "hidden",
  },
  themeLocked: { opacity: 0.55 },
  colorRow: { flexDirection: "row", height: 56 },
  colorSwatch: { flex: 1 },
  themeContent: { padding: 15 },
  themeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  themeName: { fontSize: 16, fontWeight: "600", color: "#000", flex: 1 },
  typeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  typeBadgeText: {
    fontSize: 11,
    color: "#fff",
    fontWeight: "600",
    textTransform: "uppercase",
  },
  themeDescription: { fontSize: 13, color: "#666", marginBottom: 8 },
  themeRequirement: { fontSize: 12, fontWeight: "600" },
  unlockedTag: { color: "#3BAF74" },
  lockedTag: { color: "#888" },
  textLocked: { color: "#999" },
});
