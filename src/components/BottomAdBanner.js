import React from "react";
import { StyleSheet, View } from "react-native";
import { BannerAd, BannerAdSize, TestIds } from "react-native-google-mobile-ads";

const adUnitId = __DEV__ ? TestIds.BANNER : "ca-app-pub-xxxxxxxxxxxxxxxx/xxxxxxxxxx";

export default function BottomAdBanner() {
  return (
    <View style={styles.wrap}>
      <BannerAd unitId={adUnitId} size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER} />
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
});
