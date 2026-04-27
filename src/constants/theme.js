import { Platform } from "react-native";

export const colors = {
  background: "#FFFFFF", // fundo branco
  surfaceStrong: "#F7F7F7", // cinza muito claro
  surfaceLifted: "#F2F6FA", // azul claro sutil
  surface: "#FFFFFF",
  surfaceMuted: "#EAF0F6",
  outlineStrong: "#D1D9E6",
  outline: "#B0B8C1",
  text: "#1A2233", // azul escuro
  textSoft: "#3A4A66",
  textMuted: "#7A869A",
  brand: "#F3921B", // laranja principal
  brandSoft: "#F7B95E",
  brandDeep: "#C76B00",
  info: "#1B4F72", // azul escuro
  success: "#1C8C5B",
  warning: "#F7B731",
  danger: "#E74C3C",
  dangerSoft: "#C0392B",
  route: "#1B4F72", // azul escuro para botões e destaques
  routeDeep: "#13304A",
  overlay: "rgba(27, 79, 114, 0.10)",
  shadow: "#1B4F72",
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
