import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function ContributeScreen() {
  const router = useRouter();

  // 🔹 Local state for form inputs
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [isPublic, setIsPublic] = useState(true);

  // 🔹 Handles form submission
  const handleSubmit = () => {
    if (!name.trim() || !comment.trim()) {
      Alert.alert("Incomplete", "Please fill in all fields before submitting.");
      return;
    }

    // Simulate sending data to API or local store
    Alert.alert("Thank you!", "Your contribution has been recorded ✅");
    setName("");
    setComment("");
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      {/* 🧩 Page title */}
      <Text style={styles.title}>Contribute 🚻</Text>
      <Text style={styles.subtitle}>
        Help the community by sharing useful information.
      </Text>

      {/* 👤 Name input */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Your name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your name"
          value={name}
          onChangeText={setName}
        />
      </View>

      {/* 💬 Comment input */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Comment or suggestion</Text>
        <TextInput
          style={[styles.input, { height: 100, textAlignVertical: "top" }]}
          placeholder="Describe your feedback..."
          multiline
          value={comment}
          onChangeText={setComment}
        />
      </View>

      {/* 🔘 Public/private toggle */}
      <TouchableOpacity
        style={styles.checkbox}
        onPress={() => setIsPublic(!isPublic)}
      >
        <Text style={styles.checkboxText}>
          {isPublic ? "☑️" : "⬜"} Make my contribution public
        </Text>
      </TouchableOpacity>

      {/* 📨 Submit button */}
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Send contribution</Text>
      </TouchableOpacity>

      {/* ⬅️ Return button */}
      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={() => router.back()}
      >
        <Text style={styles.secondaryButtonText}>⬅ Back</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fafafa", paddingHorizontal: 20 },
  title: { fontSize: 28, fontWeight: "800", color: "#007BFF", marginTop: 30 },
  subtitle: { fontSize: 15, color: "#555", marginBottom: 20 },
  inputContainer: { marginBottom: 16 },
  label: { fontSize: 16, fontWeight: "600", marginBottom: 8 },
  input: {
    backgroundColor: "#fff",
    borderRadius: 8,
    borderColor: "#ddd",
    borderWidth: 1,
    padding: 12,
    fontSize: 15,
  },
  checkbox: { marginVertical: 12 },
  checkboxText: { fontSize: 16, color: "#333" },
  button: {
    backgroundColor: "#007BFF",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: { color: "white", fontSize: 16, fontWeight: "600" },
  secondaryButton: {
    backgroundColor: "#E0E0E0",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 12,
  },
  secondaryButtonText: { color: "#333", fontSize: 16, fontWeight: "600" },
});
