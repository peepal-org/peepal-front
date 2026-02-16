import { login } from "@/auth/authService";
import { useAuth } from "@/auth/useAuth";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { setUser } = useAuth();

    const handleLogin = async () => {
    try {
      const data = await login(email, password, false); 
      setUser(data.user); 
      router.replace("/(tabs)/map");
    } catch (err: any) {
      alert(err?.message ?? "Erreur de connexion");
    }
  };

  const handleAdminLogin = async () => {
    try {
      const data = await login(email, password, true);
      setUser(data.user);  
      router.replace("/(tabs)/map");
    } catch (err: any) {
      alert(err?.message ?? "Erreur de connexion");
    }
  };

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image
        source={require("@/assets/images/android-icon-foreground.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      {/* Titre */}
      <Text style={styles.title}>Peepal 🚻</Text>
      <Text style={styles.subtitle}>Trouve des toilettes proches 💧</Text>

      {/* Formulaire */}
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#888"
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        placeholderTextColor="#888"
        secureTextEntry
        onChangeText={setPassword}
      />

      {/* Bouton login */}
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Se connecter</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleAdminLogin}>
        <Text style={styles.buttonText}>Se connecter en tant qu'admin</Text>
      </TouchableOpacity>

      {/* Lien vers register */}
      <Text style={styles.link} onPress={() => router.push("/auth/register")}>
        Pas encore inscrit ?
      </Text>
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
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#007BFF",
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginBottom: 24,
  },
  input: {
    width: "100%",
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderColor: "#ddd",
    borderWidth: 1,
    marginBottom: 12,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#007BFF",
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 8,
    marginTop: 8,
    shadowColor: "#007BFF",
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 3,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  link: {
    marginTop: 16,
    fontSize: 14,
    color: "#007BFF",
    textDecorationLine: "underline",
  },
  footerText: {
    position: "absolute",
    bottom: 20,
    fontSize: 12,
    color: "#aaa",
  },
});
