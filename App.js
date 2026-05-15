import React from "react";
import { SafeAreaView, StatusBar, StyleSheet, View, Image, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import { colors } from "./src/constants/theme";
import { useSafeStopState } from "./src/hooks/useSafeStopState";
import { HomeScreen } from "./src/screens/HomeScreen";
import { ProfileScreen } from "./src/screens/ProfileScreen";
import { SchedulesScreen } from "./src/screens/SchedulesScreen";

const logo = require("./assets/logo.jpeg");
const Tab = createBottomTabNavigator();

export default function App() {
  const state = useSafeStopState();

  return (
    <NavigationContainer>
      <SafeAreaView style={styles.safeArea}>
        <Image source={logo} style={styles.watermark} resizeMode="contain" pointerEvents="none" />
        <StatusBar backgroundColor={colors.route} barStyle="light-content" />

        <View style={styles.header}>
          <Image source={logo} style={styles.logo} resizeMode="contain" />
          <View style={styles.brandCopy}>
            <Text style={styles.brandTitle}>SafeStop</Text>
            <Text style={styles.brandSubtitle}>Atendimento seguro e moderno</Text>
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
                Principal: "warning-outline",
                Horarios: "bus-outline",
                Perfil: "person-outline",
              };
              return <Ionicons color={color} name={icons[route.name] ?? "ellipse"} size={size} />;
            },
          })}
        >
          <Tab.Screen name="Principal">
            {(props) => <HomeScreen {...props} state={state} />}
          </Tab.Screen>

          <Tab.Screen name="Horarios">
            {(props) => <SchedulesScreen {...props} state={state} />}
          </Tab.Screen>

          <Tab.Screen name="Perfil">
            {(props) => <ProfileScreen {...props} state={state} />}
          </Tab.Screen>
        </Tab.Navigator>
      </SafeAreaView>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: colors.surfaceStrong,
    borderBottomWidth: 1,
    borderBottomColor: colors.outlineStrong,
  },
  logo: {
    width: 60,
    height: 60,
    borderRadius: 14,
    marginRight: 14,
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
});
