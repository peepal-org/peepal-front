import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from "react-native";

export default function ProfileScreen() {
  return (
    <ScrollView style={styles.container}>
      {/* Header profil */}
      <View style={styles.header}>
        <Image
          source={{ uri: "https://i.pravatar.cc/150?img=12" }} // avatar mock
          style={styles.avatar}
        />
        <Text style={styles.username}>Jean Dupont</Text>
        <Text style={styles.subtitle}>Explorateur urbain 🚀</Text>
      </View>

      {/* Stats utilisateur */}
      <View style={styles.stats}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>12</Text>
          <Text style={styles.statLabel}>Commentaires</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>5</Text>
          <Text style={styles.statLabel}>Signalements</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>3</Text>
          <Text style={styles.statLabel}>Badges</Text>
        </View>
      </View>

      {/* Section Badges */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Mes Badges</Text>
        <View style={styles.badgeRow}>
          <View style={styles.badge}>
            <Text style={styles.badgeIcon}>⭐</Text>
            <Text style={styles.badgeLabel}>Nouveau</Text>
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeIcon}>💬</Text>
            <Text style={styles.badgeLabel}>Commentateur</Text>
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeIcon}>🚻</Text>
            <Text style={styles.badgeLabel}>Découvreur</Text>
          </View>
        </View>
      </View>

      {/* Boutons actions */}
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Modifier mon profil</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, { backgroundColor: "red" }]}>
        <Text style={styles.buttonText}>Déconnexion</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: { alignItems: "center", marginTop: 40 },
  avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 10 },
  username: { fontSize: 22, fontWeight: "bold" },
  subtitle: { fontSize: 14, color: "gray" },

  stats: { flexDirection: "row", justifyContent: "space-around", marginTop: 30 },
  statBox: { alignItems: "center" },
  statNumber: { fontSize: 20, fontWeight: "bold" },
  statLabel: { fontSize: 14, color: "gray" },

  section: { marginTop: 30, paddingHorizontal: 20 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  badgeRow: { flexDirection: "row", justifyContent: "space-around" },

  badge: {
    alignItems: "center",
    backgroundColor: "#f2f2f2",
    padding: 15,
    borderRadius: 12,
    width: 100,
  },
  badgeIcon: { fontSize: 26 },
  badgeLabel: { fontSize: 14, marginTop: 6 },

  button: {
    backgroundColor: "#007BFF",
    padding: 15,
    margin: 20,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: { color: "white", fontSize: 16, fontWeight: "600" },
});
