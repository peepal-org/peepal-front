import { type ViewStyle } from "react-native";

/**
 * Cross-platform shadow presets for iOS and Android.
 * On iOS → uses shadowColor, shadowOffset, shadowOpacity, shadowRadius
 * On Android → uses elevation (automatically applies shadow)
 */

export const Shadows = {
  // 💧 Subtle shadow (for small elements like icons, chips)
  dp1: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1, // Android
  } satisfies ViewStyle,

  // 📄 Default shadow (cards, small modals, floating buttons)
  dp2: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
  } satisfies ViewStyle,

  // 🧱 Medium depth (bottom sheets, floating containers)
  dp4: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  } satisfies ViewStyle,

  // 📦 Strong shadow (modals, pop-ups)
  dp8: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
  } satisfies ViewStyle,

  // 🪟 Maximum depth (dialogs, alerts)
  dp16: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 16,
  } satisfies ViewStyle,
};
