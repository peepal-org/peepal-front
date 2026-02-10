import { Colors } from "@/constants/Colors";
import { DEFAULT_TOILET_IMAGE, DEFAULT_USER_AVATAR } from "@/constants/Images";
import { fetchComments } from "@/functions/api/comments";
import { fetchToiletById } from "@/functions/api/toilet";
import { mapApiComment } from "@/functions/mappers/comments";
import { mapApiToilet } from "@/functions/mappers/toilet";
import { Toilet } from "@/types/ui/Toilet";
import { getAddressFromCoords } from "@/utils/geocoding";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";

import {
  Image,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function openInExternalMaps(toilet: Toilet) {
  const lat = toilet.latitude;
  const lon = toilet.longitude;
  const label = encodeURIComponent(toilet.name);

  if (Platform.OS === "ios") {
    Linking.openURL(`http://maps.apple.com/?ll=${lat},${lon}&q=${label}`);
    return;
  }
  Linking.openURL(`geo:${lat},${lon}?q=${lat},${lon}(${label})`);
}

export default function ToiletDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  const [address, setAddress] = useState("Chargement de l'adresse…");

  const toiletIdNum = Number(id);

  const { data: apiToilet, isLoading: toiletLoading } = useQuery({
    queryKey: ["toilets", toiletIdNum],
    queryFn: () => fetchToiletById(toiletIdNum),
    enabled: Number.isFinite(toiletIdNum),
  });

  const toilet: Toilet | undefined = apiToilet
    ? mapApiToilet(apiToilet)
    : undefined;

  const { data: toiletComments = [] } = useQuery({
    queryKey: ["comments", toiletIdNum],
    queryFn: fetchComments,
    enabled: Number.isFinite(toiletIdNum),
    select: (apiComments) =>
      apiComments
        .filter((c) => c.toilet?.id === toiletIdNum)
        .map(mapApiComment),
  });

  const ratingCount = toiletComments.length;
  const averageRating =
    ratingCount === 0
      ? null
      : toiletComments.reduce((sum, c) => sum + c.rating, 0) / ratingCount;

  const lat = toilet?.latitude;
  const lon = toilet?.longitude;

  useEffect(() => {
    if (lat == null || lon == null) return;

    let cancelled = false;

    (async () => {
      const addr = await getAddressFromCoords(lat, lon);
      if (!cancelled) setAddress(addr);
    })();

    return () => {
      cancelled = true;
    };
  }, [lat, lon]);

  // Loader simple
  if (toiletLoading) {
    return (
      <SafeAreaView
        style={[styles.center, { backgroundColor: theme.background }]}
      >
        <Text style={{ color: theme.textMuted }}>Chargement…</Text>
      </SafeAreaView>
    );
  }

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

  const isOpen = toilet.isOpen ?? true;
  const hoursLabel = toilet.openingHours ?? "Horaires inconnus";
  const accessibilityLabel = toilet.accessible
    ? "Accessible UFR"
    : "Non accessible";

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.headerBack}
        >
          <Text style={[styles.headerBackIcon, { color: theme.text }]}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>
          Infos des toilettes
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
        <Image
          source={{ uri: toilet.image ?? DEFAULT_TOILET_IMAGE }}
          style={styles.image}
        />

        <View style={styles.mainInfo}>
          <Text style={[styles.toiletName, { color: theme.text }]}>
            {toilet.name}
          </Text>
          <Text style={[styles.toiletAddress, { color: theme.textMuted }]}>
            {address}
          </Text>

          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={[styles.goButton, { backgroundColor: theme.primary }]}
              onPress={() => openInExternalMaps(toilet)}
            >
              <Text style={[styles.goButtonText, { color: theme.card }]}>
                Y aller 🧭
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.goButton, { backgroundColor: theme.error }]}
              onPress={() => router.push({ pathname: '/contribute/report-issue', params: { toiletId: toiletIdNum } })}
            >
              <Text style={[styles.goButtonText, { color: theme.card }]}>
                Signaler ⚠️
              </Text>
            </TouchableOpacity>
          </View>
        </View>

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

        <View style={styles.section}>
          <View style={styles.ratingsHeaderRow}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Avis & commentaires
            </Text>
            <TouchableOpacity
              onPress={() => router.push(`/toilet/${toilet.id}/rate`)}
              style={styles.rateButton}
            >
              <Text style={[styles.rateButtonText, { color: theme.primary }]}>
                Noter ces toilettes
              </Text>
            </TouchableOpacity>
          </View>

          {ratingCount === 0 ? (
            <View style={{ marginTop: 12 }}>
              <Text style={{ color: theme.textMuted, fontSize: 14 }}>
                Pas encore d’avis pour ces toilettes.
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
                    {averageRating!.toFixed(1)}
                  </Text>
                  <View style={styles.starsRow}>
                    {Array.from({ length: 5 }).map((_, index) => {
                      const starValue = index + 1;
                      const filled =
                        averageRating !== null &&
                        starValue <= Math.round(averageRating);
                      return (
                        <Text
                          key={starValue}
                          style={[
                            styles.star,
                            { color: filled ? "#FBBF24" : theme.textMuted },
                          ]}
                        >
                          {filled ? "★" : "☆"}
                        </Text>
                      );
                    })}
                  </View>
                  <Text style={{ color: theme.textMuted, fontSize: 13 }}>
                    {ratingCount} avis
                  </Text>
                </View>
              </View>

              {toiletComments.map((review) => (
                <View key={review.id} style={styles.reviewCard}>
                  <View style={styles.reviewHeaderRow}>
                    <View style={styles.reviewAvatar}>
                      <Image
                        source={{
                          uri: review.user.photoUrl || DEFAULT_USER_AVATAR,
                        }}
                        style={styles.reviewAvatarImage}
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text
                        style={[styles.reviewAuthor, { color: theme.text }]}
                      >
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
                            style={[
                              styles.starSmall,
                              { color: filled ? "#FBBF24" : theme.textMuted },
                            ]}
                          >
                            {filled ? "★" : "☆"}
                          </Text>
                        );
                      })}
                    </View>
                  </View>

                  <Text style={[styles.reviewText, { color: theme.text }]}>
                    {review.content}
                  </Text>
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
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
  },
  headerSpacer: { width: 32 },

  image: { width: "100%", height: 220 },

  mainInfo: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 },
  toiletName: { fontSize: 22, fontWeight: "700", marginBottom: 4 },
  toiletAddress: { fontSize: 14, marginBottom: 8 },

  buttonsContainer: {
    flexDirection: "row",
    gap: 12,
    marginTop: 12,
  },
  goButton: {
    flex: 1,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 999,
    alignItems: "center",
  },
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
  infoLabel: {
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  infoValue: { fontSize: 14, fontWeight: "500" },

  section: { marginHorizontal: 16, marginTop: 24 },
  sectionTitle: { fontSize: 18, fontWeight: "700", marginBottom: 8 },

  errorText: { fontSize: 18, marginBottom: 12 },
  secondaryButton: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 999,
    borderWidth: 1,
  },
  secondaryButtonText: { fontSize: 14, fontWeight: "500" },

  ratingsHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rateButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "rgba(0,0,0,0.03)",
  },
  rateButtonText: { fontSize: 13, fontWeight: "500" },

  ratingSummaryRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    marginBottom: 8,
  },
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
  reviewHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
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
  reviewAvatarEmoji: { fontSize: 20 },
});
