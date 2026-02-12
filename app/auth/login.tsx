import { Colors } from "@/constants/Colors";
import { useLoginViewModel } from "@/features/auth/useLoginViewModel";
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
  useColorScheme,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Login() {
  const loginViewModel = useLoginViewModel();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.authBackground }]}
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
            Trouve des toilettes proches de toi
          </Text>
        </View>

        {/* Formulaire */}
        <View style={styles.formSection}>
          <View
            style={[
              styles.inputContainer,
              { backgroundColor: theme.card, borderColor: theme.inputBorder },
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
              value={loginViewModel.email}
              onChangeText={loginViewModel.setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              editable={!loginViewModel.isLoading}
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
              value={loginViewModel.password}
              onChangeText={loginViewModel.setPassword}
              secureTextEntry={!loginViewModel.showPassword}
              editable={!loginViewModel.isLoading}
            />
            <TouchableOpacity
              onPress={() => loginViewModel.setShowPassword((prev) => !prev)}
              hitSlop={8}
            >
              <Ionicons
                name={
                  loginViewModel.showPassword
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
              styles.loginButton,
              {
                backgroundColor: loginViewModel.isFormValid
                  ? theme.primary
                  : Colors.palette.disabled,
              },
            ]}
            onPress={loginViewModel.handleLogin}
            disabled={!loginViewModel.isFormValid || loginViewModel.isLoading}
            activeOpacity={0.8}
          >
            {loginViewModel.isLoading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.loginButtonText}>Se connecter</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: theme.textMuted }]}>
            Pas encore de compte ?
          </Text>
          <TouchableOpacity
            onPress={() => loginViewModel.goToRegister()}
            disabled={loginViewModel.isLoading}
          >
            <Text style={[styles.footerLink, { color: theme.primary }]}>
              {" "}
              Créer un compte
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
    width: 300,
    height: 300,
    marginBottom: 20,
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
  loginButton: {
    height: 52,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 6,
  },
  loginButtonText: {
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
