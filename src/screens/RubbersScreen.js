import React, { useEffect, useMemo, useState } from "react";
import { Alert, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons";
import DragList from "react-native-draglist";
import useAppStore from "../store/useAppStore";
import rubberCatalog from "../data/rubberCatalog";
import { getDurability, getHealth } from "../utils/lifespan";

const normalizeSeriesEntry = (entry) =>
  typeof entry === "string" ? { series: entry } : entry;

const sortSeriesEntries = (entries) =>
  [...entries].sort((a, b) =>
    a.series.localeCompare(b.series, undefined, { numeric: true, sensitivity: "base" })
  );

const RUBBER_COLORS = [
  { id: "red", label: "Red", value: "#D62828" },
  { id: "black", label: "Black", value: "#101010" },
  { id: "green", label: "Green", value: "#2ECC71" },
  { id: "light-blue", label: "Light Blue", value: "#4FC3F7" },
  { id: "pink", label: "Pink", value: "#FF5CA8" },
  { id: "purple", label: "Purple", value: "#9B59B6" },
];

const getColorHex = (colorId) => RUBBER_COLORS.find((item) => item.id === colorId)?.value ?? "#101010";
const SPONGE_THICKNESS_OPTIONS = [
  0.0,
  ...Array.from({ length: 23 }, (_, i) => Number((0.5 + i * 0.1).toFixed(1))),
];

export default function RubbersScreen({ navigation, route }) {
  const skillLevel = useAppStore((s) => s.skillLevel);
  const rubbers = useAppStore((s) => s.rubbers);
  const addRubber = useAppStore((s) => s.addRubber);
  const updateRubber = useAppStore((s) => s.updateRubber);
  const deleteRubber = useAppStore((s) => s.deleteRubber);
  const reorderRubbers = useAppStore((s) => s.reorderRubbers);
  const assignRubberToRacket = useAppStore((s) => s.assignRubberToRacket);
  const pendingAssign = route?.params?.pendingAssign;

  const brands = useMemo(() => Object.keys(rubberCatalog), []);
  const firstBrand = brands[0] ?? "";
  const getSeriesOptions = (nextBrand) =>
    sortSeriesEntries(
      (rubberCatalog[nextBrand] ?? [])
        .map(normalizeSeriesEntry)
        .filter((entry) => typeof entry?.series === "string" && entry.series.length > 0)
    );
  const [brand, setBrand] = useState(firstBrand);
  const [series, setSeries] = useState(getSeriesOptions(firstBrand)[0]?.series ?? "");
  const [color, setColor] = useState("black");
  const [spongeThickness, setSpongeThickness] = useState(2.1);
  const [editingRubberId, setEditingRubberId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const pickerItemColor = Platform.OS === "android" ? "#0B0E13" : undefined;

  const currentSeriesOptions = useMemo(() => getSeriesOptions(brand), [brand]);

  useEffect(() => {
    if (pendingAssign) {
      setShowForm(true);
    }
  }, [pendingAssign]);

  const onBrandChange = (nextBrand) => {
    setBrand(nextBrand);
    setSeries(getSeriesOptions(nextBrand)[0]?.series ?? "");
  };

  const resetForm = () => {
    setEditingRubberId(null);
    setBrand(firstBrand);
    setSeries(getSeriesOptions(firstBrand)[0]?.series ?? "");
    setColor("black");
    setSpongeThickness(2.1);
    setShowForm(false);
  };

  const submitRubber = () => {
    if (!brand || !series) return;
    if (editingRubberId) {
      updateRubber({ rubberId: editingRubberId, brand, series, color, spongeThickness });
      resetForm();
      return;
    }
    const newRubberId = addRubber({ brand, series, color, spongeThickness });

    if (pendingAssign?.racketId && pendingAssign?.side) {
      const ok = assignRubberToRacket({
        racketId: pendingAssign.racketId,
        side: pendingAssign.side,
        rubberId: newRubberId,
      });
      if (!ok) {
        Alert.alert("Assignment failed", "Could not assign the newly added rubber.");
      } else {
        navigation.navigate("Rackets", {
          screen: "RacketDetail",
          params: { racketId: pendingAssign.racketId },
        });
      }
      navigation.setParams({ pendingAssign: undefined });
    } else {
      setShowForm(false);
    }
  };

  const startEditing = (rubber) => {
    setEditingRubberId(rubber.id);
    setBrand(rubber.brand);
    setSeries(rubber.series);
    setColor(rubber.color ?? "black");
    setSpongeThickness(rubber.spongeThickness ?? 2.1);
    setShowForm(true);
  };

  const confirmDelete = (rubber) => {
    Alert.alert(
      "Delete rubber?",
      `${rubber.brand} ${rubber.series} will be removed from inventory and unassigned from rackets.`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: () => deleteRubber(rubber.id) },
      ]
    );
  };

  const moveItem = (list, fromIndex, toIndex) => {
    const next = [...list];
    const [moved] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, moved);
    return next;
  };

  return (
    <View style={styles.page}>
      <Text style={styles.title}>My Rubber Inventory</Text>

      <DragList
        containerStyle={styles.list}
        data={rubbers}
        keyExtractor={(item) => item.id}
        onReordered={(fromIndex, toIndex) => reorderRubbers(moveItem(rubbers, fromIndex, toIndex))}
        ListEmptyComponent={<Text style={styles.empty}>No rubbers yet.</Text>}
        renderItem={({ item, onDragStart, onDragEnd, isActive }) => {
          const durability = getDurability(item.brand, item.series);
          const health = getHealth(item.hoursPlayed, skillLevel, durability);
          return (
            <View style={[styles.card, isActive && styles.cardActive]}>
              <View style={styles.cardHeader}>
                <View style={styles.cardTitleRow}>
                  <View style={styles.rubberColorIconWrap}>
                    <Ionicons name="ellipse" size={14} color={getColorHex(item.color)} />
                  </View>
                  <Text style={styles.cardTitle}>
                    {item.brand} {item.series}
                  </Text>
                </View>
              </View>
              <View style={styles.cardHeaderActions}>
                <View style={styles.headerButtons}>
                  <Pressable style={styles.dragHandle} onPressIn={onDragStart} onPressOut={onDragEnd}>
                    <Ionicons name="reorder-three" size={18} color="#AFC0D8" />
                  </Pressable>
                  <Text style={styles.dragHint}>Drag</Text>
                </View>
                <Pressable style={styles.trashBtn} onPress={() => confirmDelete(item)} hitSlop={8}>
                  <Ionicons name="trash-outline" size={18} color="#FFBDCD" />
                </Pressable>
              </View>
              <Text style={styles.cardSub}>
                Played: {item.hoursPlayed}h | Health: {health}% | Sponge:{" "}
                {(item.spongeThickness ?? 2.1).toFixed(1)}mm
              </Text>
              <View style={styles.cardActions}>
                <Pressable style={styles.editBtn} onPress={() => startEditing(item)}>
                  <Text style={styles.editBtnText}>Edit</Text>
                </Pressable>
              </View>
            </View>
          );
        }}
      />

      {showForm ? (
        <View style={styles.pickerBox}>
          <Text style={styles.label}>Brand</Text>
          <Picker
            selectedValue={brand}
            onValueChange={onBrandChange}
            style={styles.picker}
            dropdownIconColor="#fff"
          >
            {brands.map((b) => (
              <Picker.Item key={b} label={b} value={b} color={pickerItemColor} />
            ))}
          </Picker>

          <Text style={styles.label}>Series</Text>
          <Picker
            selectedValue={series}
            onValueChange={setSeries}
            style={styles.picker}
            dropdownIconColor="#fff"
          >
            {currentSeriesOptions.map((entry) => (
              <Picker.Item
                key={`${brand}-${entry.series}`}
                label={entry.series}
                value={entry.series}
                color={pickerItemColor}
              />
            ))}
          </Picker>

          <Text style={styles.label}>Color</Text>
          <View style={styles.colorRow}>
            {RUBBER_COLORS.map((choice) => (
              <Pressable
                key={choice.id}
                style={[styles.colorChip, color === choice.id ? styles.colorChipActive : null]}
                onPress={() => setColor(choice.id)}
              >
                <View style={styles.colorDotWrap}>
                  <Ionicons name="ellipse" size={16} color={choice.value} />
                </View>
                <Text style={styles.colorChipText}>{choice.label}</Text>
              </Pressable>
            ))}
          </View>

          <Text style={styles.label}>Sponge Thickness</Text>
          <Picker
            selectedValue={spongeThickness}
            onValueChange={setSpongeThickness}
            style={styles.picker}
            dropdownIconColor="#fff"
          >
            {SPONGE_THICKNESS_OPTIONS.map((value) => (
              <Picker.Item
                key={`thickness-${value.toFixed(1)}`}
                label={`${value.toFixed(1)}mm`}
                value={value}
                color={pickerItemColor}
              />
            ))}
          </Picker>

          <Pressable style={styles.addBtn} onPress={submitRubber}>
            <Text style={styles.addBtnText}>
              {editingRubberId
                ? "Save Changes"
                : pendingAssign?.side
                  ? `Add & Assign to ${pendingAssign.side}`
                  : "Add Rubber"}
            </Text>
          </Pressable>
          <Pressable style={styles.cancelBtn} onPress={resetForm}>
            <Text style={styles.cancelBtnText}>{editingRubberId ? "Cancel Edit" : "Cancel"}</Text>
          </Pressable>
        </View>
      ) : null}

      {!showForm ? (
        <Pressable style={styles.bottomAddBtn} onPress={() => setShowForm(true)}>
          <Text style={styles.bottomAddBtnText}>Add Rubber</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#0B0E13", padding: 16 },
  title: { color: "#FFFFFF", fontSize: 22, fontWeight: "900", marginBottom: 12 },
  list: { flex: 1 },
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
  cancelBtn: {
    marginTop: 8,
    backgroundColor: "#2A3345",
    alignItems: "center",
    borderRadius: 10,
    paddingVertical: 10,
  },
  cancelBtnText: { color: "#D5DCEC", fontWeight: "800" },
  empty: { color: "#9AA4B6", marginTop: 28, textAlign: "center" },
  card: {
    backgroundColor: "#121A26",
    borderColor: "#2A3345",
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  cardActive: {
    opacity: 0.92,
  },
  cardTitle: { color: "#FFF", fontWeight: "800" },
  cardTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexShrink: 1,
  },
  rubberColorIconWrap: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F3F6FA",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  cardHeaderActions: {
    marginTop: 6,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerButtons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  dragHint: {
    color: "#6F7C91",
    fontSize: 12,
  },
  cardSub: { color: "#9AA4B6", marginTop: 4 },
  trashBtn: {
    width: 30,
    height: 30,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#3A2028",
  },
  dragHandle: {
    width: 30,
    height: 30,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1A2230",
  },
  cardActions: { flexDirection: "row", gap: 8, marginTop: 10 },
  editBtn: {
    minWidth: 90,
    alignItems: "center",
    backgroundColor: "#1F3A5F",
    borderRadius: 9,
    paddingVertical: 8,
    paddingHorizontal: 14,
    alignSelf: "flex-start",
  },
  editBtnText: { color: "#CFE6FF", fontWeight: "800" },
  colorRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 6,
  },
  colorChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    borderColor: "#2A3345",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 7,
    backgroundColor: "#162131",
  },
  colorChipActive: {
    borderColor: "#56A8FF",
    backgroundColor: "#1B2F47",
  },
  colorDotWrap: {
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F3F6FA",
  },
  colorChipText: { color: "#D7E3F6", fontWeight: "700", fontSize: 12 },
  bottomAddBtn: {
    backgroundColor: "#2ECC71",
    alignItems: "center",
    borderRadius: 11,
    paddingVertical: 12,
    marginTop: 10,
  },
  bottomAddBtnText: { color: "#0B0E13", fontWeight: "900", fontSize: 15 },
});
