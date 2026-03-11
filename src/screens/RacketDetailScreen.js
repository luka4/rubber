import React, { useMemo, useState } from "react";
import { FlatList, Modal, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import Share from "react-native-share";
import useAppStore from "../store/useAppStore";
import CircularHealth from "../components/CircularHealth";
import ReminderModal from "../components/ReminderModal";
import { fireCleaningReminder } from "../utils/notifications";
import { getHealth } from "../utils/lifespan";

export default function RacketDetailScreen({ route }) {
  const { racketId } = route.params;
  const [manualHours, setManualHours] = useState("");
  const [assignSide, setAssignSide] = useState(null);
  const [showReminder, setShowReminder] = useState(false);

  const skillLevel = useAppStore((s) => s.skillLevel);
  const rackets = useAppStore((s) => s.rackets);
  const rubbers = useAppStore((s) => s.rubbers);
  const assignRubberToRacket = useAppStore((s) => s.assignRubberToRacket);
  const logSessionForRacket = useAppStore((s) => s.logSessionForRacket);

  const racket = rackets.find((r) => r.id === racketId);
  const forehand = rubbers.find((x) => x.id === racket?.forehandRubberId) || null;
  const backhand = rubbers.find((x) => x.id === racket?.backhandRubberId) || null;

  const fhHealth = forehand ? getHealth(forehand.hoursPlayed, skillLevel) : null;
  const bhHealth = backhand ? getHealth(backhand.hoursPlayed, skillLevel) : null;

  const inventory = useMemo(() => [...rubbers].sort((a, b) => b.createdAt - a.createdAt), [rubbers]);

  if (!racket) {
    return (
      <View style={styles.page}>
        <Text style={styles.title}>Racket not found.</Text>
      </View>
    );
  }

  const postLogActions = async () => {
    setShowReminder(true);
    await fireCleaningReminder();
  };

  const quickLog = async () => {
    logSessionForRacket({ racketId, hours: 2 });
    await postLogActions();
  };

  const manualLog = async () => {
    const hours = Number(manualHours);
    if (!hours || hours <= 0) return;
    logSessionForRacket({ racketId, hours });
    setManualHours("");
    await postLogActions();
  };

  const assign = (rubberId) => {
    if (!assignSide) return;
    assignRubberToRacket({ racketId, side: assignSide, rubberId });
    setAssignSide(null);
  };

  const unassign = () => {
    if (!assignSide) return;
    assignRubberToRacket({ racketId, side: assignSide, rubberId: null });
    setAssignSide(null);
  };

  const shareSetup = async () => {
    const fhText = forehand ? `${forehand.brand} ${forehand.series} (${fhHealth}%)` : "Unassigned";
    const bhText = backhand ? `${backhand.brand} ${backhand.series} (${bhHealth}%)` : "Unassigned";
    const message = `Check out my setup: Blade: ${racket.name}, FH: ${fhText}, BH: ${bhText}`;
    await Share.open({ message });
  };

  const RubberCard = ({ side, rubber, health }) => (
    <View style={styles.rubberCard}>
      <View style={styles.rubberHeader}>
        <Text style={styles.side}>{side}</Text>
        <Pressable style={styles.assignBtn} onPress={() => setAssignSide(side)}>
          <Text style={styles.assignBtnText}>{rubber ? "Change" : "Assign"}</Text>
        </Pressable>
      </View>

      {rubber ? (
        <>
          <Text style={styles.rubberName}>
            {rubber.brand} {rubber.series}
          </Text>
          <Text style={styles.small}>Played: {rubber.hoursPlayed}h</Text>
          <CircularHealth health={health} />
          {health < 40 && (
            <Text style={styles.warning}>Time to buy a new rubber to maintain maximum spin!</Text>
          )}
        </>
      ) : (
        <Text style={styles.unassigned}>No rubber assigned.</Text>
      )}
    </View>
  );

  return (
    <View style={styles.page}>
      <Text style={styles.title}>{racket.name}</Text>

      <Pressable style={styles.quickLog} onPress={quickLog}>
        <Text style={styles.quickLogText}>Quick-Log Session (+2h)</Text>
      </Pressable>

      <View style={styles.manualRow}>
        <TextInput
          value={manualHours}
          onChangeText={setManualHours}
          keyboardType="numeric"
          placeholder="Manual hours"
          placeholderTextColor="#748095"
          style={styles.input}
        />
        <Pressable style={styles.addBtn} onPress={manualLog}>
          <Text style={styles.addText}>Log</Text>
        </Pressable>
      </View>

      <RubberCard side="FH" rubber={forehand} health={fhHealth ?? 0} />
      <RubberCard side="BH" rubber={backhand} health={bhHealth ?? 0} />

      <Pressable style={styles.shareBtn} onPress={shareSetup}>
        <Text style={styles.shareText}>Share Setup</Text>
      </Pressable>

      <Modal visible={!!assignSide} transparent animationType="slide" onRequestClose={() => setAssignSide(null)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Assign to {assignSide}</Text>
            <Pressable style={styles.unassignBtn} onPress={unassign}>
              <Text style={styles.unassignText}>Unassign</Text>
            </Pressable>

            <FlatList
              data={inventory}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <Pressable style={styles.inventoryItem} onPress={() => assign(item.id)}>
                  <Text style={styles.inventoryText}>
                    {item.brand} {item.series}
                  </Text>
                  <Text style={styles.inventorySub}>{item.hoursPlayed}h played</Text>
                </Pressable>
              )}
            />

            <Pressable style={styles.closeBtn} onPress={() => setAssignSide(null)}>
              <Text style={styles.closeText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <ReminderModal visible={showReminder} onClose={() => setShowReminder(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#0B0E13", padding: 16 },
  title: { color: "#FFF", fontSize: 23, fontWeight: "900", marginBottom: 10 },
  quickLog: {
    backgroundColor: "#2ECC71",
    borderRadius: 12,
    alignItems: "center",
    paddingVertical: 14,
    marginBottom: 10,
  },
  quickLogText: { color: "#08110B", fontWeight: "900", fontSize: 16 },
  manualRow: { flexDirection: "row", gap: 8, marginBottom: 10 },
  input: {
    flex: 1,
    backgroundColor: "#141B27",
    borderWidth: 1,
    borderColor: "#2B3548",
    borderRadius: 10,
    color: "#FFF",
    height: 44,
    paddingHorizontal: 12,
  },
  addBtn: {
    backgroundColor: "#34C0FF",
    borderRadius: 10,
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  addText: { color: "#061723", fontWeight: "900" },
  rubberCard: {
    backgroundColor: "#121A26",
    borderWidth: 1,
    borderColor: "#2A3345",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    alignItems: "center",
  },
  rubberHeader: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  side: { color: "#A9B4CA", fontWeight: "800", fontSize: 15 },
  assignBtn: { backgroundColor: "#202B3D", paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  assignBtnText: { color: "#D6DEED", fontWeight: "700" },
  rubberName: { color: "#FFF", fontWeight: "900", fontSize: 16, marginBottom: 4 },
  small: { color: "#A4AFBE", marginBottom: 8 },
  unassigned: { color: "#94A0B4", marginVertical: 14 },
  warning: {
    marginTop: 8,
    color: "#FF6B6B",
    fontWeight: "900",
    textAlign: "center",
  },
  shareBtn: {
    backgroundColor: "#8B5CF6",
    borderRadius: 11,
    alignItems: "center",
    paddingVertical: 12,
    marginTop: 4,
  },
  shareText: { color: "#F4ECFF", fontWeight: "800" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "flex-end",
  },
  modalCard: {
    maxHeight: "76%",
    backgroundColor: "#111925",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderTopWidth: 1,
    borderColor: "#2B3548",
    padding: 14,
  },
  modalTitle: { color: "#FFF", fontSize: 18, fontWeight: "900", marginBottom: 8 },
  unassignBtn: {
    backgroundColor: "#3A2430",
    borderRadius: 9,
    paddingVertical: 9,
    alignItems: "center",
    marginBottom: 10,
  },
  unassignText: { color: "#FF9DB5", fontWeight: "800" },
  inventoryItem: {
    backgroundColor: "#172131",
    borderWidth: 1,
    borderColor: "#2A3345",
    borderRadius: 10,
    padding: 10,
    marginBottom: 8,
  },
  inventoryText: { color: "#FFF", fontWeight: "800" },
  inventorySub: { color: "#9DA9BB", marginTop: 2 },
  closeBtn: {
    marginTop: 8,
    backgroundColor: "#202B3D",
    borderRadius: 10,
    alignItems: "center",
    paddingVertical: 10,
  },
  closeText: { color: "#D6DEED", fontWeight: "800" },
});
