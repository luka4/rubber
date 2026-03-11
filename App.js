import "react-native-gesture-handler";
import React, { useEffect } from "react";
import { StatusBar, StyleSheet, View } from "react-native";
import * as Notifications from "expo-notifications";
import AppNavigator from "./src/navigation/AppNavigator";
import { requestNotificationPermissions } from "./src/utils/notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default function App() {
  useEffect(() => {
    requestNotificationPermissions();
  }, []);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />
      <View style={styles.content}>
        <AppNavigator />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#0B0E13",
  },
  content: {
    flex: 1,
  },
});
