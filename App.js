import React from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import { colors } from "./src/constants/theme";
import { useSafeStopState } from "./src/hooks/useSafeStopState";
import { HomeScreen } from "./src/screens/HomeScreen";
import { ProfileScreen } from "./src/screens/ProfileScreen";
import { SchedulesScreen } from "./src/screens/SchedulesScreen";
import { RegistrationScreen } from "./src/screens/RegistrationScreen";
import { ContactsScreen } from "./src/screens/ContactsScreen";

const logo = require("./assets/logo.jpeg");
const Tab = createBottomTabNavigator();

function EmergencyOverlay({ alertData, onAcknowledge }) {
  if (!alertData) {
    return null;
  }

  return (
    <View style={styles.emergencyOverlay}>
      <View style={styles.emergencyBackdrop} />
      <SafeAreaView style={styles.emergencyContent}>
        <View style={styles.emergencyBadge}>
          <Ionicons color="#FFFFFF" name="warning" size={18} />
          <Text style={styles.emergencyBadgeText}>EMERGENCIA</Text>
        </View>

        <Text style={styles.emergencyTitle}>ALERTA DE PANICO</Text>
        <Text style={styles.emergencySubtitle}>
          {alertData.stopName ?? alertData.idTotem} acionado em {alertData.createdAt}.
        </Text>

        <View style={styles.emergencyCard}>
          <Text style={styles.emergencyCardLabel}>Totem</Text>
          <Text style={styles.emergencyCardValue}>{alertData.idTotem}</Text>
          <Text style={styles.emergencyCardMeta}>
            Coordenadas {alertData.latitude}, {alertData.longitude}
          </Text>
        </View>

        <View style={styles.emergencyCard}>
          <Text style={styles.emergencyCardLabel}>Acao esperada</Text>
          <Text style={styles.emergencyCardValueSmall}>Equipe em alerta imediato</Text>
          <Text style={styles.emergencyCardMeta}>
            Esta tela responde ao mesmo evento `hardware:danger` que o backend dispararia.
          </Text>
        </View>

        <Pressable onPress={onAcknowledge} style={styles.emergencyButton}>
          <Text style={styles.emergencyButtonText}>Reconhecer alerta</Text>
        </Pressable>
      </SafeAreaView>
    </View>
  );
}

function LoadingScreen() {
  return (
    <SafeAreaView style={styles.loadingScreen}>
      <ActivityIndicator color={colors.brand} size="large" />
      <Text style={styles.loadingText}>Carregando cadastro local do SafeStop...</Text>
    </SafeAreaView>
  );
}

