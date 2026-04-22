import { Platform } from "react-native";

export const colors = {
  background: "#081C24",
  surfaceStrong: "#0E2B36",
  surfaceLifted: "#123947",
  surface: "#102631",
  outlineStrong: "#2E5B6B",
  outline: "#234554",
  text: "#F6F7F2",
  textSoft: "#D6DEE1",
  textMuted: "#95A9B2",
  brand: "#FF7A1A",
  brandSoft: "#FFB67A",
  primaryGlow: "#D1FAE5",
  secondaryGlow: "#FFE8C2",
  info: "#7DD3FC",
  success: "#4ADE80",
  warning: "#FBBF24",
  danger: "#FB7185",
  shadow: "#000000",
};

export const fonts = {
  display: Platform.select({
    ios: "Avenir Next",
    android: "sans-serif-condensed",
    default: "System",
  }),
  body: Platform.select({
    ios: "Avenir",
    android: "sans-serif",
    default: "System",
  }),
};

