import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import PageHeader from "../../components/header";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Tab } from "../../types/Tab";
import { Statut } from "../../types/Statut";
import { fetchComments } from "@/functions/api/comments";
import { fetchToilets } from "@/functions/api/toilet";
import { mapApiComment } from "@/functions/mappers/comments";
import { mapApiToilet } from "@/functions/mappers/toilet";
import type { Comment } from "@/types/ui/Comment";
import type { Toilet } from "@/types/ui/Toilet";
import { useQuery } from "@tanstack/react-query";
import { DEFAULT_USER_AVATAR, DEFAULT_TOILET_IMAGE } from "@/constants/Images";
import { getUserProfile } from "@/auth/authService";
import type { ApiUser } from "@/types/api/ApiUser";

export default function ContributionsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
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

  const { data: userComments = [] } = useQuery({
    queryKey: ["userComments"],
    queryFn: fetchComments,
    select: (apiComments) => 
      apiComments
        .filter((comment) => comment.user.id === userProfile?.id)
        .map(mapApiComment),
    enabled: !!userProfile,
  });

  const { data: userToilets = [] } = useQuery({
    queryKey: ["userToilets"],
    queryFn: fetchToilets,
    select: (apiToilets) => 
      apiToilets
        .filter((toilet) => toilet.createdBy?.id === userProfile?.id)
        .map(mapApiToilet),
    enabled: !!userProfile,
  });
  
  const data = {
    ajoute: userToilets,
    commentaires: userComments,
    signalements: [
      { id: "28", title: "Pipi express", address: "897 Pine St", image: "https://picsum.photos/200/200?random=5" },
      { id: "29", title: "Pipi express", address: "897 Pine St", image: "https://picsum.photos/200/200?random=5" },
      { id: "30", title: "Pipi express", address: "897 Pine St", image: "https://picsum.photos/200/200?random=5" },
      { id: "31", title: "Pipi express", address: "897 Pine St", image: "https://picsum.photos/200/200?random=5" },
      { id: "32", title: "Pipi express", address: "897 Pine St", image: "https://picsum.photos/200/200?random=5" },
      { id: "33", title: "Pipi express", address: "897 Pine St", image: "https://picsum.photos/200/200?random=5" },
      { id: "34", title: "Pipi express", address: "897 Pine St", image: "https://picsum.photos/200/200?random=5" },
      { id: "35", title: "Pipi express", address: "897 Pine St", image: "https://picsum.photos/200/200?random=5" },
      { id: "36", title: "Pipi express", address: "897 Pine St", image: "https://picsum.photos/200/200?random=5" },
      { id: "37", title: "Pipi express", address: "897 Pine St", image: "https://picsum.photos/200/200?random=5" },
      { id: "38", title: "Pipi express", address: "897 Pine St", image: "https://picsum.photos/200/200?random=5" },
      { id: "39", title: "Pipi express", address: "897 Pine St", image: "https://picsum.photos/200/200?random=5" },
      { id: "40", title: "Pipi express", address: "897 Pine St", image: "https://picsum.photos/200/200?random=5" },
      { id: "41", title: "Pipi express", address: "897 Pine St", image: "https://picsum.photos/200/200?random=5" },
      { id: "42", title: "Pipi express", address: "897 Pine St", image: "https://picsum.photos/200/200?random=5" },
      { id: "43", title: "Pipi express", address: "897 Pine St", image: "https://picsum.photos/200/200?random=5" },
      { id: "44", title: "Pipi express", address: "897 Pine St", image: "https://picsum.photos/200/200?random=5" },
      { id: "45", title: "Pipi express", address: "897 Pine St", image: "https://picsum.photos/200/200?random=5" },
      { id: "46", title: "Pipi express", address: "897 Pine St", image: "https://picsum.photos/200/200?random=5" },
      { id: "47", title: "Pipi express", address: "897 Pine St", image: "https://picsum.photos/200/200?random=5" }
    ],
  };

  const tabs = [
    { id: "ajoute" as Tab, label: "Ajoutés" },
    { id: "commentaires" as Tab, label: "Commentaires" },
    { id: "signalements" as Tab, label: "Signalements" },
  ];

  const [selected, setSelected] = useState<Tab>("ajoute");

  useEffect(() => {
    if (params.tab && (params.tab === "ajoute" || params.tab === "commentaires" || params.tab === "signalements")) {
      setSelected(params.tab as Tab);
    }
  }, [params.tab]);

  const handleBack = () => {
    router.replace("/(tabs)/profile");
  };

  const renderStatutBuffer = (statut: Statut) => {
    const statutConfig = {
      rejected: {
        style: styles.bufferRejected,
        textStyle: styles.bufferTextRejected,
        label: "Rejeté",
      },
      waiting: {
        style: styles.bufferWaiting,
        textStyle: styles.bufferTextWaiting,
        label: "En attente",
      },
      accepted: {
        style: styles.bufferAccepted,
        textStyle: styles.bufferTextAccepted,
        label: "Accepté",
      },
    };

    const config = statutConfig[statut];
    if (!config) return null;

    return (
      <View style={[styles.bufferBase, config.style]}>
        <Text style={[styles.bufferText, config.textStyle]}>{config.label}</Text>
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
          {toilet.accessible && (
            <Text style={styles.accessibleIcon}>♿</Text>
          )}
        </View>
        <View style={styles.toiletMeta}>
          <Text style={[
            styles.toiletMetaText,
            { color: toilet.free ? "#4CAF50" : "#ff4444" }
          ]}>
            {toilet.free ? "Gratuit" : "Payant"}
          </Text>
          <Text style={styles.separator}>·</Text>
          <Text style={[
            styles.toiletMetaText,
            { color: toilet.isOpen ? "#4CAF50" : "#ff4444" }
          ]}>
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
                style={[
                  styles.ratingStar,
                  { color: filled ? "#FBBF24" : "#ccc" },
                ]}
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

  const renderItem = ({ item }: { item: any }) => {
    if (selected === "commentaires") {
      return renderCommentItem(item);
    }
    
    if (selected === "ajoute") {
      return renderToiletItem(item);
    }
    
    return (
      <View style={styles.item}>
        <Image source={{ uri: item.image }} style={styles.image} />
        <View style={styles.itemContent}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.address}>{item.address}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <PageHeader title="Profile" onBack={handleBack} />

      <View style={styles.content}>
        <Text style={styles.header}>Contributions</Text>

        <FlatList
          data={tabs}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => setSelected(item.id)}>
              <Text style={[styles.tab, selected === item.id && styles.tabSelected]}>
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

        <FlatList
          data={data[selected]}
          keyExtractor={(item) => `${selected}-${item.id}`}
          renderItem={renderItem}
        />
      </View>
    </View>
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
  tabs: {
    marginBottom: 15,
    justifyContent: "space-between",
  },
  tab: { fontSize: 16, color: "#555" },
  tabSelected: {
    borderBottomWidth: 2,
    borderBottomColor: "black",
    paddingBottom: 4,
    color: "black",
    fontWeight: "600",
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