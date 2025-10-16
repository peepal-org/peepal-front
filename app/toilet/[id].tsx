import { useLocalSearchParams, useRouter } from "expo-router";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { toilets } from "../../data/toilets";

export default function ToiletDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const toilet = toilets.find((t) => t.id === id);

  if (!toilet) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.errorText}>🚽 Toilette introuvable</Text>
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => router.back()}
        >
          <Text style={styles.secondaryButtonText}>⬅ Retour</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
        {/* Image principale avec overlay */}
        <View style={styles.imageWrapper}>
          <Image source={{ uri: toilet.image }} style={styles.image} />
          <View style={styles.overlay}>
            <Text style={styles.overlayTitle}>{toilet.name}</Text>
          </View>
        </View>

        {/* Infos principales */}
        <View style={styles.infoRow}>
          <View
            style={[
              styles.badge,
              { backgroundColor: toilet.free ? "#4CAF50" : "#E53935" },
            ]}
          >
            <Text style={styles.badgeText}>
              {toilet.free ? "Gratuit" : "Payant"}
            </Text>
          </View>
          <View
            style={[
              styles.badge,
              { backgroundColor: toilet.accessible ? "#2196F3" : "#9E9E9E" },
            ]}
          >
            <Text style={styles.badgeText}>
              {toilet.accessible ? "Accessible ♿" : "Non accessible 🚫"}
            </Text>
          </View>
        </View>

        {/* Horaires */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🕓 Horaires</Text>
          <Text>Lundi - Dimanche : 7h00 - 22h00</Text>
        </View>

        {/* État */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>✨ État</Text>
          <Text>👍 Propre (dernière mise à jour : 2h)</Text>
        </View>

        {/* Commentaires */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💬 Commentaires</Text>
          <Text style={styles.comment}>
            - Très pratique près du métro République
          </Text>
          <Text style={styles.comment}>- Pas de papier ce matin 😅</Text>
        </View>

        {/* Actions */}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => alert("Bientôt : ajouter un commentaire ✍️")}
          >
            <Text style={styles.buttonText}>Ajouter un commentaire</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => router.back()}
          >
            <Text style={styles.secondaryButtonText}>⬅ Retour</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fafafa" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  imageWrapper: { position: "relative" },
  image: {
    width: "100%",
    height: 220,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  overlay: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  overlayTitle: { color: "#fff", fontSize: 22, fontWeight: "bold" },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginVertical: 16,
  },
  badge: {
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  badgeText: { color: "#fff", fontWeight: "600" },

  section: { marginHorizontal: 16, marginVertical: 10 },
  sectionTitle: { fontSize: 18, fontWeight: "700", marginBottom: 6 },
  comment: { marginBottom: 4, color: "#444" },

  buttonsContainer: { marginTop: 12, paddingHorizontal: 16 },
  button: {
    padding: 14,
    backgroundColor: "#007BFF",
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 8,
  },
  buttonText: { color: "white", fontSize: 16, fontWeight: "600" },

  secondaryButton: {
    padding: 14,
    backgroundColor: "#E0E0E0",
    borderRadius: 8,
    alignItems: "center",
  },
  secondaryButtonText: { color: "#333", fontSize: 16, fontWeight: "600" },

  errorText: { fontSize: 18, color: "#E53935", marginBottom: 12 },
});
