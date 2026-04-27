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

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

const Tab = createMaterialTopTabNavigator();

export default function App() {
  const state = useSafeStopState();

  return (
    <NavigationContainer>
      <StatusBar backgroundColor={colors.route} barStyle="light-content" />

      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarShowIcon: true,
          tabBarActiveTintColor: '#FFF',
          tabBarInactiveTintColor: '#F7B95E',
          tabBarIndicatorStyle: {
            backgroundColor: colors.brand,
            height: 5,
            borderRadius: 3,
          },
          tabBarStyle: {
            backgroundColor: colors.brand,
            borderBottomWidth: 0,
            elevation: 6,
            shadowColor: colors.brandDeep,
          },
          tabBarLabelStyle: {
            fontWeight: 'bold',
            fontSize: 14,
            textTransform: 'uppercase',
          },
          tabBarIcon: ({ color, size }) => {
            const icons = {
              Principal: 'warning-outline',
              Horarios: 'bus-outline',
              Perfil: 'person-outline',
            };
            return <Ionicons color={color} name={icons[route.name] ?? 'ellipse'} size={size} />;
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