export default function App() {
  const state = useSafeStopState();
  const hardwareActive = Boolean(state.hardwareState?.active || state.lastHardwareAlert);

  if (!state.isReady) {
    return <LoadingScreen />;
  }

  if (!state.hasProfile) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar backgroundColor={colors.background} barStyle="dark-content" />
        <RegistrationScreen onSubmit={state.saveProfile} />
      </SafeAreaView>
    );
  }

  return (
    <NavigationContainer>
      <SafeAreaView style={styles.safeArea}>
        <Image source={logo} style={styles.watermark} resizeMode="contain" pointerEvents="none" />
        <StatusBar
          backgroundColor={hardwareActive ? "#7A0000" : colors.route}
          barStyle="light-content"
        />

        <View style={styles.header}>
          <Image source={logo} style={styles.logo} resizeMode="contain" />
          <View style={styles.brandCopy}>
            <Text style={styles.brandTitle}>SafeStop UFRN</Text>
            <Text style={styles.brandSubtitle}>
              {hardwareActive
                ? "ALERTA DE PANICO ATIVO"
                : state.connectionStatus === "connected"
                ? "Central online em producao"
                : "Aguardando conexao com a central"}
            </Text>
          </View>
          <View
            style={[
              styles.connectionBadge,
              hardwareActive
                ? styles.connectionBadgeDanger
                : state.connectionStatus === "connected"
                ? styles.connectionBadgeOnline
                : styles.connectionBadgeOffline,
            ]}
          >
            <Text style={styles.connectionBadgeText}>
              {hardwareActive
                ? "Emergencia"
                : state.connectionStatus === "connected"
                ? "Online"
                : "Offline"}
            </Text>
          </View>
        </View>

        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarActiveTintColor: colors.brand,
            tabBarInactiveTintColor: colors.textMuted,
            tabBarStyle: styles.tabBar,
            tabBarLabelStyle: styles.tabLabel,
            tabBarIcon: ({ color, size }) => {
              const icons = {
                Central: "shield-checkmark-outline",
                Horarios: "bus-outline",
                Contatos: "call-outline",
                Perfil: "person-outline",
              };
              return <Ionicons color={color} name={icons[route.name] ?? "ellipse"} size={size} />;
            },
          })}
        >
          <Tab.Screen name="Central">
            {(props) => <HomeScreen {...props} state={state} />}
          </Tab.Screen>

          <Tab.Screen name="Horarios">
            {(props) => <SchedulesScreen {...props} state={state} />}
          </Tab.Screen>

          <Tab.Screen name="Contatos">
            {(props) => <ContactsScreen {...props} state={state} />}
          </Tab.Screen>

          <Tab.Screen name="Perfil">
            {(props) => <ProfileScreen {...props} state={state} />}
          </Tab.Screen>
        </Tab.Navigator>

        <EmergencyOverlay
          alertData={state.lastHardwareAlert}
          onAcknowledge={state.clearHardwareAlert}
        />
      </SafeAreaView>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingScreen: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
    gap: 14,
  },
  loadingText: {
    color: colors.textSoft,
    fontSize: 14,
    fontWeight: "700",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: colors.surfaceStrong,
    borderBottomWidth: 1,
    borderBottomColor: colors.outlineStrong,
    gap: 12,
  },
  logo: {
    width: 60,
    height: 60,
    borderRadius: 14,
  },
  brandCopy: {
    flex: 1,
    justifyContent: "center",
  },
  brandTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "800",
  },
  brandSubtitle: {
    color: colors.textMuted,
    fontSize: 13,
    marginTop: 2,
  },
  connectionBadge: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  connectionBadgeOnline: {
    backgroundColor: "#E7F8EF",
  },
  connectionBadgeOffline: {
    backgroundColor: "#FFF2E8",
  },
  connectionBadgeDanger: {
    backgroundColor: "#FFE3E3",
  },
  connectionBadgeText: {
    color: colors.text,
    fontSize: 12,
    fontWeight: "800",
  },
  tabBar: {
    backgroundColor: colors.surfaceStrong,
    borderTopWidth: 1,
    borderTopColor: colors.outlineStrong,
    height: 70,
    paddingBottom: 10,
    paddingTop: 8,
    elevation: 12,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: -1 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: "700",
    textTransform: "capitalize",
  },
  watermark: {
    position: "absolute",
    width: 360,
    height: 360,
    opacity: 0.16,
    top: 120,
    right: -24,
    zIndex: -1,
  },
  emergencyOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 999,
  },
  emergencyBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(92, 0, 0, 0.94)",
  },
  emergencyContent: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 28,
    justifyContent: "center",
    gap: 18,
  },
  emergencyBadge: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderRadius: 999,
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  emergencyBadgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 1.5,
  },
  emergencyTitle: {
    color: "#FFFFFF",
    fontSize: 40,
    lineHeight: 44,
    fontWeight: "900",
    letterSpacing: 1,
  },
  emergencySubtitle: {
    color: "#FBE9E9",
    fontSize: 17,
    lineHeight: 26,
    fontWeight: "700",
    maxWidth: 560,
  },
  emergencyCard: {
    borderRadius: 24,
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.18)",
    padding: 18,
    gap: 6,
    maxWidth: 560,
  },
  emergencyCardLabel: {
    color: "#FFB8B8",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  emergencyCardValue: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "900",
  },
  emergencyCardValueSmall: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800",
  },
  emergencyCardMeta: {
    color: "#F5D4D4",
    fontSize: 14,
    lineHeight: 22,
  },
  emergencyButton: {
    alignSelf: "flex-start",
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  emergencyButtonText: {
    color: "#6F0000",
    fontSize: 14,
    fontWeight: "900",
  },
});
