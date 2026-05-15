import { Platform } from "react-native";

export const colors = {
  background: "#F5F7FB",
  surfaceStrong: "#FFFFFF",
  surfaceLifted: "#EFF4FB",
  surface: "#FFFFFF",
  surfaceMuted: "#E7EEF8",
  outlineStrong: "#D8E1EA",
  outline: "#C6D4E2",
  text: "#12223D",
  textSoft: "#4B5F7A",
  textMuted: "#7C8FA8",
  brand: "#236BE3",
  brandSoft: "#DAE6FF",
  brandDeep: "#154A9B",
  info: "#17629A",
  success: "#1C8C5B",
  warning: "#F2B940",
  danger: "#E25F5B",
  dangerSoft: "#F8D7D5",
  route: "#236BE3",
  routeDeep: "#143D7A",
  overlay: "rgba(35, 107, 227, 0.08)",
  shadow: "#1C3B67",
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
