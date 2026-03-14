import React, { useMemo, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DragList from "react-native-draglist";
import useAppStore from "../store/useAppStore";
import CircularHealth from "../components/CircularHealth";
import { getDurability, getHealth } from "../utils/lifespan";

export default function RacketsScreen({ navigation }) {
  const [name, setName] = useState("");
  const skillLevel = useAppStore((s) => s.skillLevel);
  const rackets = useAppStore((s) => s.rackets);
  const rubbers = useAppStore((s) => s.rubbers);
  const addRacket = useAppStore((s) => s.addRacket);
  const deleteRacket = useAppStore((s) => s.deleteRacket);
  const reorderRackets = useAppStore((s) => s.reorderRackets);

  const canAdd = !!name.trim();
  const racketsWithHealth = useMemo(
    () =>
      rackets.map((racket) => {
        const assigned = [racket.forehandRubberId, racket.backhandRubberId]
          .map((id) => rubbers.find((rubber) => rubber.id === id))
          .filter(Boolean);
        if (assigned.length < 2) return { ...racket, averageHealth: null };
        const total = assigned.reduce(
          (sum, rubber) =>
            sum + getHealth(rubber.hoursPlayed, skillLevel, getDurability(rubber.brand, rubber.series)),
          0
        );
        return { ...racket, averageHealth: Math.round(total / assigned.length) };
      }),
    [rackets, rubbers, skillLevel]
  );

  const handleAdd = () => {
    if (!name.trim()) return;
    addRacket(name);
    setName("");
  };

  const confirmDeleteRacket = (racket) => {
    Alert.alert("Delete racket?", `Delete assigned rubbers as well?\n\n${racket.name}`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Keep Rubbers",
        style: "destructive",
        onPress: () => deleteRacket({ racketId: racket.id, deleteAssignedRubbers: false }),
      },
      {
        text: "Delete assigned rubbers as well",
        style: "destructive",
        onPress: () => deleteRacket({ racketId: racket.id, deleteAssignedRubbers: true }),
      },
    ]);
  };

  const moveItem = (list, fromIndex, toIndex) => {
    const next = [...list];
    const [moved] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, moved);
    return next;
  };

  return (
    <View style={styles.page}>
      <Text style={styles.title}>Table Tennis Rubber Track</Text>

      <View style={styles.row}>
        <TextInput
          style={styles.input}
          placeholder="Racket name (e.g. Main Setup)"
          placeholderTextColor="#7D8798"
          value={name}
          onChangeText={setName}
        />
        <Pressable
          style={[styles.addBtn, !canAdd && styles.addBtnDisabled]}
          onPress={handleAdd}
          disabled={!canAdd}
        >
          <Text style={styles.addText}>Add</Text>
        </Pressable>
      </View>

      <DragList
        containerStyle={styles.list}
        data={racketsWithHealth}
        keyExtractor={(item) => item.id}
        onReordered={(fromIndex, toIndex) => {
          const reordered = moveItem(racketsWithHealth, fromIndex, toIndex);
          reorderRackets(reordered.map(({ averageHealth, ...racket }) => racket));
        }}
        ListEmptyComponent={<Text style={styles.empty}>No rackets yet. Add your first setup.</Text>}
        renderItem={({ item, onDragStart, onDragEnd, isActive }) => (
          <View style={[styles.card, isActive && styles.cardActive]}>
            <Pressable
              style={styles.cardMain}
              onPress={() => navigation.navigate("RacketDetail", { racketId: item.id })}
            >
              <Text style={styles.cardTitle}>{item.name}</Text>
              <Text style={styles.cardSub}>Open dashboard</Text>
            </Pressable>
            <View style={styles.cardRight}>
              <Pressable style={styles.dragHandle} onPressIn={onDragStart} onPressOut={onDragEnd}>
                <Ionicons name="reorder-three" size={18} color="#AFC0D8" />
              </Pressable>
              <View style={styles.healthWrap}>
                {item.averageHealth === null ? (
                  <Text style={styles.noHealth}>--</Text>
                ) : (
                  <CircularHealth health={item.averageHealth} size={42} stroke={5} />
                )}
              </View>
              <Pressable
                style={styles.trashBtn}
                onPress={() => confirmDeleteRacket(item)}
                hitSlop={8}
              >
                <Ionicons name="trash-outline" size={18} color="#FFBDCD" />
              </Pressable>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#0B0E13", padding: 16 },
  title: { color: "#FFFFFF", fontSize: 22, fontWeight: "900", marginBottom: 12 },
  list: { flex: 1 },
  row: { flexDirection: "row", gap: 8, marginBottom: 14 },
  input: {
    flex: 1,
    backgroundColor: "#141B27",
    borderWidth: 1,
    borderColor: "#283040",
    color: "#FFF",
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 46,
  },
  addBtn: {
    backgroundColor: "#2ECC71",
    borderRadius: 10,
    paddingHorizontal: 16,
    justifyContent: "center",
  },
  addBtnDisabled: {
    opacity: 0.45,
  },
  addText: { color: "#0B0E13", fontWeight: "800" },
  empty: { color: "#9AA4B6", marginTop: 20 },
  card: {
    backgroundColor: "#121A26",
    borderColor: "#2A3345",
    borderWidth: 1,
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  cardActive: {
    opacity: 0.9,
  },
  cardMain: { flex: 1, padding: 4 },
  cardTitle: { color: "#FFF", fontWeight: "800", fontSize: 16 },
  cardSub: { color: "#9AA4B6", marginTop: 2 },
  cardRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  healthWrap: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#101722",
    borderWidth: 1,
    borderColor: "#2A3345",
  },
  noHealth: { color: "#79859A", fontWeight: "700" },
  dragHandle: {
    width: 30,
    height: 30,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1A2230",
  },
  trashBtn: {
    width: 30,
    height: 30,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#3A2028",
  },
});
