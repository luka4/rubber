import React from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

export default function ReminderModal({ visible, onClose }) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>Session logged!</Text>
          <Text style={styles.message}>
            Don't forget to clean your rubbers with a sponge and cleaner to extend their
            lifespan.
          </Text>
          <Pressable style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>Got it</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.65)",
    justifyContent: "center",
    padding: 20,
  },
  card: {
    backgroundColor: "#131A24",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#2A3242",
    padding: 18,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "900",
    marginBottom: 10,
  },
  message: {
    color: "#D3DAE8",
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 16,
  },
  button: {
    alignSelf: "flex-end",
    backgroundColor: "#2ECC71",
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 9,
  },
  buttonText: {
    color: "#0B0E13",
    fontWeight: "800",
  },
});
