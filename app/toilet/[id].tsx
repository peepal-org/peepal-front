import { Colors } from "@/constants/Colors";
import { DEFAULT_TOILET_IMAGE, DEFAULT_USER_AVATAR } from "@/constants/Images";
import { fetchComments } from "@/functions/api/comments";
import { fetchToiletById, updateToilet } from "@/functions/api/toilet";
import { mapApiComment } from "@/functions/mappers/comments";
import { mapApiToilet } from "@/functions/mappers/toilet";
import { Toilet } from "@/types/ui/Toilet";
import { getAddressFromCoords } from "@/utils/geocoding";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
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
import { getUserProfile } from "@/auth/authService";
import type { ApiUser } from "@/types/api/ApiUser";

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
  const [userProfile, setUserProfile] = useState<ApiUser | null>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profile = await getUserProfile();
        setUserProfile(profile);
      } catch (error) {
        console.error(error);
      }
    };
    loadProfile();
  }, []);

  const toiletIdNum = Number(id);

  const { data: apiToilet, isLoading: toiletLoading } = useQuery({
    queryKey: ["toilets", toiletIdNum],
    queryFn: () => fetchToiletById(toiletIdNum),
    enabled: Number.isFinite(toiletIdNum),
  });

  const toilet: Toilet | undefined = apiToilet ? mapApiToilet(apiToilet) : undefined;

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

  if (toiletLoading) {
    return (
      <SafeAreaView style={[styles.center, { backgroundColor: theme.background }]}>
        <Text style={{ color: theme.textMuted }}>Chargement…</Text>
      </SafeAreaView>
    );
  }

  if (!toilet) {
    return (
      <SafeAreaView style={[styles.center, { backgroundColor: theme.background }]}>
        <Text style={[styles.errorText, { color: theme.error }]}>🚽 Toilette introuvable</Text>
        <TouchableOpacity
          style={[styles.secondaryButton, { backgroundColor: theme.card, borderColor: theme.border }]}
          onPress={() => router.back()}
        >
          <Text style={[styles.secondaryButtonText, { color: theme.textMuted }]}>⬅ Retour</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const isOpen = toilet.isOpen ?? true;
  const hoursLabel = toilet.openingHours ?? "Horaires inconnus";
  const accessibilityLabel = toilet.accessible ? "Accessible UFR" : "Non accessible";

  const handleUpdateStatus = async (status: "accepted" | "rejected") => {
    if (!userProfile || userProfile.type !== "admin") return;
    
    try {
      await updateToilet(toilet.id, { status });
      queryClient.invalidateQueries(["toilets", toilet.id]);
      
      if (status === "accepted") {
        Alert.alert("Succès", "Toilettes acceptées avec succès");
      } else if (status === "rejected") {
        Alert.alert("Succès", "Toilettes rejetées avec succès");
      }
    } catch (error) {
      Alert.alert("Erreur", "Une erreur s'est produite");
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerBack}>
          <Text style={[styles.headerBackIcon, { color: theme.text }]}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Infos des toilettes</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
        <Image source={{ uri: toilet.image ?? DEFAULT_TOILET_IMAGE }} style={styles.image} />

        <View style={styles.mainInfo}>
          <Text style={[styles.toiletName, { color: theme.text }]}>{toilet.name}</Text>
          <Text style={[styles.toiletAddress, { color: theme.textMuted }]}>{address}</Text>
          <TouchableOpacity style={[styles.goButton, { backgroundColor: theme.primary }]} onPress={() => openInExternalMaps(toilet)}>
            <Text style={[styles.goButtonText, { color: theme.card }]}>Y aller 🧭</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.infoRow, { borderColor: theme.border }]}>
          <View style={styles.infoColumn}>
            <Text style={[styles.infoLabel, { color: theme.textMuted }]}>Horaires</Text>
            <Text style={[styles.infoValue, { color: theme.text }]}>{hoursLabel}</Text>
          </View>
          <View style={styles.infoColumn}>
            <Text style={[styles.infoLabel, { color: theme.textMuted }]}>Statut</Text>
            <Text style={[styles.infoValue, { color: isOpen ? theme.success : theme.error }]}>{isOpen ? "Ouvert" : "Fermé"}</Text>
          </View>
          <View style={styles.infoColumn}>
            <Text style={[styles.infoLabel, { color: theme.textMuted }]}>Accessibilité</Text>
            <Text style={[styles.infoValue, { color: theme.text }]}>{accessibilityLabel}</Text>
          </View>
        </View>

        {/* Section des commentaires */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Avis & commentaires</Text>
          {ratingCount === 0 ? (
            <Text style={{ color: theme.textMuted, fontSize: 14, marginTop: 12 }}>Pas encore d'avis pour ces toilettes.</Text>
          ) : (
            <>
              <View style={styles.ratingSummaryRow}>
                <Text style={{ color: theme.text, fontWeight: "600", marginBottom: 8 }}>
                  Note moyenne : {averageRating?.toFixed(1) ?? "-"} / 5 ({ratingCount} avis)
                </Text>
              </View>
              {toiletComments.map((review) => (
                <View key={review.id} style={styles.reviewCard}>
                  <View style={styles.reviewHeaderRow}>
                    <View style={styles.reviewAvatar}>
                      <Image source={{ uri: review.user.photoUrl || DEFAULT_USER_AVATAR }} style={styles.reviewAvatarImage} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.reviewAuthor, { color: theme.text }]}>{review.user.name}</Text>
                      <Text style={{ color: theme.textMuted, fontSize: 12 }}>{review.dateLabel ?? "Date inconnue"}</Text>
                    </View>
                    <View style={{ flexDirection: "row" }}>
                      {Array.from({ length: 5 }).map((_, index) => {
                        const starValue = index + 1;
                        const filled = starValue <= review.rating;
                        return <Text key={starValue} style={[styles.starSmall, { color: filled ? "#FBBF24" : theme.textMuted }]}>{filled ? "★" : "☆"}</Text>;
                      })}
                    </View>
                  </View>
                  <Text style={[styles.reviewText, { color: theme.text }]}>{review.content}</Text>
                </View>
              ))}
            </>
          )}
        </View>

        {/* Boutons admin */}
        {userProfile?.type === "admin" && (
          <View style={styles.adminButtonsContainer}>
            <TouchableOpacity
              style={[styles.adminButton, { backgroundColor: "#ff4444" }]}
              onPress={() => handleUpdateStatus("rejected")}
            >
              <Text style={styles.adminButtonText}>Rejeter</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.adminButton, { backgroundColor: "#4CAF50" }]}
              onPress={() => handleUpdateStatus("accepted")}
            >
              <Text style={styles.adminButtonText}>Accepter</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.adminButton, { backgroundColor: "#888" }]}>
              <Text style={styles.adminButtonText}>Supprimer</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: { height: 52, flexDirection: "row", alignItems: "center", paddingHorizontal: 16, borderBottomWidth: StyleSheet.hairlineWidth },
  headerBack: { width: 32, alignItems: "flex-start" },
  headerBackIcon: { fontSize: 20, fontWeight: "500" },
  headerTitle: { flex: 1, textAlign: "center", fontSize: 16, fontWeight: "600" },
  headerSpacer: { width: 32 },
  image: { width: "100%", height: 220 },
  mainInfo: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 },
  toiletName: { fontSize: 22, fontWeight: "700", marginBottom: 4 },
  toiletAddress: { fontSize: 14, marginBottom: 8 },
  goButton: { alignSelf: "flex-start", paddingVertical: 6, paddingHorizontal: 14, borderRadius: 999 },
  goButtonText: { fontSize: 14, fontWeight: "600" },
  infoRow: { flexDirection: "row", paddingHorizontal: 16, paddingVertical: 16, borderTopWidth: StyleSheet.hairlineWidth, borderBottomWidth: StyleSheet.hairlineWidth, marginTop: 8, gap: 16 },
  infoColumn: { flex: 1 },
  infoLabel: { fontSize: 12, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 },
  infoValue: { fontSize: 14, fontWeight: "500" },
  section: { marginHorizontal: 16, marginTop: 24 },
  sectionTitle: { fontSize: 18, fontWeight: "700", marginBottom: 8 },
  adminButtonsContainer: { flexDirection: "row", justifyContent: "space-around", alignItems: "center", paddingVertical: 20 },
  adminButton: { flex: 1, marginHorizontal: 6, paddingVertical: 12, borderRadius: 8, alignItems: "center" },
  adminButtonText: { color: "#fff", fontWeight: "600", fontSize: 14, textAlign: "center" },
  secondaryButton: { paddingVertical: 12, paddingHorizontal: 18, borderRadius: 999, borderWidth: 1 },
  secondaryButtonText: { fontSize: 14, fontWeight: "500" },
  errorText: { fontSize: 18, marginBottom: 12 },
  reviewCard: { marginTop: 12, paddingVertical: 10, borderTopWidth: StyleSheet.hairlineWidth, borderColor: "rgba(0,0,0,0.08)" },
  reviewHeaderRow: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  reviewAuthor: { fontSize: 14, fontWeight: "600" },
  reviewText: { fontSize: 14, lineHeight: 20 },
  reviewAvatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: "rgba(0,0,0,0.04)", alignItems: "center", justifyContent: "center", marginRight: 8 },
  reviewAvatarImage: { width: 36, height: 36, borderRadius: 18 },
  starSmall: { fontSize: 14 },
  ratingSummaryRow: { marginVertical: 8 },
});