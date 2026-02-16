import { Colors } from "@/constants/Colors";
import { DEFAULT_TOILET_IMAGE, DEFAULT_USER_AVATAR } from "@/constants/Images";
import { useToiletDetailViewModel } from "@/features/toilet/useToiletDetailViewModel";
import { Ionicons } from "@expo/vector-icons";
import React, { useCallback } from "react";
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
import { useQueryClient } from "@tanstack/react-query";
import { useFocusEffect } from "@react-navigation/native";

export default function ToiletDetailsScreen() {
  const toiletViewModel = useToiletDetailViewModel();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const queryClient = useQueryClient();

  useFocusEffect(
    useCallback(() => {
      queryClient.invalidateQueries({ queryKey: ['toilet-detail', toiletViewModel.toilet] });
    }, [queryClient, toiletViewModel.toilet])
  );

  if (toiletViewModel.isLoading) {
    return (
      <SafeAreaView style={[styles.center, { backgroundColor: theme.background }]}>
        <Text style={{ color: theme.textMuted }}>Chargement…</Text>
      </SafeAreaView>
    );
  }

  if (!toiletViewModel.toilet) {
    return (
      <SafeAreaView style={[styles.center, { backgroundColor: theme.background }]}>
        <Text style={[styles.errorText, { color: theme.error }]}>
          🚽 Toilette introuvable
        </Text>
        <TouchableOpacity
          style={[styles.secondaryButton, { backgroundColor: theme.card, borderColor: theme.border }]}
          onPress={toiletViewModel.goBack}
        >
          <Text style={[styles.secondaryButtonText, { color: theme.textMuted }]}>
            ⬅ Retour
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const isOpen = toiletViewModel.toilet.isOpen ?? true;
  const hoursLabel = toiletViewModel.toilet.openingHours ?? "Horaires inconnus";
  const accessibilityLabel = toiletViewModel.toilet.accessible ? "Accessible UFR" : "Non accessible";

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={toiletViewModel.goBack} style={styles.headerBack}>
          <Text style={[styles.headerBackIcon, { color: theme.text }]}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>
          Infos des toilettes
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
        <Image
          source={{ uri: toiletViewModel.toilet.image ?? DEFAULT_TOILET_IMAGE }}
          style={styles.image}
        />

        <View style={styles.mainInfo}>
          <Text style={[styles.toiletName, { color: theme.text }]}>
            {toiletViewModel.toilet.name}
          </Text>
          <Text style={[styles.toiletAddress, { color: theme.textMuted }]}>
            {toiletViewModel.address}
          </Text>

          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={[styles.goButton, { backgroundColor: theme.primary }]}
              onPress={toiletViewModel.openInMaps}
            >
              <Text style={[styles.goButtonText, { color: theme.card }]}>
                Y aller 🧭
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.goButton, { backgroundColor: theme.error }]}
              onPress={toiletViewModel.goToReport}
            >
              <Text style={[styles.goButtonText, { color: theme.card }]}>
                Signaler ⚠️
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.infoRow, { borderColor: theme.border }]}>
          <View style={styles.infoColumn}>
            <Text style={[styles.infoLabel, { color: theme.textMuted }]}>Horaires</Text>
            <Text style={[styles.infoValue, { color: theme.text }]}>{hoursLabel}</Text>
          </View>
          <View style={styles.infoColumn}>
            <Text style={[styles.infoLabel, { color: theme.textMuted }]}>Statut</Text>
            <Text style={[styles.infoValue, { color: isOpen ? theme.success : theme.error }]}>
              {isOpen ? "Ouvert" : "Fermé"}
            </Text>
          </View>
          <View style={styles.infoColumn}>
            <Text style={[styles.infoLabel, { color: theme.textMuted }]}>Accessibilité</Text>
            <Text style={[styles.infoValue, { color: theme.text }]}>{accessibilityLabel}</Text>
          </View>
        </View>

        {toiletViewModel.isAdmin && (
          <View style={styles.adminButtonsContainer}>
            {toiletViewModel.toilet?.statut === "waiting" && (
              <>
                <TouchableOpacity
                  style={[styles.adminButton, { backgroundColor: "#ef4444" }]}
                  onPress={toiletViewModel.handleRejectToilet}
                >
                  <Text style={styles.adminButtonText}>Rejeter</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.adminButton, { backgroundColor: "#22c55e" }]}
                  onPress={toiletViewModel.handleAcceptToilet}
                >
                  <Text style={styles.adminButtonText}>Accepter</Text>
                </TouchableOpacity>
              </>
            )}

            <TouchableOpacity
              style={[styles.adminButton, { backgroundColor: "#6b7280" }]}
              onPress={toiletViewModel.handleDeleteToilet}
            >
              <Text style={styles.adminButtonText}>Supprimer</Text>
            </TouchableOpacity>
          </View>
        )}
        
        <View style={styles.section}>
          <View style={styles.ratingsHeaderRow}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Avis & commentaires
            </Text>
            <TouchableOpacity
              onPress={toiletViewModel.goToRate}
              style={styles.rateButton}
            >
              <Text style={[styles.rateButtonText, { color: theme.primary }]}>
                Noter ces toilettes
              </Text>
            </TouchableOpacity>
          </View>

          {toiletViewModel.ratingCount === 0 ? (
            <View style={{ marginTop: 12 }}>
              <Text style={{ color: theme.textMuted, fontSize: 14 }}>
                Pas encore d'avis pour ces toilettes.
              </Text>
              <Text style={{ color: theme.textMuted, fontSize: 14 }}>
                Sois le·la premier·ère à partager ton expérience !
              </Text>
            </View>
          ) : (
            <>
              <View style={styles.ratingSummaryRow}>
                <View style={styles.ratingScoreColumn}>
                  <Text style={[styles.ratingAverage, { color: theme.text }]}>
                    {toiletViewModel.averageRating!.toFixed(1)}
                  </Text>
                  <View style={styles.starsRow}>
                    {Array.from({ length: 5 }).map((_, index) => {
                      const starValue = index + 1;
                      const filled =
                        toiletViewModel.averageRating !== null &&
                        starValue <= Math.round(toiletViewModel.averageRating);
                      return (
                        <Text
                          key={starValue}
                          style={[styles.star, { color: filled ? "#FBBF24" : theme.textMuted }]}
                        >
                          {filled ? "★" : "☆"}
                        </Text>
                      );
                    })}
                  </View>
                  <Text style={{ color: theme.textMuted, fontSize: 13 }}>
                    {toiletViewModel.ratingCount} avis
                  </Text>
                </View>
              </View>

              {toiletViewModel.comments.map((review) => (
                <View key={review.id} style={styles.reviewCard}>
                  <View style={styles.reviewHeaderRow}>
                    <View style={styles.reviewAvatar}>
                      <Image
                        source={{ uri: review.user.photoUrl || DEFAULT_USER_AVATAR }}
                        style={styles.reviewAvatarImage}
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.reviewAuthor, { color: theme.text }]}>
                        {review.user.name}
                      </Text>
                      <Text style={{ color: theme.textMuted, fontSize: 12 }}>
                        {review.dateLabel ?? "Date inconnue"}
                      </Text>
                    </View>

                    <View style={{ flexDirection: "row" }}>
                      {Array.from({ length: 5 }).map((_, index) => {
                        const starValue = index + 1;
                        const filled = starValue <= review.rating;
                        return (
                          <Text
                            key={starValue}
                            style={[styles.starSmall, { color: filled ? "#FBBF24" : theme.textMuted }]}
                          >
                            {filled ? "★" : "☆"}
                          </Text>
                        );
                      })}
                    </View>
                  </View>

                  <View style={styles.commentTextContainer}>
                    <Text style={[styles.reviewText, { color: theme.text, flex: 1 }]}>
                      {review.content}
                    </Text>
                    {toiletViewModel.isAdmin && (
                      <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => toiletViewModel.handleDeleteComment(Number(review.id))}
                      >
                        <Ionicons name="trash-outline" size={20} color="#ef4444" />
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              ))}
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    height: 52,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerBack: { width: 32, alignItems: "flex-start" },
  headerBackIcon: { fontSize: 20, fontWeight: "500" },
  headerTitle: { flex: 1, textAlign: "center", fontSize: 16, fontWeight: "600" },
  headerSpacer: { width: 32 },
  image: { width: "100%", height: 220 },
  mainInfo: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 },
  toiletName: { fontSize: 22, fontWeight: "700", marginBottom: 4 },
  toiletAddress: { fontSize: 14, marginBottom: 8 },
  buttonsContainer: { flexDirection: "row", gap: 12, marginTop: 12 },
  goButton: { flex: 1, paddingVertical: 6, paddingHorizontal: 14, borderRadius: 999, alignItems: "center" },
  goButtonText: { fontSize: 14, fontWeight: "600" },
  infoRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginTop: 8,
    gap: 16,
  },
  infoColumn: { flex: 1 },
  infoLabel: { fontSize: 12, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 },
  infoValue: { fontSize: 14, fontWeight: "500" },
  adminButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 16,
    gap: 8,
  },
  adminButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  adminButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
    textAlign: "center",
  },
  section: { marginHorizontal: 16, marginTop: 24 },
  sectionTitle: { fontSize: 18, fontWeight: "700", marginBottom: 8 },
  errorText: { fontSize: 18, marginBottom: 12 },
  secondaryButton: { paddingVertical: 12, paddingHorizontal: 18, borderRadius: 999, borderWidth: 1 },
  secondaryButtonText: { fontSize: 14, fontWeight: "500" },
  ratingsHeaderRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  rateButton: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, backgroundColor: "rgba(0,0,0,0.03)" },
  rateButtonText: { fontSize: 13, fontWeight: "500" },
  ratingSummaryRow: { flexDirection: "row", alignItems: "center", marginTop: 12, marginBottom: 8 },
  ratingScoreColumn: { flexDirection: "column", alignItems: "flex-start" },
  ratingAverage: { fontSize: 28, fontWeight: "700" },
  starsRow: { flexDirection: "row", marginVertical: 4, gap: 2 },
  star: { fontSize: 18 },
  reviewCard: {
    marginTop: 12,
    paddingVertical: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(0,0,0,0.08)",
  },
  reviewHeaderRow: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  reviewAuthor: { fontSize: 14, fontWeight: "600" },
  starSmall: { fontSize: 14 },
  reviewText: { fontSize: 14, lineHeight: 20 },
  reviewAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(0,0,0,0.04)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  reviewAvatarImage: { width: 36, height: 36, borderRadius: 18 },
  commentTextContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  deleteButton: {
    paddingTop: 2,
  },
});