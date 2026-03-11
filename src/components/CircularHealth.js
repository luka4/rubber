import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { getHealthColor } from "../utils/lifespan";

const SIZE = 88;
const STROKE = 9;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function CircularHealth({ health }) {
  const clamped = Math.max(0, Math.min(100, health));
  const color = getHealthColor(clamped);
  const progress = CIRCUMFERENCE - (clamped / 100) * CIRCUMFERENCE;

  return (
    <View style={styles.wrapper}>
      <Svg width={SIZE} height={SIZE}>
        <Circle
          stroke="#1B2230"
          fill="none"
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          strokeWidth={STROKE}
        />
        <Circle
          stroke={color}
          fill="none"
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={`${CIRCUMFERENCE} ${CIRCUMFERENCE}`}
          strokeDashoffset={progress}
          rotation="-90"
          origin={`${SIZE / 2}, ${SIZE / 2}`}
        />
      </Svg>
      <View style={styles.labelWrap}>
        <Text style={[styles.value, { color }]}>{clamped}%</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: SIZE,
    height: SIZE,
    justifyContent: "center",
    alignItems: "center",
  },
  labelWrap: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  value: {
    fontSize: 17,
    fontWeight: "800",
  },
});
