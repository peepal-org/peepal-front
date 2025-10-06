import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { toilets } from "../../data/toilets";

export default function ToiletDetailsScreen() {
  const { id } = useLocalSearchParams(); // récupère l'id passé dans l'URL
  const router = useRouter();

  // Cherche la toilette par ID
  const toilet = toilets.find((t) => t.id === id);

  if (!toilet) {
    return (
      <View style={styles.center}>
        <Text>Toilette introuvable ❌</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Image principale */}
      <Image source={{ uri: toilet.image }} style={styles.image} />

      {/* Nom */}
      <Text style={styles.title}>{toilet.name}</Text>

      {/* Infos principales */}
      <View style={styles.infoRow}>
        <Text style={styles.tag}>{toilet.free ? "🟢 Gratuit" : "🔴 Payant"}</Text>
        <Text style={styles.tag}>{toilet.accessible ? "♿ Accessible" : "🚫 Non accessible"}</Text>
      </View>

      {/* Horaires (mock) */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Horaires</Text>
        <Text>Lundi - Dimanche : 7h00 - 22h00</Text>
      </View>

      {/* État / Propreté */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>État</Text>
        <Text>👍 Propre (dernière mise à jour : 2h)</Text>
      </View>

      {/* Commentaires (mock pour l’instant) */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Commentaires</Text>
        <Text>- "Très pratique près du métro République"</Text>
        <Text>- "Pas de papier ce matin 😅"</Text>
      </View>

      {/* Bouton contribution */}
      <TouchableOpacity 
        style={styles.button}
        onPress={() => alert("Bientôt : ajouter un commentaire ✍️")}
      >
        <Text style={styles.buttonText}>Ajouter un commentaire</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.button, { backgroundColor: "gray" }]}
        onPress={() => router.back()}
      >
        <Text style={styles.buttonText}>⬅ Retour</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  image: { width: "100%", height: 200 },
  title: { fontSize: 24, fontWeight: "bold", margin: 16 },

  infoRow: { flexDirection: "row", justifyContent: "space-around", marginBottom: 16 },
  tag: { fontSize: 16, fontWeight: "500" },

  section: { marginHorizontal: 16, marginVertical: 8 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 4 },

  button: {
    margin: 16,
    padding: 14,
    backgroundColor: "#007BFF",
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: { color: "white", fontSize: 16, fontWeight: "600" },
});
