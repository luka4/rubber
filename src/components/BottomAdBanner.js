import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Constants from "expo-constants";
import { BannerAd, BannerAdSize, TestIds } from "react-native-google-mobile-ads";

const adUnitId = __DEV__ ? TestIds.BANNER : "ca-app-pub-xxxxxxxxxxxxxxxx/xxxxxxxxxx";

export default function BottomAdBanner() {
  const isExpoGo = Constants.appOwnership === "expo";

  return (
    <View style={styles.wrap}>
      {isExpoGo ? (
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>Ad Placeholder (Expo Go)</Text>
        </View>
      ) : (
        <BannerAd unitId={adUnitId} size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    backgroundColor: "#0B0E13",
    borderTopWidth: 1,
    borderTopColor: "#1E2634",
    paddingVertical: 4,
  },
  placeholder: {
    height: 50,
    width: "100%",
    backgroundColor: "#333",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    color: "#fff",
  },
});
