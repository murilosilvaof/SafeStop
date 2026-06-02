import { Platform } from "react-native";

const isLocalWeb =
  Platform.OS === "web" &&
  typeof window !== "undefined" &&
  ["localhost", "127.0.0.1"].includes(window.location.hostname);

const DEFAULT_BACKEND_URL = isLocalWeb
  ? "http://localhost:8000"
  : "https://safestop.ect.ufrn.br";

export const SOCKET_URL =
  process.env.EXPO_PUBLIC_SAFESTOP_SOCKET_URL ?? DEFAULT_BACKEND_URL;

export const API_URL =
  process.env.EXPO_PUBLIC_SAFESTOP_API_URL ?? DEFAULT_BACKEND_URL;
