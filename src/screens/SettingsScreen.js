import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import useAppStore from "../store/useAppStore";
import { LIFESPAN_BY_SKILL } from "../utils/lifespan";

const LEVELS = ["Amateur", "Intermediate", "Pro"];

export default function SettingsScreen() {
  const skillLevel = useAppStore((s) => s.skillLevel);
  const setSkillLevel = useAppStore((s) => s.setSkillLevel);

  return (
    <View style={styles.page}>
      <Text style={styles.title}>Settings</Text>
      <Text style={styles.sectionTitle}>Skill Level</Text>

      <View style={styles.levelRow}>
        {LEVELS.map((level) => {
          const active = level === skillLevel;
          return (
            <Pressable
              key={level}
              style={[styles.pill, active && styles.activePill]}
              onPress={() => setSkillLevel(level)}
            >
              <Text style={[styles.pillText, active && styles.activePillText]}>{level}</Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>Rubber Lifespan Rule</Text>
        <Text style={styles.infoDescription}>
          Rubber wear is calculated from both played hours and each rubber's durability rating.
          Durability values are based on review data from revspin.net, so tougher rubbers keep
          health longer than less durable ones.
        </Text>
        <Text style={styles.infoText}>Pro: {LIFESPAN_BY_SKILL.Pro}h</Text>
        <Text style={styles.infoText}>Intermediate: {LIFESPAN_BY_SKILL.Intermediate}h</Text>
        <Text style={styles.infoText}>Amateur: {LIFESPAN_BY_SKILL.Amateur}h</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#0B0E13", padding: 16 },
  title: { color: "#FFFFFF", fontSize: 22, fontWeight: "900", marginBottom: 12 },
  sectionTitle: { color: "#C7D0E0", marginBottom: 10, fontWeight: "700" },
  levelRow: { flexDirection: "row", gap: 8, marginBottom: 16 },
  pill: {
    backgroundColor: "#1A2230",
    borderColor: "#2F394C",
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 999,
  },
  activePill: {
    backgroundColor: "#2ECC71",
    borderColor: "#2ECC71",
  },
  pillText: { color: "#D6DEED", fontWeight: "700" },
  activePillText: { color: "#0B0E13" },
  infoCard: {
    backgroundColor: "#121A26",
    borderColor: "#2A3345",
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
  },
  infoTitle: { color: "#FFF", fontWeight: "800", marginBottom: 8 },
  infoDescription: { color: "#C7D4E8", marginBottom: 10, lineHeight: 20 },
  infoText: { color: "#B7C1D5", marginBottom: 4 },
});
