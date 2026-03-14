import "react-native-gesture-handler";
import React from "react";
import { StatusBar, StyleSheet, View } from "react-native";
import AppNavigator from "./src/navigation/AppNavigator";

export default function App() {
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
