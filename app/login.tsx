import { useRouter } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function LoginScreen() {
  const router = useRouter();
  // 🔹 Handles user navigation to the main app (tabs group)
  // Use the real logic later
  const handleLogin = () => {
    router.replace("/(tabs)/map");
  };

  return (
    <View style={styles.container}>
      {/* 🧩 App logo */}
      <Image
        source={require("@/assets/images/android-icon-foreground.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      {/* 🚻 App name and tagline */}
      <Text style={styles.title}>Peepal 🚻</Text>
      <Text style={styles.subtitle}>Find nearby toilets easily 💧</Text>

      {/* 🔘 Login / Signup button */}
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login / Signup</Text>
      </TouchableOpacity>

      {/* 🧠 Footer note */}
      <Text style={styles.footerText}>Powered by Expo & React Native</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#007BFF",
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginVertical: 8,
  },
  button: {
    backgroundColor: "#007BFF",
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 8,
    marginTop: 24,
    shadowColor: "#007BFF",
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 3,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  footerText: {
    position: "absolute",
    bottom: 20,
    fontSize: 12,
    color: "#aaa",
  },
});
