import React from "react";
import { StatusBar } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { useSafeStopState } from "./src/hooks/useSafeStopState";
import { HomeScreen } from "./src/screens/HomeScreen";
import { AlertsScreen } from "./src/screens/AlertsScreen";
import { ChatScreen } from "./src/screens/ChatScreen";
import { StopDetailScreen } from "./src/screens/StopDetailScreen";
import { HistoryScreen } from "./src/screens/HistoryScreen";
import { ProfileScreen } from "./src/screens/ProfileScreen";
import { colors } from "./src/constants/theme";

const Tab = createBottomTabNavigator();

export default function App() {
  const state = useSafeStopState();

  return (
    <NavigationContainer>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />

      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ color, size }) => {
            const icons = {
              "Início":    "home",
              "Parada":    "location",
              "Alertas":   "notifications",
              "Histórico": "time",
              "Segurança": "shield-checkmark",
              "Perfil":    "person",
            };
            return <Ionicons name={icons[route.name] || "ellipse"} size={size} color={color} />;
          },
          tabBarActiveTintColor: colors.brand,
          tabBarInactiveTintColor: "gray",
          tabBarStyle: {
            backgroundColor: colors.background,
            borderTopColor: colors.outline,
            paddingBottom: 5,
            height: 60,
          },
        })}
      >
        <Tab.Screen name="Início">
          {() => <HomeScreen state={state} />}
        </Tab.Screen>

        <Tab.Screen name="Parada">
          {() => <StopDetailScreen state={state} />}
        </Tab.Screen>

        <Tab.Screen name="Alertas">
          {() => <AlertsScreen state={state} />}
        </Tab.Screen>

        <Tab.Screen name="Histórico">
          {() => <HistoryScreen state={state} />}
        </Tab.Screen>

        <Tab.Screen name="Segurança">
          {() => <ChatScreen state={state} />}
        </Tab.Screen>

        <Tab.Screen name="Perfil">
          {() => <ProfileScreen state={state} />}
        </Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );
}