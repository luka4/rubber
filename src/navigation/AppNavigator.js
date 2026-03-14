import React from "react";
import { NavigationContainer, DarkTheme } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import RacketsScreen from "../screens/RacketsScreen";
import RacketDetailScreen from "../screens/RacketDetailScreen";
import RubbersScreen from "../screens/RubbersScreen";
import SettingsScreen from "../screens/SettingsScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function RacketsStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "#0F141D" },
        headerTintColor: "#FFFFFF",
        contentStyle: { backgroundColor: "#0B0E13" },
      }}
    >
      <Stack.Screen name="RacketsList" component={RacketsScreen} options={{ title: "Rackets" }} />
      <Stack.Screen
        name="RacketDetail"
        component={RacketDetailScreen}
        options={{ title: "Racket Dashboard" }}
      />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  const theme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      background: "#0B0E13",
      card: "#101722",
      text: "#FFFFFF",
      border: "#222B3A",
      primary: "#2ECC71",
    },
  };

  return (
    <NavigationContainer theme={theme}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarStyle: { backgroundColor: "#0F141D", borderTopColor: "#1C2433" },
          tabBarActiveTintColor: "#2ECC71",
          tabBarInactiveTintColor: "#7C8798",
          tabBarIcon: ({ color, size }) => {
            if (route.name === "Rackets") {
              return <MaterialCommunityIcons name="table-tennis" size={size} color={color} />;
            }

            const iconMap = {
              Rubbers: "layers",
              Settings: "settings",
            };
            return <Ionicons name={iconMap[route.name]} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Rackets" component={RacketsStack} />
        <Tab.Screen name="Rubbers" component={RubbersScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
