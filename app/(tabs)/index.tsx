import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Image, 
  TextInput 
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { toilets } from "../../data/toilets";
import { useRouter } from "expo-router";
import { useState } from "react";

export default function HomeScreen() {
  const router = useRouter();
  const [filterFree, setFilterFree] = useState(false);

  // Filtrage simple (gratuit seulement si activé)
  const filteredToilets = filterFree ? toilets.filter(t => t.free) : toilets;

  return (
    <View style={styles.container}>
      {/* Carte */}
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
            coordinate={{ latitude: toilet.latitude, longitude: toilet.longitude }}
            title={toilet.name}
            description={toilet.free ? "Gratuit" : "Payant"}
            onPress={() => router.push(`/toilet/${toilet.id}`)}
          />
        ))}
      </MapView>

      {/* SearchBar */}
      <TextInput
        placeholder="Search for a location or address"
        style={styles.searchBar}
      />

      {/* Filtres */}
      <View style={styles.filterBar}>
        <TouchableOpacity
          style={[styles.filterButton, filterFree && styles.filterActive]}
          onPress={() => setFilterFree(!filterFree)}
        >
          <Text style={[styles.filterText, filterFree && styles.filterTextActive]}>
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

      {/* Liste des toilettes (aperçu) */}
      <View style={styles.cardList}>
        <FlatList
          horizontal
          data={filteredToilets}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => router.push(`/toilet/${item.id}`)}
            >
              <Image source={{ uri: item.image }} style={styles.cardImage} />
              <Text style={styles.cardTitle}>{item.name}</Text>
              <Text style={[styles.cardSubtitle, { color: item.free ? "green" : "red" }]}>
                {item.free ? "Free" : "Payant"}
              </Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id}
        />
      </View>

      {/* Boutons flottants */}
      <TouchableOpacity style={[styles.fab, { bottom: 80, backgroundColor: "white" }]}>
        <Text style={{ fontSize: 18 }}>📍</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.fab, { bottom: 20, backgroundColor: "gold" }]}>
        <Text style={{ fontSize: 22 }}>＋</Text>
      </TouchableOpacity>
    </View>
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
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
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
    elevation: 2,
  },
  filterActive: { backgroundColor: "#007BFF" },
  filterText: { color: "black", fontWeight: "500" },
  filterTextActive: { color: "white" },

  cardList: {
    position: "absolute",
    bottom: 100,
  },
  card: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 12,
    marginHorizontal: 10,
    width: 200,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
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
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
});
