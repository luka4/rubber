import "react-native-gesture-handler";
import React, { useEffect } from "react";
import { StatusBar, StyleSheet, View } from "react-native";
import * as Notifications from "expo-notifications";
import mobileAds from "react-native-google-mobile-ads";
import AppNavigator from "./src/navigation/AppNavigator";
import BottomAdBanner from "./src/components/BottomAdBanner";
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
    mobileAds().initialize();
  }, []);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />
      <View style={styles.content}>
        <AppNavigator />
      </View>
      <BottomAdBanner />
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
    paddingBottom: 58,
  },
});
