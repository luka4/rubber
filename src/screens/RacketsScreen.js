import React, { useMemo, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import useAppStore from "../store/useAppStore";

export default function RacketsScreen({ navigation }) {
  const [name, setName] = useState("");
  const rackets = useAppStore((s) => s.rackets);
  const addRacket = useAppStore((s) => s.addRacket);

  const sorted = useMemo(() => [...rackets].sort((a, b) => b.createdAt - a.createdAt), [rackets]);

  const handleAdd = () => {
    if (!name.trim()) return;
    addRacket(name);
    setName("");
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
        <Pressable style={styles.addBtn} onPress={handleAdd}>
          <Text style={styles.addText}>Add</Text>
        </Pressable>
      </View>

      <FlatList
        data={sorted}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text style={styles.empty}>No rackets yet. Add your first setup.</Text>}
        renderItem={({ item }) => (
          <Pressable
            style={styles.card}
            onPress={() => navigation.navigate("RacketDetail", { racketId: item.id })}
          >
            <Text style={styles.cardTitle}>{item.name}</Text>
            <Text style={styles.cardSub}>Open dashboard</Text>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#0B0E13", padding: 16 },
  title: { color: "#FFFFFF", fontSize: 22, fontWeight: "900", marginBottom: 12 },
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
  addText: { color: "#0B0E13", fontWeight: "800" },
  empty: { color: "#9AA4B6", marginTop: 20 },
  card: {
    backgroundColor: "#121A26",
    borderColor: "#2A3345",
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  cardTitle: { color: "#FFF", fontWeight: "800", fontSize: 16 },
  cardSub: { color: "#9AA4B6", marginTop: 2 },
});
