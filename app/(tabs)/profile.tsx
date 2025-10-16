import { Colors } from "@/constants/Colors";
import { Shadows } from "@/constants/Shadows";
import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={{ paddingBottom: 60 }}
    >
      {/* 👤 Profile Header */}
      <View style={styles.header}>
        <Image
          source={{ uri: "https://i.pravatar.cc/150?img=12" }}
          style={[styles.avatar, Shadows.dp4]}
        />
        <Text style={[styles.username, { color: theme.text }]}>
          Jean Dupont
        </Text>
        <Text style={[styles.subtitle, { color: theme.textMuted }]}>
          Explorateur urbain 🚀
        </Text>
      </View>

      {/* 📊 User Stats */}
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

      {/* 🏅 Badges */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          Mes Badges
        </Text>
        <View style={styles.badgeRow}>
          {[
            { icon: "⭐", label: "Nouveau" },
            { icon: "💬", label: "Commentateur" },
            { icon: "🚻", label: "Découvreur" },
          ].map((badge, index) => (
            <View
              key={index}
              style={[
                styles.badge,
                Shadows.dp2,
                { backgroundColor: theme.card },
              ]}
            >
              <Text style={styles.badgeIcon}>{badge.icon}</Text>
              <Text style={[styles.badgeLabel, { color: theme.text }]}>
                {badge.label}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* ⚙️ Actions */}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.primary }]}
      >
        <Text style={styles.buttonText}>Modifier mon profil</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.error }]}
      >
        <Text style={styles.buttonText}>Déconnexion</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { alignItems: "center", marginTop: 40 },
  avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 10 },
  username: { fontSize: 22, fontWeight: "bold" },
  subtitle: { fontSize: 14 },

  stats: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 30,
  },
  statBox: { alignItems: "center" },
  statNumber: { fontSize: 20, fontWeight: "bold" },
  statLabel: { fontSize: 14 },

  section: { marginTop: 30, paddingHorizontal: 20 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  badgeRow: { flexDirection: "row", justifyContent: "space-around" },

  badge: {
    alignItems: "center",
    padding: 15,
    borderRadius: 12,
    width: 100,
  },
  badgeIcon: { fontSize: 26 },
  badgeLabel: { fontSize: 14, marginTop: 6 },

  button: {
    padding: 15,
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 8,
    alignItems: "center",
    ...Shadows.dp2,
  },
  buttonText: { color: "white", fontSize: 16, fontWeight: "600" },
});
