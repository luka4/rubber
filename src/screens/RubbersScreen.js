import React, { useMemo, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { Picker } from "@react-native-picker/picker";
import useAppStore from "../store/useAppStore";
import rubberCatalog from "../data/rubberCatalog";
import { getHealth } from "../utils/lifespan";

export default function RubbersScreen() {
  const skillLevel = useAppStore((s) => s.skillLevel);
  const rubbers = useAppStore((s) => s.rubbers);
  const addRubber = useAppStore((s) => s.addRubber);

  const brands = useMemo(() => Object.keys(rubberCatalog), []);
  const [brand, setBrand] = useState(brands[0]);
  const [series, setSeries] = useState(rubberCatalog[brands[0]][0]);

  const currentSeries = rubberCatalog[brand];

  const onBrandChange = (nextBrand) => {
    setBrand(nextBrand);
    setSeries(rubberCatalog[nextBrand][0]);
  };

  return (
    <View style={styles.page}>
      <Text style={styles.title}>Rubber Inventory</Text>

      <View style={styles.pickerBox}>
        <Text style={styles.label}>Brand</Text>
        <Picker
          selectedValue={brand}
          onValueChange={onBrandChange}
          style={styles.picker}
          dropdownIconColor="#fff"
        >
          {brands.map((b) => (
            <Picker.Item key={b} label={b} value={b} color="#fff" />
          ))}
        </Picker>

        <Text style={styles.label}>Series</Text>
        <Picker
          selectedValue={series}
          onValueChange={setSeries}
          style={styles.picker}
          dropdownIconColor="#fff"
        >
          {currentSeries.map((s) => (
            <Picker.Item key={s} label={s} value={s} color="#fff" />
          ))}
        </Picker>

        <Pressable style={styles.addBtn} onPress={() => addRubber({ brand, series })}>
          <Text style={styles.addBtnText}>Add Rubber</Text>
        </Pressable>
      </View>

      <FlatList
        data={[...rubbers].sort((a, b) => b.createdAt - a.createdAt)}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text style={styles.empty}>No rubbers yet.</Text>}
        renderItem={({ item }) => {
          const health = getHealth(item.hoursPlayed, skillLevel);
          return (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>
                {item.brand} {item.series}
              </Text>
              <Text style={styles.cardSub}>
                Played: {item.hoursPlayed}h | Health: {health}%
              </Text>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#0B0E13", padding: 16 },
  title: { color: "#FFFFFF", fontSize: 22, fontWeight: "900", marginBottom: 12 },
  pickerBox: {
    backgroundColor: "#121A26",
    borderColor: "#2A3345",
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  label: { color: "#B7C1D5", marginTop: 4, marginBottom: 2, fontWeight: "700" },
  picker: { color: "#FFF", backgroundColor: "#1A2230", borderRadius: 8 },
  addBtn: {
    marginTop: 10,
    backgroundColor: "#2ECC71",
    alignItems: "center",
    borderRadius: 10,
    paddingVertical: 10,
  },
  addBtnText: { color: "#0B0E13", fontWeight: "800" },
  empty: { color: "#9AA4B6", marginTop: 20 },
  card: {
    backgroundColor: "#121A26",
    borderColor: "#2A3345",
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  cardTitle: { color: "#FFF", fontWeight: "800" },
  cardSub: { color: "#9AA4B6", marginTop: 4 },
});
