import React from "react";
import { StatusBar } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import { colors } from "./src/constants/theme";
import { useSafeStopState } from "./src/hooks/useSafeStopState";
import { HomeScreen } from "./src/screens/HomeScreen";
import { ProfileScreen } from "./src/screens/ProfileScreen";
import { SchedulesScreen } from "./src/screens/SchedulesScreen";

const Tab = createBottomTabNavigator();

export default function App() {
  const state = useSafeStopState();

  return (
    <NavigationContainer>
      <StatusBar backgroundColor={colors.route} barStyle="light-content" />

      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          sceneStyle: {
            backgroundColor: colors.background,
          },
          tabBarHideOnKeyboard: true,
          tabBarActiveTintColor: "#FFFFFF",
          tabBarInactiveTintColor: "#FFD2D2",
          tabBarIcon: ({ color, size }) => {
            const icons = {
              Principal: "warning-outline",
              Horarios: "bus-outline",
              Perfil: "person-outline",
            };

            return <Ionicons color={color} name={icons[route.name] ?? "ellipse"} size={size} />;
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: "700",
            marginBottom: 4,
          },
          tabBarStyle: {
            position: "absolute",
            left: 16,
            right: 16,
            bottom: 16,
            height: 72,
            paddingTop: 8,
            paddingBottom: 8,
            borderTopWidth: 0,
            borderRadius: 28,
            backgroundColor: colors.route,
            shadowColor: colors.shadow,
            shadowOffset: { width: 0, height: 12 },
            shadowOpacity: 0.18,
            shadowRadius: 18,
            elevation: 12,
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
    </NavigationContainer>
  );
}
