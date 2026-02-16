import { getUserProfile } from "@/auth/authService";
import { DEFAULT_TOILET_IMAGE, DEFAULT_USER_AVATAR } from "@/constants/Images";
import React, { useState, useEffect, useCallback } from "react";
import { View, Text, TouchableOpacity, SectionList, FlatList, StyleSheet, Image, Alert } from "react-native";
import { useRouter, useLocalSearchParams, useFocusEffect } from "expo-router";
import PageHeader from "../../components/header";
import { Statut } from "../../types/Statut";
import { fetchComments } from "@/functions/api/comments";
import { fetchToilets } from "@/functions/api/toilet";
import { mapApiComment } from "@/functions/mappers/comments";
import { mapApiToilet } from "@/functions/mappers/toilet";
import type { ApiUser } from "@/types/api/ApiUser";
import type { Comment } from "@/types/ui/Comment";
import type { Toilet } from "@/types/ui/Toilet";
import { useQuery } from "@tanstack/react-query";
import { DEFAULT_USER_AVATAR, DEFAULT_TOILET_IMAGE } from "@/constants/Images";
import { getUserProfile } from "@/auth/authService";

export default function ContributionsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const queryClient = useQueryClient();
  const [userProfile, setUserProfile] = useState<ApiUser | null>(null);


  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profile = await getUserProfile();
        setUserProfile(profile);
      } catch (error) {
        console.error("Erreur lors du chargement du profil:", error);
      }
    };
    loadProfile();
  }, []);

  // Rafraîchir les données à chaque fois que la page devient active
  useFocusEffect(
    useCallback(() => {
      // Invalider toutes les queries pour forcer un refetch
      queryClient.invalidateQueries({ queryKey: ["myComments"] });
      queryClient.invalidateQueries({ queryKey: ["myToilets"] });
      queryClient.invalidateQueries({ queryKey: ["allComments"] });
      queryClient.invalidateQueries({ queryKey: ["allToilets"] });
    }, [queryClient])
  );

  // Déterminer le scope (personal ou all) depuis les paramètres
  const scope = (params.scope as string) || "personal";

  // Contributions personnelles
  const { data: myComments = [] } = useQuery({
    queryKey: ["myComments", userProfile?.id],
    queryFn: fetchComments,
    select: (apiComments) => {
      return apiComments
        .filter((comment) => comment.user.id === userProfile?.id)
        .map(mapApiComment);
    },
    enabled: !!userProfile && scope === "personal",
  });

  const { data: myToilets = [] } = useQuery({
    queryKey: ["myToilets", userProfile?.id],
    queryFn: fetchToilets,
    select: (apiToilets) => {
      return apiToilets
        .filter((toilet) => toilet.createdBy?.id === userProfile?.id)
        .map(mapApiToilet)
        .filter((toilet) => toilet.type);
    },
    enabled: !!userProfile && scope === "personal",
  });

  // Toutes les contributions (pour les admins uniquement)
  const { data: allComments = [] } = useQuery({
    queryKey: ["allComments"],
    queryFn: fetchComments,
    select: (apiComments) => {
      return apiComments.map(mapApiComment);
    },
    enabled: !!userProfile && userProfile?.type === "admin" && scope === "all",
  });

  const { data: allToilets = [] } = useQuery({
    queryKey: ["allToilets"],
    queryFn: fetchToilets,
    select: (apiToilets) => {
      return apiToilets
        .map(mapApiToilet)
        .filter((toilet) => toilet.type);
    },
    enabled: !!userProfile && userProfile?.type === "admin" && scope === "all",
  });

  // Sélectionner les bonnes données selon le scope
  const userComments = scope === "all" ? allComments : myComments;
  const userToilets = scope === "all" ? allToilets : myToilets;

  const data = {
    commentaires: userComments,
    signalements: [
      {
        id: "28",
        title: "Pipi express",
        address: "897 Pine St",
        image: "https://picsum.photos/200/200?random=5",
      },
      {
        id: "29",
        title: "Pipi express",
        address: "897 Pine St",
        image: "https://picsum.photos/200/200?random=5",
      },
      {
        id: "30",
        title: "Pipi express",
        address: "897 Pine St",
        image: "https://picsum.photos/200/200?random=5",
      },
      {
        id: "31",
        title: "Pipi express",
        address: "897 Pine St",
        image: "https://picsum.photos/200/200?random=5",
      },
      {
        id: "32",
        title: "Pipi express",
        address: "897 Pine St",
        image: "https://picsum.photos/200/200?random=5",
      },
      {
        id: "33",
        title: "Pipi express",
        address: "897 Pine St",
        image: "https://picsum.photos/200/200?random=5",
      },
      {
        id: "34",
        title: "Pipi express",
        address: "897 Pine St",
        image: "https://picsum.photos/200/200?random=5",
      },
      {
        id: "35",
        title: "Pipi express",
        address: "897 Pine St",
        image: "https://picsum.photos/200/200?random=5",
      },
      {
        id: "36",
        title: "Pipi express",
        address: "897 Pine St",
        image: "https://picsum.photos/200/200?random=5",
      },
      {
        id: "37",
        title: "Pipi express",
        address: "897 Pine St",
        image: "https://picsum.photos/200/200?random=5",
      },
      {
        id: "38",
        title: "Pipi express",
        address: "897 Pine St",
        image: "https://picsum.photos/200/200?random=5",
      },
      {
        id: "39",
        title: "Pipi express",
        address: "897 Pine St",
        image: "https://picsum.photos/200/200?random=5",
      },
      {
        id: "40",
        title: "Pipi express",
        address: "897 Pine St",
        image: "https://picsum.photos/200/200?random=5",
      },
      {
        id: "41",
        title: "Pipi express",
        address: "897 Pine St",
        image: "https://picsum.photos/200/200?random=5",
      },
      {
        id: "42",
        title: "Pipi express",
        address: "897 Pine St",
        image: "https://picsum.photos/200/200?random=5",
      },
      {
        id: "43",
        title: "Pipi express",
        address: "897 Pine St",
        image: "https://picsum.photos/200/200?random=5",
      },
      {
        id: "44",
        title: "Pipi express",
        address: "897 Pine St",
        image: "https://picsum.photos/200/200?random=5",
      },
      {
        id: "45",
        title: "Pipi express",
        address: "897 Pine St",
        image: "https://picsum.photos/200/200?random=5",
      },
      {
        id: "46",
        title: "Pipi express",
        address: "897 Pine St",
        image: "https://picsum.photos/200/200?random=5",
      },
      {
        id: "47",
        title: "Pipi express",
        address: "897 Pine St",
        image: "https://picsum.photos/200/200?random=5",
      },
    ],
  };

  const tabs = [
    { id: "ajoute" as const, label: "Ajoutés" },
    { id: "commentaires" as const, label: "Commentaires" },
    { id: "signalements" as const, label: "Signalements" },
  ];

  const [selected, setSelected] = useState<"ajoute" | "commentaires" | "signalements">("ajoute");

  useEffect(() => {
    if (
      params.tab &&
      (params.tab === "ajoute" ||
        params.tab === "commentaires" ||
        params.tab === "signalements")
    ) {
      setSelected(params.tab as Tab);
    }
  }, [params.tab]);

  const handleBack = () => {
    router.back();
  };

  const renderStatutBuffer = (statut: Statut) => {
    const statutConfig = {
      rejected: { style: styles.bufferRejected, textStyle: styles.bufferTextRejected, label: "Rejeté" },
      waiting: { style: styles.bufferWaiting, textStyle: styles.bufferTextWaiting, label: "En attente" },
      accepted: { style: styles.bufferAccepted, textStyle: styles.bufferTextAccepted, label: "Accepté" },
    };
    const config = statutConfig[statut];
    if (!config) return null;
    return (
      <View style={[styles.bufferBase, config.style]}>
        <Text style={[styles.bufferText, config.textStyle]}>
          {config.label}
        </Text>
      </View>
    );
  };

  const renderToiletItem = (toilet: Toilet) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => router.push(`/toilet/${toilet.id}`)}
    >
      <Image
        source={{ uri: toilet.image || DEFAULT_TOILET_IMAGE }}
        style={styles.image}
      />
      <View style={styles.itemContent}>
        <View style={styles.toiletHeader}>
          <Text style={styles.title}>{toilet.name}</Text>
          {toilet.accessible && <Text style={styles.accessibleIcon}>♿</Text>}
        </View>
        <View style={styles.toiletMeta}>
          <Text
            style={[
              styles.toiletMetaText,
              { color: toilet.free ? "#4CAF50" : "#ff4444" },
            ]}
          >
            {toilet.free ? "Gratuit" : "Payant"}
          </Text>
          <Text style={styles.separator}>·</Text>
          <Text
            style={[
              styles.toiletMetaText,
              { color: toilet.isOpen ? "#4CAF50" : "#ff4444" },
            ]}
          >
            {toilet.isOpen === true
              ? "Ouvert"
              : toilet.isOpen === false
                ? "Fermé"
                : "Horaires inconnus"}
          </Text>
        </View>
      </View>
      {toilet.status && renderStatutBuffer(toilet.status)}
    </TouchableOpacity>
  );

  const renderCommentItem = (comment: Comment) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => router.push(`/toilet/${comment.toiletId}`)}
    >
      <Image
        source={{ uri: comment.user.photoUrl || DEFAULT_USER_AVATAR }}
        style={styles.image}
      />
      <View style={styles.itemContent}>
        <View style={styles.commentHeader}>
          <Text style={styles.title}>{comment.user.name}</Text>
          <Text style={styles.dateLabel}>{comment.dateLabel}</Text>
        </View>

        <Text style={styles.commentContent} numberOfLines={2}>
          {comment.content}
        </Text>

        <View style={styles.ratingContainer}>
          {Array.from({ length: 5 }).map((_, index) => {
            const starValue = index + 1;
            const filled = starValue <= comment.rating;
            return (
              <Text
                key={starValue}
                style={[styles.ratingStar, { color: filled ? "#FBBF24" : "#ccc" }]}
              >
                {filled ? "★" : "☆"}
              </Text>
            );
          })}
          <Text style={styles.ratingText}>{comment.rating}/5</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const toiletSections = userProfile?.type === "admin" && scope === "all"
    ? [
        { title: "En attente", data: userToilets.filter((t) => t.status === "waiting") },
        { title: "Rejetés", data: userToilets.filter((t) => t.status === "rejected") },
        { title: "Acceptés", data: userToilets.filter((t) => t.status === "accepted") },
      ].filter(section => section.data.length > 0)
    : [{ title: "", data: userToilets }];

  // Titre dynamique selon le scope
  const pageTitle = scope === "all" ? "Contributions (tous les utilisateurs)" : "Mes contributions";

  return (
    <SafeAreaView style={styles.container}>
      <PageHeader title="Profile" onBack={handleBack} />

      <View style={styles.content}>
        <Text style={styles.header}>{pageTitle}</Text>

        <FlatList
          data={tabs}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => setSelected(item.id)}>
              <Text
                style={[styles.tab, selected === item.id && styles.tabSelected]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id}
          horizontal
          scrollEnabled={false}
          contentContainerStyle={styles.tabs}
          ItemSeparatorComponent={() => <View style={{ width: 20 }} />}
        />

        {selected === "ajoute" ? (
          <SectionList
            sections={toiletSections}
            keyExtractor={(item) => `toilet-${item.id}`}
            renderItem={({ item }) => renderToiletItem(item)}
            renderSectionHeader={({ section: { title } }) =>
              title ? <Text style={styles.sectionHeader}>{title}</Text> : null
            }
            stickySectionHeadersEnabled={false}
          />
        ) : (
          <FlatList
            data={data[selected]}
            keyExtractor={(item) => `${selected}-${item.id}`}
            renderItem={selected === "commentaires" ? ({ item }) => renderCommentItem(item) : undefined}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    padding: 15,
  },
  header: { fontSize: 22, fontWeight: "600", marginBottom: 15 },
  tabs: { marginBottom: 15, justifyContent: "space-between" },
  tab: { fontSize: 16, color: "#555" },
  tabSelected: {
    borderBottomWidth: 2,
    borderBottomColor: "black",
    paddingBottom: 4,
    color: "black",
    fontWeight: "600",
  },
  item: { flexDirection: "row", alignItems: "center", paddingVertical: 15, paddingHorizontal: 10, borderBottomWidth: 1, borderBottomColor: "#e0e0e0", backgroundColor: "#fff" },
  image: { width: 55, height: 55, borderRadius: 10, marginRight: 15 },
  itemContent: { flex: 1 },
  title: { fontSize: 16, fontWeight: "600", marginBottom: 4 },
  toiletHeader: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 4 },
  accessibleIcon: { fontSize: 16, color: "#3BAF74" },
  toiletMeta: { flexDirection: "row", alignItems: "center", gap: 6 },
  toiletMetaText: { fontSize: 14, fontWeight: "500" },
  separator: { color: "#888", fontSize: 14 },
  commentHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 4 },
  dateLabel: { color: "#888", fontSize: 12 },
  commentContent: { color: "#555", fontSize: 14, marginBottom: 6 },
  ratingContainer: { flexDirection: "row", alignItems: "center" },
  ratingStar: { fontSize: 14 },
  ratingText: { color: "#666", fontSize: 13, fontWeight: "600", marginLeft: 6 },
  bufferBase: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 15, borderWidth: 3, position: "absolute", right: 10 },
  bufferRejected: { borderColor: "#ff4444" },
  bufferAccepted: { borderColor: "#4CAF50" },
  bufferWaiting: { borderColor: "#323030FF" },
  bufferText: { fontSize: 12, fontWeight: "600" },
  bufferTextRejected: { color: "#ff4444" },
  bufferTextAccepted: { color: "#4CAF50" },
  bufferTextWaiting: { color: "#323030ff" },
  trashButton: { marginTop: 2, marginBottom: 6 },
  trashIcon: { fontSize: 16 },
  trashContainer: { position: "absolute", right: 0, top: 24 },
  sectionHeader: { fontSize: 18, fontWeight: "700", marginVertical: 10, color: "#333" },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    backgroundColor: "#fff",
  },
  itemWaiting: {
    opacity: 0.7,
  },
  image: {
    width: 55,
    height: 55,
    borderRadius: 10,
    marginRight: 15,
  },
  itemContent: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  address: {
    color: "#888",
    fontSize: 14,
  },
  toiletHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
  },
  accessibleIcon: {
    fontSize: 16,
    color: "#3BAF74",
  },
  toiletMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  toiletMetaText: {
    fontSize: 14,
    fontWeight: "500",
  },
  separator: {
    color: "#888",
    fontSize: 14,
  },
  commentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  dateLabel: {
    color: "#888",
    fontSize: 12,
  },
  commentContent: {
    color: "#555",
    fontSize: 14,
    marginBottom: 6,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingStar: {
    fontSize: 14,
  },
  ratingText: {
    color: "#666",
    fontSize: 13,
    fontWeight: "600",
    marginLeft: 6,
  },
  bufferBase: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    borderWidth: 3,
    position: "absolute",
    right: 10,
  },
  bufferRejected: {
    borderColor: "#ff4444",
  },
  bufferAccepted: {
    borderColor: "#4CAF50",
  },
  bufferWaiting: {
    borderColor: "#323030FF",
  },
  bufferText: {
    fontSize: 12,
    fontWeight: "600",
  },
  bufferTextRejected: {
    color: "#ff4444",
  },
  bufferTextAccepted: {
    color: "#4CAF50",
  },
  bufferTextWaiting: {
    color: "#323030ff",
  },
});
