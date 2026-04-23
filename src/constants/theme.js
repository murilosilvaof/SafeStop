import { Platform } from "react-native";

export const colors = {
  background: "#081015",
  surfaceStrong: "#121D24",
  surfaceLifted: "#172630",
  surface: "#0F181F",
  surfaceMuted: "#1D2B34",
  outlineStrong: "#314754",
  outline: "#223440",
  text: "#F6F7F3",
  textSoft: "#D6DFE3",
  textMuted: "#92A3AE",
  brand: "#F3C548",
  brandSoft: "#FFE3A0",
  brandDeep: "#A57C14",
  info: "#4BB6FF",
  success: "#4CD37E",
  warning: "#FFB648",
  danger: "#F04444",
  dangerSoft: "#FF8585",
  route: "#D92F2F",
  routeDeep: "#7A1717",
  overlay: "rgba(4, 10, 14, 0.72)",
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
