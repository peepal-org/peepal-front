import { login } from "@/auth/authService";
import { useAuth } from "@/auth/useAuth";
import { useToast } from "@/components/toast/useToast";
import { useRouter } from "expo-router";
import { useState } from "react";

export function useLoginViewModel() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { refreshAuth } = useAuth();
  const router = useRouter();
  const toast = useToast();

  const isFormValid = email.trim().length > 0 && password.trim().length > 0;

  const handleLogin = async () => {
    if (!isFormValid) return;

    setIsLoading(true);
    try {
      await login(email, password);
      await refreshAuth();
      router.replace("/(tabs)/map");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Erreur de connexion";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const goToRegister = () => router.push("/auth/register");

  return {
    email,
    setEmail,
    password,
    setPassword,
    showPassword,
    setShowPassword,
    isLoading,
    isFormValid,
    handleLogin,
    goToRegister,
  };
}
