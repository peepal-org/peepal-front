import { Colors } from "@/constants/Colors";
import { Shadows } from "@/constants/Shadows";
import { toilets } from "@/data/toilets";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import MapView, { Marker } from "react-native-maps";

export default function MapScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  const [filterFree, setFilterFree] = useState(false);

  // 🧩 Filter only free toilets when toggle is active
  const filteredToilets = filterFree ? toilets.filter((t) => t.free) : toilets;

  return (
    <SafeAreaView style={styles.container}>
      {/* 🗺️ Map */}
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 48.867,
          longitude: 2.363,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        {filteredToilets.map((toilet) => (
          <Marker
            key={toilet.id}
            coordinate={{
              latitude: toilet.latitude,
              longitude: toilet.longitude,
            }}
            title={toilet.name}
            description={toilet.free ? "Gratuit" : "Payant"}
            onPress={() => router.push(`/toilet/${toilet.id}`)}
            pinColor={theme.primary}
          />
        ))}
      </MapView>

      {/* 🔍 Search bar */}
      <TextInput
        placeholder="Search for a location or address"
        placeholderTextColor={theme.textMuted}
        style={[
          styles.searchBar,
          { backgroundColor: theme.card, color: theme.text },
        ]}
      />

      {/* 🧭 Filter bar */}
      <View style={styles.filterBar}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filterFree && { backgroundColor: theme.primary },
          ]}
          onPress={() => setFilterFree(!filterFree)}
        >
          <Text
            style={[styles.filterText, filterFree && { color: theme.card }]}
          >
            Free
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterText}>PMR</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterText}>Open Now</Text>
        </TouchableOpacity>
      </View>

      {/* 🪞 Horizontal list of nearby toilets */}
      <View style={styles.cardList}>
        <FlatList
          horizontal
          data={filteredToilets}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.card,
                Shadows.dp2,
                { backgroundColor: theme.card },
              ]}
              onPress={() => router.push(`/toilet/${item.id}`)}
            >
              <Image source={{ uri: item.image }} style={styles.cardImage} />
              <Text style={[styles.cardTitle, { color: theme.text }]}>
                {item.name}
              </Text>
              <Text
                style={[
                  styles.cardSubtitle,
                  { color: item.free ? theme.success : theme.error },
                ]}
              >
                {item.free ? "Free" : "Payant"}
              </Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id}
        />
      </View>

      {/* 📍 Floating buttons */}
      <TouchableOpacity
        style={[
          styles.fab,
          Shadows.dp4,
          { bottom: 80, backgroundColor: theme.card },
        ]}
      >
        <Text style={{ fontSize: 18 }}>📍</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.fab,
          Shadows.dp4,
          { bottom: 20, backgroundColor: theme.accent },
        ]}
      >
        <Text style={{ fontSize: 22 }}>＋</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },

  searchBar: {
    position: "absolute",
    top: 40,
    left: 20,
    right: 20,
    borderRadius: 10,
    padding: 10,
  },

  filterBar: {
    position: "absolute",
    top: 100,
    flexDirection: "row",
    left: 20,
    right: 20,
    justifyContent: "space-around",
  },
  filterButton: {
    backgroundColor: "white",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    ...Shadows.dp1,
  },
  filterText: {
    color: "black",
    fontWeight: "500",
  },

  cardList: {
    position: "absolute",
    bottom: 100,
  },
  card: {
    padding: 10,
    borderRadius: 12,
    marginHorizontal: 10,
    width: 200,
  },
  cardImage: { width: "100%", height: 100, borderRadius: 10, marginBottom: 8 },
  cardTitle: { fontWeight: "bold", fontSize: 16, marginBottom: 4 },
  cardSubtitle: { fontSize: 14 },

  fab: {
    position: "absolute",
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
});
