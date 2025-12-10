import { Colors } from "@/constants/Colors";
import { DEFAULT_TOILET_IMAGE, toilets } from "@/data/toilets";
import type { Toilet } from "@/types/Toilet";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ToiletDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  const toilet: Toilet | undefined = toilets.find((t) => t.id === id);

  if (!toilet) {
    return (
      <SafeAreaView
        style={[styles.center, { backgroundColor: theme.background }]}
      >
        <Text style={[styles.errorText, { color: theme.error }]}>
          🚽 Toilette introuvable
        </Text>
        <TouchableOpacity
          style={[
            styles.secondaryButton,
            { backgroundColor: theme.card, borderColor: theme.border },
          ]}
          onPress={() => router.back()}
        >
          <Text
            style={[styles.secondaryButtonText, { color: theme.textMuted }]}
          >
            ⬅ Retour
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // TODO: plus tard → utiliser de vraies données (adresse, horaires, statut, etc.)
  const isOpen = toilet.isOpen ?? true;
  const hoursLabel = "8h00 - 22h00";
  const accessibilityLabel = toilet.accessible
    ? "Accessible fauteuil roulant"
    : "Non accessible";

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      {/* HEADER */}
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.headerBack}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={[styles.headerBackIcon, { color: theme.text }]}>←</Text>
        </TouchableOpacity>

        <Text style={[styles.headerTitle, { color: theme.text }]}>
          Infos des toilettes
        </Text>

        {/* little "spacer" to cener te title */}
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
        {/* Image */}
        <Image
          source={{ uri: toilet.image ?? DEFAULT_TOILET_IMAGE }}
          style={styles.image}
        />

        {/* name & adress */}
        <View style={styles.mainInfo}>
          <Text style={[styles.toiletName, { color: theme.text }]}>
            {toilet.name}
          </Text>
          <Text style={[styles.toiletAddress, { color: theme.textMuted }]}>
            {/* placeholder pour l’instant */}
            Paris, France
          </Text>
        </View>

        {/* LIGNE : HORAIRES / STATUT / ACCESSIBILITÉ */}
        <View style={[styles.infoRow, { borderColor: theme.border }]}>
          <View style={styles.infoColumn}>
            <Text style={[styles.infoLabel, { color: theme.textMuted }]}>
              Horaires
            </Text>
            <Text style={[styles.infoValue, { color: theme.text }]}>
              {hoursLabel}
            </Text>
          </View>

          <View style={styles.infoColumn}>
            <Text style={[styles.infoLabel, { color: theme.textMuted }]}>
              Statut
            </Text>
            <Text
              style={[
                styles.infoValue,
                { color: isOpen ? theme.success : theme.error },
              ]}
            >
              {isOpen ? "Ouvert" : "Fermé"}
            </Text>
          </View>

          <View style={styles.infoColumn}>
            <Text style={[styles.infoLabel, { color: theme.textMuted }]}>
              Accessibilité
            </Text>
            <Text style={[styles.infoValue, { color: theme.text }]}>
              {accessibilityLabel}
            </Text>
          </View>
        </View>

        {/* Comment section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Avis & commentaires
          </Text>
          <Text style={{ color: theme.textMuted, fontSize: 14 }}>
            Les avis arrivent bientôt. Vous pourrez bientôt noter la propreté,
            l’accessibilité et partager votre expérience.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  // HEADER
  header: {
    height: 52,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerBack: {
    width: 32,
    alignItems: "flex-start",
  },
  headerBackIcon: {
    fontSize: 20,
    fontWeight: "500",
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
  },
  headerSpacer: {
    width: 32,
  },

  // IMAGE
  image: {
    width: "100%",
    height: 220,
  },

  // Title & address
  mainInfo: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  toiletName: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 4,
  },
  toiletAddress: {
    fontSize: 14,
  },

  // Infos (3 Columns)
  infoRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginTop: 8,
    gap: 16,
  },
  infoColumn: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "500",
  },
  // SECTIONS
  section: {
    marginHorizontal: 16,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
  },
  errorText: { fontSize: 18, marginBottom: 12 },
  secondaryButton: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 999,
    borderWidth: 1,
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: "500",
  },
});
