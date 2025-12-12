import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import { ListItem, Image } from "@rneui/themed";
import { useNavigation } from "@react-navigation/native";
import PageHeader from "../../components/header";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Tab } from "../../types/TabType";
import { Statut } from "../../types/StatutType";

export default function ContributionsScreen() {
  const navigation = useNavigation();
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
    if (statut === "rejected") {
      return (
        <View style={[styles.bufferBase, styles.bufferRejected]}>
          <Text style={[styles.bufferText, styles.bufferTextRejected]}>Rejeté</Text>
        </View>
      );
    } 
    else if (statut === "waiting") {
      return (
        <View style={[styles.bufferBase, styles.bufferWaiting]}>
          <Text style={[styles.bufferText, styles.bufferTextWaiting]}>En attente</Text>
        </View>
      );
    }
    else if (statut === "accepted") {
      return (
        <View style={[styles.bufferBase, styles.bufferAccepted]}>
          <Text style={[styles.bufferText, styles.bufferTextAccepted]}>Accepté</Text>
        </View>
      );
    }
    return null;
  };

  return (
    <View style={styles.container}>
      <PageHeader title="Profile" onBack={handleBack} />

      <View style={styles.content}>
        <Text style={styles.header}>Contributions</Text>

        <View style={styles.tabs}>
          <TouchableOpacity onPress={() => setSelected("ajoute")}>
            <Text style={[styles.tab, selected === "ajoute" && styles.tabSelected]}>
              Ajoutés
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setSelected("commentaires")}>
            <Text style={[styles.tab, selected === "commentaires" && styles.tabSelected]}>
              Commentaires
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setSelected("signalements")}>
            <Text style={[styles.tab, selected === "signalements" && styles.tabSelected]}>
              Signalements
            </Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={data[selected]}
          keyExtractor={(item) => `${selected}-${item.id}`}
          renderItem={({ item }) => (
            <ListItem 
              bottomDivider 
              containerStyle={[
                styles.item,
                'statut' in item && item.statut === "waiting" && styles.itemWaiting
              ]}
            >
              <Image source={{ uri: item.image }} style={styles.image} />
              <ListItem.Content>
                <ListItem.Title style={styles.title}>{item.title}</ListItem.Title>
                <ListItem.Subtitle style={styles.address}>{item.address}</ListItem.Subtitle>
              </ListItem.Content>
              {'statut' in item && renderStatutBuffer(item.statut)}
            </ListItem>
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
    flexDirection: "row",
    marginBottom: 15,
    justifyContent: "space-between",
    width: "80%",
  },
  tab: { fontSize: 16, color: "#555" },
  tabSelected: {
    borderBottomWidth: 2,
    borderBottomColor: "black",
    paddingBottom: 4,
    color: "black",
    fontWeight: "600",
  },
  item: { paddingVertical: 10 },
  itemWaiting: {
    opacity: 0.7,
  },
  image: { width: 55, height: 55, borderRadius: 10 },
  title: { fontSize: 16, fontWeight: "600" },
  address: { color: "#888" },
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