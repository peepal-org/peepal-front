import { Colors } from "@/constants/Colors";
import { useRegisterViewModel } from "@/features/auth/useRegisterViewModel";
import { Ionicons } from "@expo/vector-icons";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Register() {
  const registerViewModel = useRegisterViewModel();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.background }]}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        {/* Header */}
        <View style={styles.headerSection}>
          <Image
            source={require("@/assets/images/peepal-logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={[styles.appName, { color: theme.primary }]}>Peepal</Text>
          <Text style={[styles.tagline, { color: theme.textMuted }]}>
            Crée ton compte pour commencer
          </Text>
        </View>

        {/* Formulaire */}
        <View style={styles.formSection}>
          <View
            style={[
              styles.inputContainer,
              { backgroundColor: theme.card, borderColor: theme.border },
            ]}
          >
            <Ionicons
              name="person-outline"
              size={20}
              color={theme.textMuted}
              style={styles.inputIcon}
            />
            <TextInput
              style={[styles.input, { color: theme.text }]}
              placeholder="Nom"
              placeholderTextColor={theme.textMuted}
              value={registerViewModel.name}
              onChangeText={registerViewModel.setName}
              autoCapitalize="words"
              editable={!registerViewModel.isLoading}
            />
          </View>

          <View
            style={[
              styles.inputContainer,
              { backgroundColor: theme.card, borderColor: theme.border },
            ]}
          >
            <Ionicons
              name="mail-outline"
              size={20}
              color={theme.textMuted}
              style={styles.inputIcon}
            />
            <TextInput
              style={[styles.input, { color: theme.text }]}
              placeholder="Email"
              placeholderTextColor={theme.textMuted}
              value={registerViewModel.email}
              onChangeText={registerViewModel.setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              editable={!registerViewModel.isLoading}
            />
          </View>

          <View
            style={[
              styles.inputContainer,
              { backgroundColor: theme.card, borderColor: theme.border },
            ]}
          >
            <Ionicons
              name="lock-closed-outline"
              size={20}
              color={theme.textMuted}
              style={styles.inputIcon}
            />
            <TextInput
              style={[styles.input, { color: theme.text }]}
              placeholder="Mot de passe"
              placeholderTextColor={theme.textMuted}
              value={registerViewModel.password}
              onChangeText={registerViewModel.setPassword}
              secureTextEntry={!registerViewModel.showPassword}
              editable={!registerViewModel.isLoading}
            />
            <TouchableOpacity
              onPress={() => registerViewModel.setShowPassword((prev) => !prev)}
              hitSlop={8}
            >
              <Ionicons
                name={
                  registerViewModel.showPassword
                    ? "eye-off-outline"
                    : "eye-outline"
                }
                size={20}
                color={theme.textMuted}
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[
              styles.registerButton,
              {
                backgroundColor: registerViewModel.isFormValid
                  ? theme.primary
                  : Colors.palette.disabled,
              },
            ]}
            onPress={registerViewModel.handleRegister}
            disabled={
              !registerViewModel.isFormValid || registerViewModel.isLoading
            }
            activeOpacity={0.8}
          >
            {registerViewModel.isLoading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.registerButtonText}>S{"'"}inscrire</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: theme.textMuted }]}>
            Déjà un compte ?
          </Text>
          <TouchableOpacity
            onPress={() => registerViewModel.goToLogin}
            disabled={registerViewModel.isLoading}
          >
            <Text style={[styles.footerLink, { color: theme.primary }]}>
              {" "}
              Se connecter
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 28,
    justifyContent: "center",
  },

  // Header
  headerSection: {
    alignItems: "center",
    marginBottom: 40,
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 18,
  },
  appName: {
    fontSize: 32,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  tagline: {
    fontSize: 15,
    marginTop: 6,
    textAlign: "center",
  },

  // Form
  formSection: {
    gap: 14,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 52,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    height: "100%",
  },
  registerButton: {
    height: 52,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 6,
  },
  registerButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },

  // Footer
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 28,
  },
  footerText: {
    fontSize: 14,
  },
  footerLink: {
    fontSize: 14,
    fontWeight: "600",
  },
});
