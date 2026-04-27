import { Platform } from "react-native";

export const colors = {
  background: "#F7F1EB",
  surfaceStrong: "#FFFFFF",
  surfaceLifted: "#FFF6F1",
  surface: "#FFFFFF",
  surfaceMuted: "#F2E7DE",
  outlineStrong: "#E7D8CD",
  outline: "#EFE2D8",
  text: "#141414",
  textSoft: "#343434",
  textMuted: "#6C655F",
  brand: "#C50000",
  brandSoft: "#9B1C1C",
  brandDeep: "#7A0000",
  info: "#0F79E2",
  success: "#1C8C5B",
  warning: "#C67A00",
  danger: "#D60000",
  dangerSoft: "#B00000",
  route: "#C50000",
  routeDeep: "#8E0000",
  overlay: "rgba(197, 0, 0, 0.12)",
  shadow: "#2A1616",
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
