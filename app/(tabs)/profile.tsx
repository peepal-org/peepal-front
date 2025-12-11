import { Colors } from "@/constants/Colors";
import { Shadows } from "@/constants/Shadows";
import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;

const scale = (size: number) => (width / guidelineBaseWidth) * size;
const verticalScale = (size: number) => (height / guidelineBaseHeight) * size;

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const router = useRouter();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.headerBar}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Profile</Text>
      </View>

      <View style={styles.profileSection}>
        <View style={styles.header}>
          <Image
            source={{ uri: "https://i.pravatar.cc/150?img=12" }}
            style={[styles.avatar, Shadows.dp4]}
          />
          <Text style={[styles.username, { color: theme.text }]}>Jean Dupont</Text>
          <Text style={[styles.subtitle, { color: theme.textMuted }]}>@JeanDupont</Text>
          <Text style={[styles.bio, { color: theme.textMuted }]}>
            Passionné par les espaces publics propres et accessibles à tous
          </Text>
        </View>
        
        <TouchableOpacity 
          style={styles.editButton}
          onPress={() => router.push("/screens/profileScreens/updateProfile")}
        >
          <Ionicons name="create-outline" size={24} color={theme.text} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: verticalScale(60) }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.stats}>
          {[
            { number: 12, label: "Commentaires" },
            { number: 5, label: "Signalements" },
            { number: 3, label: "Badges" },
          ].map((stat, index) => (
            <View key={index} style={styles.statBox}>
              <Text style={[styles.statNumber, { color: theme.primary }]}>
                {stat.number}
              </Text>
              <Text style={[styles.statLabel, { color: theme.textMuted }]}>
                {stat.label}
              </Text>
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.error }]}
          onPress={() => router.replace("/login")}
        >
          <Text style={styles.buttonText}>Déconnexion</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: scale(20),
    paddingVertical: verticalScale(15),
  },
  headerTitle: {
    fontSize: scale(18),
    fontWeight: "600",
  },
  profileSection: {
    position: "relative",
    marginTop: verticalScale(20),
  },
  editButton: {
    position: "absolute",
    top: verticalScale(10),
    right: scale(20),
    padding: scale(5),
    zIndex: 10,
  },
  header: { alignItems: "center" },
  avatar: {
    width: scale(100),
    height: scale(100),
    borderRadius: scale(50),
    marginBottom: verticalScale(10),
  },
  username: { fontSize: scale(22), fontWeight: "bold" },
  subtitle: { fontSize: scale(14), marginBottom: verticalScale(5) },
  bio: { 
    fontSize: scale(14), 
    textAlign: "center",
    paddingHorizontal: scale(40),
    marginTop: verticalScale(10),
  },
  stats: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    marginTop: verticalScale(30),
    paddingHorizontal: scale(20),
  },
  statBox: { 
    alignItems: "center",
    flex: 1,
  },
  statNumber: { fontSize: scale(20), fontWeight: "bold" },
  statLabel: { 
    fontSize: scale(14),
    textAlign: "center",
  },
  section: { marginTop: verticalScale(30), paddingHorizontal: scale(20) },
  sectionTitle: {
    fontSize: scale(18),
    fontWeight: "bold",
    marginBottom: verticalScale(10),
  },
  button: {
    padding: scale(15),
    marginHorizontal: scale(20),
    marginTop: verticalScale(20),
    borderRadius: scale(8),
    alignItems: "center",
    ...Shadows.dp2,
  },
  buttonText: { color: "white", fontSize: scale(16), fontWeight: "600" },
});