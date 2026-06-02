import React from "react";
import { StatusBar } from "expo-status-bar";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { EmergencyProvider, useEmergency } from "./src/contexts/EmergencyContext";

function AppContent() {
  const { emergency, connected, lastUpdate, resetEmergency } = useEmergency();

  return (
    <View style={[styles.container, emergency ? styles.panicBg : styles.normalBg]}>
      <View style={styles.glow} />

      <View style={styles.card}>
        <Text style={styles.kicker}>SafeStop UFRN</Text>
        <Text style={[styles.title, emergency ? styles.titlePanic : styles.titleNormal]}>
          {emergency ? "EMERGÊNCIA ATIVA" : "Sistema em Espera"}
        </Text>
        <Text style={styles.body}>
          {emergency
            ? "A botoeira foi acionada pelo ESP32 via USB Serial e o estado global mudou em tempo real."
            : "Aguardando o evento ALERTA vindo do ESP32 conectado ao notebook."}
        </Text>

        <View style={styles.statusRow}>
          <View style={[styles.dot, connected ? styles.dotOn : styles.dotOff]} />
          <Text style={styles.statusText}>{connected ? "Conectado ao bridge local" : "Desconectado"}</Text>
        </View>

        {lastUpdate ? <Text style={styles.timestamp}>Última atualização: {lastUpdate}</Text> : null}

        <Pressable
          onPress={resetEmergency}
          style={({ pressed }) => [
            styles.button,
            emergency ? styles.buttonVisible : styles.buttonMuted,
            pressed && styles.buttonPressed,
          ]}
        >
          <Text style={styles.buttonText}>Desarmar emergência</Text>
        </Pressable>
      </View>

      <StatusBar style="auto" />
    </View>
  );
}

export default function App() {
  return (
    <EmergencyProvider>
      <AppContent />
    </EmergencyProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  normalBg: {
    backgroundColor: "#07111f",
  },
  panicBg: {
    backgroundColor: "#5b0f1b",
  },
  glow: {
    position: "absolute",
    width: 360,
    height: 360,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.08)",
    top: -80,
    right: -90,
  },
  card: {
    width: "100%",
    maxWidth: 760,
    borderRadius: 28,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
    padding: 28,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 18 },
    shadowRadius: 30,
    elevation: 8,
  },
  kicker: {
    color: "#ffd166",
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 1.4,
    textTransform: "uppercase",
    marginBottom: 10,
  },
  title: {
    fontSize: 42,
    lineHeight: 48,
    fontWeight: "900",
    marginBottom: 16,
  },
  titleNormal: {
    color: "#f8fafc",
  },
  titlePanic: {
    color: "#fff5f5",
  },
  body: {
    color: "rgba(255,255,255,0.88)",
    fontSize: 18,
    lineHeight: 26,
    marginBottom: 20,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 999,
  },
  dotOn: {
    backgroundColor: "#22c55e",
  },
  dotOff: {
    backgroundColor: "#ef4444",
  },
  statusText: {
    color: "#e2e8f0",
    fontSize: 15,
    fontWeight: "600",
  },
  timestamp: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 13,
    marginBottom: 22,
  },
  button: {
    alignSelf: "flex-start",
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 14,
  },
  buttonVisible: {
    backgroundColor: "#ffffff",
  },
  buttonMuted: {
    backgroundColor: "rgba(255,255,255,0.22)",
  },
  buttonPressed: {
    transform: [{ scale: 0.98 }],
  },
  buttonText: {
    color: "#111827",
    fontSize: 16,
    fontWeight: "800",
  },
});
