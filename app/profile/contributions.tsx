import React, { useState, useEffect, useCallback } from "react";
import { View, Text, TouchableOpacity, SectionList, FlatList, StyleSheet, Image, Alert } from "react-native";
import { useRouter, useLocalSearchParams, useFocusEffect } from "expo-router";
import PageHeader from "../../components/header";
import { Statut } from "../../types/Statut";
import {
  fetchAdminComments,
  fetchAdminReports,
  fetchAdminToilets,
} from "@/functions/api/admin";
import {
  fetchAdminCommentReports,
  fetchMyCommentReports,
} from "@/functions/api/commentReports";
import { fetchComments } from "@/functions/api/comments";
import { fetchToilets } from "@/functions/api/toilet";
import { fetchReports } from "@/functions/api/reports";
import { mapApiComment } from "@/functions/mappers/comments";
import { mapApiCommentReport, mapApiReport } from "@/functions/mappers/reports";
import { mapApiToilet } from "@/functions/mappers/toilet";
import type { ApiUser } from "@/types/api/ApiUser";
import type { Comment } from "@/types/ui/Comment";
import type { Toilet } from "@/types/ui/Toilet";
import type { Report } from "@/types/ui/Report";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { DEFAULT_USER_AVATAR, DEFAULT_TOILET_IMAGE } from "@/constants/Images";
import { getUserProfile } from "@/auth/authService";
import { Tab } from "../../types/Tab";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";


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
      queryClient.invalidateQueries({ queryKey: ["myReports"] });
      queryClient.invalidateQueries({ queryKey: ["myCommentReports"] });
      queryClient.invalidateQueries({ queryKey: ["allComments"] });
      queryClient.invalidateQueries({ queryKey: ["allToilets"] });
      queryClient.invalidateQueries({ queryKey: ["allReports"] });
      queryClient.invalidateQueries({ queryKey: ["allCommentReports"] });
    }, [queryClient])
  );

  // Déterminer le scope (personal ou all) depuis les paramètres
  const scope = (params.scope as string) || "personal";
  const isAdminUser =
    userProfile?.type === "admin" ||
    userProfile?.type === "superadmin";

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
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
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
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  const { data: myReports = [] } = useQuery({
    queryKey: ["myReports", userProfile?.id],
    queryFn: fetchReports,
    select: (apiReports) => {
      return apiReports
        .filter((report) => report.user.id === userProfile?.id)
        .map(mapApiReport);
    },
    enabled: !!userProfile && scope === "personal",
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  const { data: myCommentReports = [] } = useQuery({
    queryKey: ["myCommentReports", userProfile?.id],
    queryFn: fetchMyCommentReports,
    select: (apiReports) => apiReports.map(mapApiCommentReport),
    enabled: !!userProfile && scope === "personal",
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  // Toutes les contributions (pour les admins uniquement)
  const { data: allComments = [] } = useQuery({
    queryKey: ["allComments"],
    queryFn: fetchAdminComments,
    select: (apiComments) => {
      return apiComments.map(mapApiComment);
    },
    enabled: !!userProfile && isAdminUser && scope === "all",
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  const { data: allToilets = [] } = useQuery({
    queryKey: ["allToilets"],
    queryFn: fetchAdminToilets,
    select: (apiToilets) => {
      return apiToilets
        .map(mapApiToilet)
        .filter((toilet) => toilet.type);
    },
    enabled: !!userProfile && isAdminUser && scope === "all",
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  const { data: allReports = [] } = useQuery({
    queryKey: ["allReports"],
    queryFn: fetchAdminReports,
    select: (apiReports) => {
      return apiReports.map(mapApiReport);
    },
    enabled: !!userProfile && isAdminUser && scope === "all",
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  const { data: allCommentReports = [] } = useQuery({
    queryKey: ["allCommentReports"],
    queryFn: fetchAdminCommentReports,
    select: (apiReports) => apiReports.map(mapApiCommentReport),
    enabled: !!userProfile && isAdminUser && scope === "all",
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  // Sélectionner les bonnes données selon le scope
  const userComments = scope === "all" ? allComments : myComments;
  const userToilets = scope === "all" ? allToilets : myToilets;
  const userReports = (scope === "all"
    ? [...allReports, ...allCommentReports]
    : [...myReports, ...myCommentReports]
  ).sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  const data = {
    commentaires: userComments,
    signalements: userReports,
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

  const getReportTypeLabel = (type: Report["type"]) => {
    const labels: Record<Report["type"], string> = {
      closed: "Fermé",
      dirty: "Sale",
      maintenance: "En maintenance",
      spam: "Spam",
      offensive: "Offensant",
      other: "Autre",
    };
    return labels[type];
  };

  const getReportTypeIcon = (
    type: Report["type"],
  ): keyof typeof Ionicons.glyphMap => {
    const icons: Record<Report["type"], keyof typeof Ionicons.glyphMap> = {
      closed: "lock-closed",
      dirty: "alert-circle",
      maintenance: "construct",
      spam: "flag",
      offensive: "warning",
      other: "help-circle",
    };
    return icons[type];
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
      {toilet.statut && renderStatutBuffer(toilet.statut)}
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

  const renderReportItem = (report: Report) => {
    const targetIcon =
      report.targetType === "comment" ? "chatbubble-outline" : "water-outline";
    const targetLabel =
      report.targetType === "comment" ? "Commentaire" : "Toilette";

    return (
      <TouchableOpacity
        style={styles.item}
        onPress={() => router.push(`/toilet/${report.toiletId}`)}
      >
        <View style={styles.reportImageContainer}>
          <Image
            source={{ uri: report.toiletImage || DEFAULT_TOILET_IMAGE }}
            style={styles.image}
          />
          <Text style={styles.reportToiletNameBelow} numberOfLines={2}>
            {report.toiletName}
          </Text>
        </View>

        <View style={styles.itemContent}>
          <Text style={styles.reportUserName}>{report.userName}</Text>

          <View style={styles.reportTypeContainer}>
            <Ionicons
              name={getReportTypeIcon(report.type)}
              size={16}
              color="#666"
            />
            <Text style={styles.reportTypeText}>
              {getReportTypeLabel(report.type)}
            </Text>
          </View>

          {report.description ? (
            <Text style={styles.reportDescription} numberOfLines={4}>
              {report.description}
            </Text>
          ) : null}
        </View>

        <View style={styles.reportMetaRight}>
          <Text style={styles.dateLabel}>
            {report.dateLabel.replace(/(\d+)([hms])/g, "$1 $2")}
          </Text>
          <View style={styles.reportTargetContainer}>
            <Ionicons name={targetIcon} size={16} color="#666" />
            <Text style={styles.reportTargetText}>{targetLabel}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const toiletSections = isAdminUser && scope === "all"
    ? [
        { title: "En attente", data: userToilets.filter((t) => t.statut === "waiting") },
        { title: "Rejetés", data: userToilets.filter((t) => t.statut === "rejected") },
        { title: "Acceptés", data: userToilets.filter((t) => t.statut === "accepted") },
      ].filter(section => section.data.length > 0)
    : [{ title: "", data: userToilets }];

  // Titre dynamique selon le scope
  const pageTitle = scope === "all" ? "Contributions (tous les utilisateurs)" : "Mes contributions";

  if (scope === "all" && userProfile && !isAdminUser) {
    return (
      <SafeAreaView style={styles.container}>
        <PageHeader title="Profile" onBack={handleBack} />
        <View style={styles.emptyContainer}>
          <Ionicons name="lock-closed-outline" size={64} color="#ccc" />
          <Text style={styles.emptyTitle}>Accès réservé aux administrateurs</Text>
          <Text style={styles.emptyDescription}>
            Cette section n'est pas disponible pour un compte standard.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // Composants pour les listes vides
  const EmptyToiletsComponent = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="water-outline" size={64} color="#ccc" />
      <Text style={styles.emptyTitle}>
        {scope === "all" ? "Aucune toilette ajoutée" : "Vous n'avez pas encore ajouté de toilettes"}
      </Text>
      <Text style={styles.emptyDescription}>
        {scope === "all" 
          ? "Les toilettes ajoutées par les utilisateurs apparaîtront ici"
          : "Commencez par ajouter votre première toilette sur la carte"}
      </Text>
    </View>
  );

  const EmptyCommentsComponent = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="chatbubble-outline" size={64} color="#ccc" />
      <Text style={styles.emptyTitle}>
        {scope === "all" ? "Aucun commentaire" : "Vous n'avez pas encore laissé de commentaires"}
      </Text>
      <Text style={styles.emptyDescription}>
        {scope === "all"
          ? "Les commentaires des utilisateurs apparaîtront ici"
          : "Partagez votre expérience en commentant une toilette"}
      </Text>
    </View>
  );

  const EmptySignalementsComponent = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="flag-outline" size={64} color="#ccc" />
      <Text style={styles.emptyTitle}>
        {scope === "all" ? "Aucun signalement" : "Vous n'avez pas encore fait de signalements"}
      </Text>
      <Text style={styles.emptyDescription}>
        {scope === "all"
          ? "Les signalements des utilisateurs apparaîtront ici"
          : "Signalez des problèmes pour améliorer la qualité des informations"}
      </Text>
    </View>
  );

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
            ListEmptyComponent={EmptyToiletsComponent}
          />
        ) : selected === "commentaires" ? (
          <FlatList
            data={data.commentaires}
            keyExtractor={(item) => `commentaires-${item.id}`}
            renderItem={({ item }) => renderCommentItem(item)}
            ListEmptyComponent={EmptyCommentsComponent}
          />
        ) : (
          <FlatList
            data={data.signalements}
            keyExtractor={(item) => `signalements-${item.targetType}-${item.id}`}
            renderItem={({ item }) => renderReportItem(item)}
            ListEmptyComponent={EmptySignalementsComponent}
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

  trashButton: { 
    marginTop: 2, 
    marginBottom: 6 
  },
  trashIcon: { 
    fontSize: 16 
  },
  trashContainer: { 
    position: "absolute", 
    right: 0, 
    top: 24 
  },
  sectionHeader: { 
    fontSize: 18, 
    fontWeight: "700", 
    marginVertical: 10, 
    color: "#333" 
  },
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
  reportImageContainer: {
    alignItems: "center",
    marginRight: 15,
    width: 70,
  },
  reportToiletNameBelow: {
    fontSize: 12,
    color: "#555",
    marginTop: 28,
    fontWeight: "500",
  },
  reportHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  reportUserName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  reportToiletName: {
    fontSize: 14,
    color: "#555",
    marginBottom: 6,
    fontWeight: "500",
  },
  reportTypeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
  },
  reportTypeText: {
    fontSize: 13,
    color: "#666",
    fontWeight: "500",
  },
  reportDescription: {
    fontSize: 13,
    color: "#888",
    lineHeight: 18,
  },
  reportMetaRight: {
    minWidth: 72,
    alignItems: "flex-end",
    justifyContent: "space-between",
    alignSelf: "stretch",
    marginLeft: 12,
  },
  reportTargetContainer: {
    alignItems: "center",
    gap: 4,
  },
  reportTargetText: {
    fontSize: 11,
    color: "#666",
    fontWeight: "500",
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
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
    paddingHorizontal: 30,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginTop: 20,
    marginBottom: 8,
    textAlign: "center",
  },
  emptyDescription: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
    lineHeight: 20,
  },
});