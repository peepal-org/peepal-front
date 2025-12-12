import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import PageHeader from "../../components/header";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Tab } from "../../types/Tab";
import { Statut } from "../../types/Statut";

export default function ContributionsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const data = {
    ajoute: [
      { id: "1", title: "Toilettes Turques", address: "123 Main St", image: "https://picsum.photos/200/200?random=1", statut: "accepted" as Statut },
      { id: "2", title: "Toilettes Turques", address: "123 Main St", image: "https://picsum.photos/200/200?random=1", statut: "waiting" as Statut },
      { id: "3", title: "Toilettes Turques", address: "123 Main St", image: "https://picsum.photos/200/200?random=1", statut: "rejected" as Statut },
      { id: "4", title: "Toilettes Turques", address: "123 Main St", image: "https://picsum.photos/200/200?random=1", statut: "accepted" as Statut },
      { id: "5", title: "Toilettes Turques", address: "123 Main St", image: "https://picsum.photos/200/200?random=1", statut: "waiting" as Statut },
      { id: "6", title: "Toilettes Turques", address: "123 Main St", image: "https://picsum.photos/200/200?random=1", statut: "rejected" as Statut },
      { id: "7", title: "Toilettes Turques", address: "123 Main St", image: "https://picsum.photos/200/200?random=1", statut: "accepted" as Statut },
      { id: "8", title: "Toilettes Turques", address: "123 Main St", image: "https://picsum.photos/200/200?random=1", statut: "waiting" as Statut },
      { id: "9", title: "Toilettes Turques", address: "123 Main St", image: "https://picsum.photos/200/200?random=1", statut: "rejected" as Statut },
      { id: "10", title: "Toilettes Turques", address: "123 Main St", image: "https://picsum.photos/200/200?random=1", statut: "accepted" as Statut },
      { id: "11", title: "Toilettes Turques", address: "123 Main St", image: "https://picsum.photos/200/200?random=1", statut: "waiting" as Statut },
      { id: "12", title: "Toilettes Turques", address: "123 Main St", image: "https://picsum.photos/200/200?random=1", statut: "rejected" as Statut },
    ],
    commentaires: [
      { id: "13", title: "Toit lettre", address: "456 Oak Ave", image: "https://picsum.photos/200/200?random=2" },
      { id: "14", title: "Magic Perfect", address: "789 Elm St", image: "https://picsum.photos/200/200?random=3" },
      { id: "15", title: "Shi-hot", address: "321 Maple Dr", image: "https://picsum.photos/200/200?random=4" },
      { id: "16", title: "Toit lettre", address: "456 Oak Ave", image: "https://picsum.photos/200/200?random=2" },
      { id: "17", title: "Magic Perfect", address: "789 Elm St", image: "https://picsum.photos/200/200?random=3" },
      { id: "18", title: "Shi-hot", address: "321 Maple Dr", image: "https://picsum.photos/200/200?random=4" },
      { id: "19", title: "Toit lettre", address: "456 Oak Ave", image: "https://picsum.photos/200/200?random=2" },
      { id: "20", title: "Magic Perfect", address: "789 Elm St", image: "https://picsum.photos/200/200?random=3" },
      { id: "21", title: "Shi-hot", address: "321 Maple Dr", image: "https://picsum.photos/200/200?random=4" },
      { id: "22", title: "Toit lettre", address: "456 Oak Ave", image: "https://picsum.photos/200/200?random=2" },
      { id: "23", title: "Magic Perfect", address: "789 Elm St", image: "https://picsum.photos/200/200?random=3" },
      { id: "24", title: "Shi-hot", address: "321 Maple Dr", image: "https://picsum.photos/200/200?random=4" },
      { id: "25", title: "Toit lettre", address: "456 Oak Ave", image: "https://picsum.photos/200/200?random=2" },
      { id: "26", title: "Magic Perfect", address: "789 Elm St", image: "https://picsum.photos/200/200?random=3" },
      { id: "27", title: "Shi-hot", address: "321 Maple Dr", image: "https://picsum.photos/200/200?random=4" },
    ],
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
          renderItem={({ item }) => (
            <View 
              style={[
                styles.item,
                item.statut === "waiting" && styles.itemWaiting
              ]}
            >
              <Image source={{ uri: item.image }} style={styles.image} />
              <View style={styles.itemContent}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.address}>{item.address}</Text>
              </View>
              {item.statut && renderStatutBuffer(item.statut)}
            </View>
          )}
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