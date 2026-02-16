import { register } from "@/auth/authService";
import { useAuth } from "@/auth/useAuth";
import { useToast } from "@/components/toast/useToast";
import { getErrorMessage } from "@/utils/errorHandler";
import { useRouter } from "expo-router";
import { useState } from "react";

export function useRegisterViewModel() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { refreshAuth } = useAuth();
  const router = useRouter();
  const toast = useToast();

  const isFormValid =
    name.trim().length > 0 &&
    email.trim().length > 0 &&
    password.trim().length > 0;

  const handleRegister = async () => {
    if (!isFormValid) return;

    setIsLoading(true);
    try {
      await register(name, email, password);
      await refreshAuth();
      router.replace("/(tabs)/map");
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, "Erreur d'inscription."));
    } finally {
      setIsLoading(false);
    }
  };

  const goToLogin = () => router.push("/auth/login");

  return {
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    showPassword,
    setShowPassword,
    isLoading,
    isFormValid,
    handleRegister,
    goToLogin,
  };
}
