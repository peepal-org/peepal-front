import { Ionicons } from "@expo/vector-icons";
import React, { createContext, useCallback, useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type ToastType = "success" | "error" | "warning" | "info";

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastProviderType {
  success: (message: string) => void;
  error: (message: string) => void;
  warning: (message: string) => void;
  info: (message: string) => void;
}

export const ToastContext = createContext<ToastProviderType | null>(null);

const TOAST_CONFIG: Record<
  ToastType,
  { icon: keyof typeof Ionicons.glyphMap; bg: string }
> = {
  success: { icon: "checkmark-circle", bg: "#16A34A" },
  error: { icon: "alert-circle", bg: "#DC2626" },
  warning: { icon: "warning", bg: "#D97706" },
  info: { icon: "information-circle", bg: "#2563EB" },
};

const DURATION = 3000;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(0);
  const insets = useSafeAreaInsets();

  const show = useCallback((message: string, type: ToastType) => {
    const id = nextId.current++;
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, DURATION);
  }, []);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast: ToastProviderType = {
    success: useCallback((msg: string) => show(msg, "success"), [show]),
    error: useCallback((msg: string) => show(msg, "error"), [show]),
    warning: useCallback((msg: string) => show(msg, "warning"), [show]),
    info: useCallback((msg: string) => show(msg, "info"), [show]),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <View
        style={[styles.container, { top: insets.top + 8 }]}
        pointerEvents="box-none"
      >
        {toasts.map((t) => {
          const config = TOAST_CONFIG[t.type];
          return (
            <TouchableOpacity
              key={t.id}
              style={[styles.toast, { backgroundColor: config.bg }]}
              onPress={() => dismiss(t.id)}
              activeOpacity={0.9}
            >
              <Ionicons name={config.icon} size={20} color="#fff" />
              <Text style={styles.message}>{t.message}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </ToastContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 16,
    right: 16,
    zIndex: 9999,
    gap: 8,
  },
  toast: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  message: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
    flex: 1,
  },
});
